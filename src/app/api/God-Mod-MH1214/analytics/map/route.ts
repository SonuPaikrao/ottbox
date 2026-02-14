import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
    try {
        // Fetch valid coords from logs
        const { data, error } = await supabase
            .from('analytics_logs')
            .select('city, country, latitude, longitude')
            .not('latitude', 'is', null)
            .not('longitude', 'is', null);

        if (error) throw error;

        // Group by City/Location to avoid stacking dots too much
        // For simplicity in this version, we just return unique visits or latest ones.
        // Let's return raw points for now, maybe limit to last 100 for performance if needed.

        const locations = data.map((log: any) => ({
            name: log.city || log.country,
            coordinates: [log.longitude, log.latitude],
            value: 1 // We can aggregate later
        }));

        return NextResponse.json({ locations });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
