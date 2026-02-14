
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// GET: List all users
export async function GET(req: NextRequest) {
    try {
        // 1. Security Check
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

        if (!user || user.email !== adminEmail) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Admin client error' }, { status: 500 });
        }

        // 2. Fetch Users
        // listUsers returns auth users. We might also want profile data (avatar, name) if stored in public.profiles
        // For now, let's fetch auth users and try to join with profiles if possible, or just return auth data.
        // Basic listUsers:
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 100 // Limit for now
        });

        if (error) throw error;

        // Enhance with profile data if needed? 
        // For now, let's return raw auth users which contain email, last_sign_in_at, created_at, app_metadata (provider)

        return NextResponse.json({ users });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Delete a user
export async function DELETE(req: NextRequest) {
    try {
        // 1. Security Check
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

        if (!user || user.email !== adminEmail) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Admin client error' }, { status: 500 });
        }

        // 2. Parse Body
        const { userId } = await req.json();
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Prevent deleting self (Admin)
        if (user.id === userId) {
            return NextResponse.json({ error: 'Cannot delete your own admin account!' }, { status: 400 });
        }

        // 3. Delete User
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
