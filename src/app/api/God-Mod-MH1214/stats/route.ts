import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic'; // Ensure this route is never cached

export async function GET(req: NextRequest) {
    try {
        // 1. Security Check: Verify User is Admin
        const cookieStore = await cookies();

        console.log('--- DEBUG COOKIES ---');
        console.log('Cookies received:', cookieStore.getAll().map(c => c.name));
        console.log('---------------------');

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

        if (!user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized: No User Session' }, { status: 401 });
        }

        // 2. Security Check: Verify against 'admins' table
        const { data: adminRecord, error: adminError } = await supabase
            .from('admins')
            .select('email')
            .eq('email', user.email)
            .single();

        if (adminError || !adminRecord) {
            console.error('Admin Stats 403: Not in Admins Table', user.email);
            return NextResponse.json({ error: 'Unauthorized: Access Denied' }, { status: 403 });
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

        // 3. Calculate User Growth (Last 7 Days)
        const users = data.users || [];
        const growthData = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const displayDate = d.toLocaleDateString('en-US', { weekday: 'short' });

            // Count users created on this date
            // Note: This matches strictly by day. In a large scale app, do this via SQL group by.
            const count = users.filter((u: any) => u.created_at.startsWith(dateStr)).length;

            growthData.push({ name: displayDate, value: count });
        }

        return NextResponse.json({
            totalUsers: userCount || 0,
            activeUsers: userCount || 0, // Placeholder, usually requires tracking active sessions
            watchlistItems: watchlistCount || 0,
            userGrowth: growthData
        });

    } catch (error: any) {
        console.error('Stats API Critical Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
