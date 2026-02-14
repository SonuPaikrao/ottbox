import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic'; // Ensure this route is never cached

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
            console.error('Admin Stats 403: Check Failed.');
            console.log('--- DEBUG AUTH ---');
            console.log('User:', user ? user.email : 'No User Session Found');
            console.log('Expected Admin:', adminEmail || 'ENV VAR MISSING');
            console.log('------------------');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // 2. Fetch Stats
        console.log('Admin Stats API: Fetching data (Dynamic)...');

        // Total Users: Fetch a batch of users to ensure we get a count even if 'total' is missing
        // This mirrors the User Management page which we know works.
        const { data, error: userError } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 1000 // Fetch up to 1000 users to get a reliable count for now
        });

        let userCount = 0;
        if (userError) {
            console.error('Stats Error (Users):', userError);
        } else {
            const users = data.users || [];
            // Use 'total' if available and valid, otherwise fallback to the length of fetched users
            const total = (data as any).total;
            userCount = (typeof total === 'number' && total > 0) ? total : users.length;

            console.log('Stats Check: Users Length =', users.length, 'Total Prop =', total, 'Final Count =', userCount);
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
