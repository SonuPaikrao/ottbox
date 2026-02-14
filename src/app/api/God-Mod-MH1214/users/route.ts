import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        // 1. Auth Check (Copying standard Admin Guard)
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: adminRecord } = await supabase.from('admins').select('email').eq('email', user.email).single();
        if (!adminRecord) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // 2. Parse Query Params
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const query = url.searchParams.get('query') || '';

        // Explicit Null Check for supabaseAdmin
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Admin client not available' }, { status: 500 });
        }
        const adminClient = supabaseAdmin;

        // 3. Fetch Users via Admin API
        const { data, error } = await adminClient.auth.admin.listUsers({
            page: page,
            perPage: limit
        });

        if (error) throw error;

        let users = data.users;

        // Enhance user objects with "Banned" status
        const enhancedUsers = users.map(u => ({
            id: u.id,
            email: u.email,
            created_at: u.created_at,
            last_sign_in_at: u.last_sign_in_at,
            banned_until: u.banned_until,
            role: u.role,
            provider: u.app_metadata.provider || 'email',
            is_verified: u.app_metadata.is_verified || false,
            is_premium: u.app_metadata.is_premium || false
        }));

        // Filter if query is present (simple implementation)
        if (query) {
            const lowerQuery = query.toLowerCase();
            const filtered = enhancedUsers.filter(u =>
                u.email?.toLowerCase().includes(lowerQuery) ||
                u.id.toLowerCase().includes(lowerQuery)
            );
            return NextResponse.json({
                users: filtered,
                total: filtered.length,
                page,
                totalPages: Math.ceil(filtered.length / limit)
            });
        }

        return NextResponse.json({
            users: enhancedUsers,
            total: (data as any).total || 0, // 'total' might be available in response
            page,
            totalPages: (data as any).total ? Math.ceil((data as any).total / limit) : 1
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
