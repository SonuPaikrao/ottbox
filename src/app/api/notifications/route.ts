import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Admin client not available' }, { status: 500 });
        }

        // Get current user (if logged in)
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
        );
        const { data: { user } } = await supabase.auth.getUser();

        let notifications = [];

        if (user) {
            // Logged in user: fetch global + user-specific notifications
            const { data, error } = await supabaseAdmin
                .from('notifications')
                .select('*')
                .or(`is_global.eq.true,user_id.eq.${user.id}`)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            notifications = data || [];
        } else {
            // Not logged in: only global notifications
            const { data, error } = await supabaseAdmin
                .from('notifications')
                .select('*')
                .eq('is_global', true)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            notifications = data || [];
        }

        return NextResponse.json({ notifications });

    } catch (error: any) {
        console.error('Notification fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
