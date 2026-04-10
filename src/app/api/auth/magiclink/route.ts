import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendMagicLinkEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // 1. Generate Magic Link via Supabase Admin API
        // This generates the link but does NOT send the default Supabase email.
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
            }
        });

        if (error) {
            console.error('Magic Link generation error:', error);
            // Don't expose internal errors if user doesn't exist, just abstract it or allow signup
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const magicLinkUrl = data?.properties?.action_link;

        if (!magicLinkUrl) {
            return NextResponse.json({ error: 'Failed to generate secure link' }, { status: 500 });
        }

        // 2. Send Custom Premium Email with the Magic Link
        const emailResult = await sendMagicLinkEmail(email, magicLinkUrl);

        if (!emailResult.success) {
            return NextResponse.json({ 
                error: 'Link generated but failed to send email.', 
                details: emailResult.error 
            }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Magic link sent successfully' });

    } catch (error) {
        console.error('Magic Link API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
