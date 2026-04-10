import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// POST /api/track
// Body: { events: Event[] }
// Silently logs all user behavioral events for ML training
export async function POST(req: NextRequest) {
    try {
        const { events } = await req.json();
        if (!events || !Array.isArray(events) || events.length === 0) {
            return NextResponse.json({ ok: false });
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { cookies: { get: (n) => cookieStore.get(n)?.value } }
        );

        // Only track logged-in users
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ ok: false, reason: 'not_logged_in' });

        const rows = events.map((e: any) => ({
            user_id: user.id,
            session_id: e.session_id || 'unknown',
            event_type: e.event_type,
            content_id: e.content_id ? String(e.content_id) : null,
            content_title: e.content_title || null,
            content_type: e.content_type || null,
            content_genre: e.content_genre || null,
            metadata: e.metadata || {},
        }));

        await supabase.from('user_events').insert(rows);

        return NextResponse.json({ ok: true, tracked: rows.length });
    } catch {
        return NextResponse.json({ ok: false });
    }
}
