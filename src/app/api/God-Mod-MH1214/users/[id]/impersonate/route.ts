import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Reuse the POST method for actions? Or create a new route?
// Since we already have [id]/route.ts handling POST for 'ban', we can extend it or create a specific one.
// Let's create a specific one for clarity: /api/God-Mod-MH1214/users/[id]/impersonate/route.ts
// But wait, the previous tool call was just updating [id]/route.ts.
// I will create a new file for impersonate to keep it clean.

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // 1. Auth Guard
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

        if (!supabaseAdmin) return NextResponse.json({ error: 'Admin client configuration error' }, { status: 500 });

        // 2. Get User Email
        const { data: targetUser, error: userError } = await supabaseAdmin.auth.admin.getUserById(id);
        if (userError || !targetUser.user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // 3. Generate Magic Link
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: targetUser.user.email!,
        });

        if (linkError) throw linkError;

        // 4. Return the link (Admin must open in Incognito)
        return NextResponse.json({
            success: true,
            magicLink: linkData.properties?.action_link
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
