import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
    try {
        const { channelId } = await req.json();

        if (!channelId) {
            return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // 1. Verify the mobile user has a valid session using the Bearer token
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.replace(/^Bearer\s+/i, '');

        if (!token) {
            return NextResponse.json({ error: 'Missing authentication token' }, { status: 401 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user }, error: sessionError } = await supabase.auth.getUser(token);

        if (sessionError || !user?.email) {
            return NextResponse.json({ error: 'Unauthorized. Please log in first on your phone.' }, { status: 401 });
        }

        // 2. Generate a one-time magic link for the logged-in mobile user
        // This does NOT send any email — we extract and use the action_link directly
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: user.email,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
            }
        });

        if (error || !data?.properties?.action_link) {
            console.error('QR Link generation error:', error);
            return NextResponse.json({ error: 'Failed to generate secure token' }, { status: 500 });
        }

        const actionLink = data.properties.action_link;

        // 3. Broadcast the action_link over Supabase Realtime to the waiting desktop
        const channel = supabaseAdmin.channel(`qr-login:${channelId}`);
        await channel.send({
            type: 'broadcast',
            event: 'approved',
            payload: { action_link: actionLink }
        });
        await supabaseAdmin.removeChannel(channel);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('QR Login API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
