import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    try {
        // 1. Security Check: Verify User is Admin
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

        if (!user || user.email !== adminEmail) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server configuration error: Admin client not initialized' }, { status: 500 });
        }

        // 2. Fetch Stats
        console.log('Admin Stats API: Fetching data...');

        // Total Users: Use listUsers() to get the total count
        const { data, error: userError } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 1
        });

        let userCount = 0;
        if (userError) {
            console.error('Stats Error (Users):', userError);
        } else {
            // TypeScript doesn't always see 'total' in the union type, so we cast to any or check
            userCount = (data as any).total || 0;
            console.log('Stats Check: User Count (from listUsers) =', userCount);
        }

        // Watchlist Count: Query the table directly
        const { count: watchlistCount, error: countError } = await supabaseAdmin
            .from('watchlist')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('Stats Error (Watchlist):', countError);
        } else {
            console.log('Stats Check: Watchlist Count =', watchlistCount);
        }

        return NextResponse.json({
            totalUsers: userCount || 0,
            activeUsers: userCount || 0, // Placeholder, usually requires tracking active sessions
            watchlistItems: watchlistCount || 0
        });

    } catch (error: any) {
        console.error('Stats API Critical Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
