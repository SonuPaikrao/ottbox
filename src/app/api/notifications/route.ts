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

        // STEP 1: Fetch ONLY is_active = true notifications — simple guaranteed DB filter
        const { data, error } = await supabaseAdmin
            .from('notifications')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        // STEP 2: JS-side filter — show global ones + user-specific ones if logged in
        const all = data || [];
        const notifications = all
            .filter((n: any) => n.is_global === true || (user && n.user_id === user.id))
            .slice(0, 5);

        return NextResponse.json({ notifications });

    } catch (error: any) {
        console.error('Notification fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
