import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Helper to parse user agent
function parseUserAgent(ua: string) {
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(ua);
    const isTablet = /tablet|ipad/i.test(ua);

    let browser = 'Unknown';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';

    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS')) os = 'iOS';

    const deviceType = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';

    return { deviceType, browser, os };
}

export async function GET(req: NextRequest) {
    try {
        // 1. Auth Guard
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Admin Check
        const { data: adminRecord } = await supabase.from('admins').select('email').eq('email', user.email).single();
        if (!adminRecord) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Admin client not available' }, { status: 500 });
        }

        // 2. Fetch all users with their auth metadata
        const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
        if (usersError) throw usersError;

        // 3. Get active sessions (users who signed in recently, e.g., last 30 minutes)
        const now = new Date();
        const thirtyMinsAgo = new Date(now.getTime() - 30 * 60 * 1000);

        const activeSessions = usersData.users
            .filter(u => {
                if (!u.last_sign_in_at) return false;
                const lastSignIn = new Date(u.last_sign_in_at);
                return lastSignIn > thirtyMinsAgo;
            })
            .map(u => {
                // Extract device info from user agent (if available in app_metadata)
                const userAgent = u.app_metadata?.user_agent || u.user_metadata?.user_agent || 'Unknown';
                const { deviceType, browser, os } = parseUserAgent(userAgent);

                return {
                    userId: u.id,
                    email: u.email,
                    lastSignIn: u.last_sign_in_at,
                    deviceType,
                    browser,
                    os,
                    // IP would be in audit logs or app_metadata if you store it
                    ip: u.app_metadata?.last_ip || 'N/A',
                };
            });

        return NextResponse.json({
            activeSessions,
            count: activeSessions.length,
            timestamp: now.toISOString()
        });

    } catch (error: any) {
        console.error('Active sessions fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
