
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // 1. Generate Signup Link (This creates the user if they don't exist)
        // "type": "signup" returns a link that confirms the user's email.
        // It does NOT send an email automatically.
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'signup',
            email,
            password,
            options: {
                data: { full_name: email.split('@')[0] } // Default metadata
            }
        });

        if (error) {
            console.error('Signup error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const { user, properties } = data;
        const verificationLink = properties?.action_link;

        if (!user || !verificationLink) {
            return NextResponse.json({ error: 'Failed to generate signup link' }, { status: 500 });
        }

        // 2. Send Custom Premium Email with the Link AND Password
        const emailResult = await sendWelcomeEmail(
            email,
            user.user_metadata.full_name || 'User',
            password,
            verificationLink
        );

        if (!emailResult.success) {
            // Note: User is created, but email failed. 
            // We might want to warn the frontend, but the user exists now.
            return NextResponse.json({ error: 'Account created but failed to send email.', details: emailResult.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Account created. Check email.' });

    } catch (error) {
        console.error('Manual Signup API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
