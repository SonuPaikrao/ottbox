import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// POST /api/search-log/click
// Body: { query: string, content_id: string, content_title: string }
// Called when user clicks a search result — marks the search as a conversion
export async function POST(req: NextRequest) {
    try {
        const { query, content_id, content_title } = await req.json();
        if (!query || !content_id) return NextResponse.json({ ok: false });

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { cookies: { get: (n) => cookieStore.get(n)?.value } }
        );

        const { data: { user } } = await supabase.auth.getUser();

        // Find the most recent search log for this query (within last 10 min) and update it
        const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        const { data: logs } = await supabase
            .from('search_logs')
            .select('id')
            .eq('query', query.trim().toLowerCase())
            .is('clicked_content_id', null)
            .gte('created_at', tenMinAgo)
            .order('created_at', { ascending: false })
            .limit(1);

        if (logs && logs.length > 0) {
            await supabase.from('search_logs').update({
                clicked_content_id: String(content_id),
                clicked_content_title: content_title,
            }).eq('id', logs[0].id);
        } else {
            // Insert a fresh log with the click already set (e.g. direct URL access)
            await supabase.from('search_logs').insert({
                query: query.trim().toLowerCase(),
                results_count: 1,
                clicked_content_id: String(content_id),
                clicked_content_title: content_title,
                user_id: user?.id ?? null,
            });
        }

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: false });
    }
}
