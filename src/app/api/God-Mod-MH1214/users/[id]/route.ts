import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // 1. Auth Guard
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
        );
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { data: adminRecord } = await supabase.from('admins').select('email').eq('email', user.email).single();
        if (!adminRecord) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // 2. Fetch User Data
        if (!supabaseAdmin) return NextResponse.json({ error: 'Admin client not available' }, { status: 500 });

        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(id);
        if (userError || !userData.user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // 3. Fetch Analytics Logs (IP History)
        const { data: logs } = await supabaseAdmin
            .from('analytics_logs')
            .select('ip_address, city, country, device_type, os, browser, created_at')
            .eq('user_id', id)
            .order('created_at', { ascending: false })
            .limit(20);

        // 4. Fetch Watch History (Real Table: watch_history)
        const { data: history } = await supabaseAdmin
            .from('watch_history')
            .select('title, media_type, last_watched')
            .eq('user_id', id)
            .order('last_watched', { ascending: false })
            .limit(20);

        // 5. Fetch Watchlist
        const { data: watchlist } = await supabaseAdmin
            .from('watchlist')
            .select('title, media_type, created_at')
            .eq('user_id', id)
            .order('created_at', { ascending: false })
            .limit(20);

        return NextResponse.json({
            user: userData.user,
            recentActivity: logs || [],
            history: history || [],
            watchlist: watchlist || []
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { action, duration } = body; // action: 'ban' | 'unban'

        // 1. Auth Guard
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
        );
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { data: adminRecord } = await supabase.from('admins').select('email').eq('email', user.email).single();
        if (!adminRecord) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // Explicit Null Check for supabaseAdmin
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Admin client not available' }, { status: 500 });
        }

        // Strict Assignment: TS now knows adminClient is not null in this scope
        const adminClient = supabaseAdmin;

        if (action === 'ban') {
            // Ban logic
            const { error: banError } = await adminClient.auth.admin.updateUserById(id, {
                ban_duration: '876000h' // ~100 years
            });

            if (banError) throw banError;

        } else if (action === 'unban') {
            // Unban logic
            const { error: unbanError } = await adminClient.auth.admin.updateUserById(id, {
                ban_duration: '0'
            });
            if (unbanError) throw unbanError;

        } else if (action === 'toggle_verified') {
            const { data: currentUser, error: fetchError } = await adminClient.auth.admin.getUserById(id);
            if (fetchError) throw fetchError;

            const currentStatus = currentUser.user.app_metadata.is_verified || false;

            const { error: updateError } = await adminClient.auth.admin.updateUserById(id, {
                app_metadata: { ...currentUser.user.app_metadata, is_verified: !currentStatus }
            });
            if (updateError) throw updateError;

        } else if (action === 'toggle_premium') {
            const { data: currentUser, error: fetchError } = await adminClient.auth.admin.getUserById(id);
            if (fetchError) throw fetchError;

            const currentStatus = currentUser.user.app_metadata.is_premium || false;

            const { error: updateError } = await adminClient.auth.admin.updateUserById(id, {
                app_metadata: { ...currentUser.user.app_metadata, is_premium: !currentStatus }
            });
            if (updateError) throw updateError;

        } else if (action === 'kill_sessions') {
            const { error: signOutError } = await adminClient.auth.admin.signOut(id);
            if (signOutError) throw signOutError;
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
