import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/search-log
// Body: { query: string, results_count: number }
export async function POST(req: NextRequest) {
    try {
        const { query, results_count, access_token } = await req.json();
        if (!query || query.trim().length < 2) {
            return NextResponse.json({ ok: false });
        }

        let userId = null;
        if (access_token) {
            const { data: { user } } = await adminClient.auth.getUser(access_token);
            if (user) userId = user.id;
        }

        // ✅ Use admin client to bypass RLS
        await adminClient.from('search_logs').insert({
            query: query.trim().toLowerCase(),
            results_count: results_count ?? 0,
            user_id: userId,
        });

        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ ok: false });
    }
}
