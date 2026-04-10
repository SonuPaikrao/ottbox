import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Separate admin client for inserts (bypasses RLS)
const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/track
// Body: { events: Event[] }
// Silently logs all user behavioral events for ML training
export async function POST(req: NextRequest) {
    try {
        const { events, access_token } = await req.json();
        if (!events || !Array.isArray(events) || events.length === 0) {
            return NextResponse.json({ ok: false });
        }

        // ✅ Use access_token from body for foolproof server-side auth (bypasses browser cookie issues)
        let userId = null;
        if (access_token) {
            const { data: { user } } = await adminClient.auth.getUser(access_token);
            if (user) userId = user.id;
        }
        
        // Only track logged-in users
        if (!userId) return NextResponse.json({ ok: false, reason: 'not_logged_in' });

        const rows = events.map((e: any) => ({
            user_id: userId,
            session_id: e.session_id || 'unknown',
            event_type: e.event_type,
            content_id: e.content_id ? String(e.content_id) : null,
            content_title: e.content_title || null,
            content_type: e.content_type || null,
            content_genre: e.content_genre || null,
            metadata: e.metadata || {},
        }));

        // ✅ Use service role admin client for insert (bypasses RLS)
        const { error } = await adminClient.from('user_events').insert(rows);
        if (error) {
            console.error('[track] insert error:', error.message);
            return NextResponse.json({ ok: false, error: error.message });
        }

        return NextResponse.json({ ok: true, tracked: rows.length });
    } catch (err: any) {
        console.error('[track] error:', err?.message);
        return NextResponse.json({ ok: false });
    }
}
