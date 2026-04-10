import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// POST /api/view-log
// Body: { content_id, content_title, content_type, poster_path, completion_pct }
// Called when user visits a title page (completion_pct = 0 = page view)
// Or when they interact with player (completion_pct = 25/50/75/100)
export async function POST(req: NextRequest) {
    try {
        const { content_id, content_title, content_type, poster_path, completion_pct } = await req.json();
        if (!content_id || !content_title) return NextResponse.json({ ok: false });

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { cookies: { get: (n) => cookieStore.get(n)?.value } }
        );

        const { data: { user } } = await supabase.auth.getUser();
        const watch_hour = new Date().getHours(); // 0-23 for heatmap

        await supabase.from('view_logs').insert({
            content_id: String(content_id),
            content_title,
            content_type: content_type ?? 'movie',
            poster_path: poster_path ?? null,
            completion_pct: completion_pct ?? 0,
            watch_hour,
            user_id: user?.id ?? null,
        });

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: false });
    }
}
