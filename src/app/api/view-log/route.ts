import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Admin client for inserts (bypasses RLS)
const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/view-log
export async function POST(req: NextRequest) {
    try {
        const { content_id, content_title, content_type, poster_path, completion_pct } = await req.json();
        if (!content_id || !content_title) return NextResponse.json({ ok: false });

        // ✅ Use ANON KEY to properly read session cookies
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // ← FIXED
            { cookies: { get: (n) => cookieStore.get(n)?.value } }
        );

        const { data: { user } } = await supabase.auth.getUser();
        const watch_hour = new Date().getHours();

        // ✅ Use admin client for insert
        await adminClient.from('view_logs').insert({
            content_id: String(content_id),
            content_title,
            content_type: content_type ?? 'movie',
            poster_path: poster_path ?? null,
            completion_pct: completion_pct ?? 0,
            watch_hour,
            user_id: user?.id ?? null, // nullable — guest views still tracked
        });

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        console.error('[view-log] error:', err?.message);
        return NextResponse.json({ ok: false });
    }
}
