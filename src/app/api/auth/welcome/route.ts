
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const { userId, email, manualPassword, name } = await req.json();

        if (!email || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Check if we already sent the welcome email (idempotency)
        const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

        if (userError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check metadata flag
        if (user.user_metadata?.welcome_sent) {
            return NextResponse.json({ message: 'Welcome email already sent' });
        }

        let passwordToSend = manualPassword;

        // 2. Logic for Google Sign-In (No manual password provided) -> Generate Password
        if (!manualPassword) {
            // Generate a nice password: Initials + # + Random Numbers
            // e.g., "John Doe" -> "JD#8392"
            const initials = (name || 'User').split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
            const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit random
            const generatedPassword = `${initials}#${randomNum}`;

            passwordToSend = generatedPassword;

            // Update the user's password in Supabase
            // Note: This revoke refresh tokens, but valid access tokens work for ~1h.
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
                password: generatedPassword,
                user_metadata: { ...user.user_metadata, welcome_sent: true }
            });

            if (updateError) {
                console.error('Failed to update user password:', updateError);
                return NextResponse.json({ error: 'Failed to generate credentials' }, { status: 500 });
            }
        } else {
            // For Manual Sign Up, we just mark as sent
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
                user_metadata: { ...user.user_metadata, welcome_sent: true }
            });

            if (updateError) {
                console.error('Failed to update user metadata:', updateError);
            }
        }

        // 3. Send the Email
        const emailResult = await sendWelcomeEmail(email, name || 'User', passwordToSend);

        if (!emailResult.success) {
            return NextResponse.json({ error: 'Failed to send email', details: emailResult.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Welcome email sent successfully' });

    } catch (error) {
        console.error('Welcome API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
