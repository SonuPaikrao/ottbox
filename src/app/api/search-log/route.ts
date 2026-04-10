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
        const { query, results_count } = await req.json();
        if (!query || query.trim().length < 2) {
            return NextResponse.json({ ok: false });
        }

        // ✅ Use ANON KEY to properly read session cookies
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // ← FIXED
            { cookies: { get: (n) => cookieStore.get(n)?.value } }
        );

        // Get user id if logged in (optional — guest searches are also logged)
        const { data: { user } } = await supabase.auth.getUser();

        // ✅ Use admin client to bypass RLS
        await adminClient.from('search_logs').insert({
            query: query.trim().toLowerCase(),
            results_count: results_count ?? 0,
            user_id: user?.id ?? null,
        });

        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ ok: false });
    }
}
