import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
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

        if (!supabaseAdmin) return NextResponse.json({ error: 'Admin client not available' }, { status: 500 });

        const body = await req.json();
        const { title, message, type, target, userId } = body;
        // target: 'all' | 'user'

        if (target === 'all') {
            // For global notifications, we can either:
            // 1. Insert one record with is_global = true (Efficient, but tracking 'read' status per user is hard without a join table)
            // 2. Insert individual records for ALL users (Heavy)

            // For this "Popup Alert" requirement, usually a global record is best.
            // But if we want persistent "Inbox", we need individual records OR a 'user_notifications_read' table.
            // Let's go with creating ONE global notification for now for 'Popups', 
            // OR if the user wants "Mass Notification" in the sense of emailing everyone, that's different.

            // User Request: "Mass Notification System: Send popup alerts or emails to specific users or everyone."

            // Let's implement Global Popup style for now as it's easier and lighter.
            const { error } = await supabaseAdmin.from('notifications').insert({
                title,
                message,
                type: type || 'info',
                is_global: true
            });
            if (error) throw error;

        } else if (target === 'user' && userId) {
            const { error } = await supabaseAdmin.from('notifications').insert({
                user_id: userId,
                title,
                message,
                type: type || 'info',
                is_global: false
            });
            if (error) throw error;
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
