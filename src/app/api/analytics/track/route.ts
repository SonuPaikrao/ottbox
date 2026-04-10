import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client for bypassing RLS if needed, though we set RLS to allow inserts.
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { ip, country, city, latitude, longitude, region } = body;

        if (!ip || !latitude || !longitude) {
            return NextResponse.json({ error: 'Missing Data' }, { status: 400 });
        }

        // Get User ID if authenticated (optional)
        // const authHeader = req.headers.get('Authorization'); 
        // We'll rely on the client sending user_id if we want, or just track anon for now

        // Log to DB
        const { error } = await supabase
            .from('analytics_logs')
            .insert({
                what_location: 'Visit', // Placeholder if we update schema later
                ip_address: ip,
                country,
                city,
                region,
                latitude,
                longitude,
                user_id: body.userId || null // Optional: link to user if logged in
            });

        if (error) {
            console.error('Analytics DB Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
