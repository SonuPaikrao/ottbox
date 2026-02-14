import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        console.log('🔔 [Notification API] Request received');

        // 1. Auth Guard
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
        );
        const { data: { user } } = await supabase.auth.getUser();
        console.log('👤 [Notification API] User:', user?.email);

        if (!user) {
            console.log('❌ [Notification API] Unauthorized - no user');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Admin Check
        const { data: adminRecord } = await supabase.from('admins').select('email').eq('email', user.email).single();
        console.log('🛡️ [Notification API] Admin check:', adminRecord ? 'PASSED' : 'FAILED');

        if (!adminRecord) {
            console.log('❌ [Notification API] Forbidden - not admin');
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (!supabaseAdmin) {
            console.log('❌ [Notification API] Admin client not available');
            return NextResponse.json({ error: 'Admin client not available' }, { status: 500 });
        }

        const body = await req.json();
        const { title, message, type, target, userId } = body;
        console.log('📋 [Notification API] Payload:', { title, message, type, target, userId });

        if (target === 'all') {
            console.log('🌍 [Notification API] Sending global notification');
            const { error, data } = await supabaseAdmin.from('notifications').insert({
                title,
                message,
                type: type || 'info',
                is_global: true
            }).select();

            if (error) {
                console.error('❌ [Notification API] Insert error:', error);
                throw error;
            }
            console.log('✅ [Notification API] Global notification inserted:', data);

        } else if (target === 'user' && userId) {
            console.log('👤 [Notification API] Sending user-specific notification to:', userId);
            const { error, data } = await supabaseAdmin.from('notifications').insert({
                user_id: userId,
                title,
                message,
                type: type || 'info',
                is_global: false
            }).select();

            if (error) {
                console.error('❌ [Notification API] Insert error:', error);
                throw error;
            }
            console.log('✅ [Notification API] User notification inserted:', data);
        }

        console.log('✅ [Notification API] Success');
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('❌ [Notification API] Catch block error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
