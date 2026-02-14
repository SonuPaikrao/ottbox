import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        // Fetch latest 20 logs
        const { data: logs, error } = await supabase
            .from('analytics_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        // Process Device Stats
        // We can do this in SQL but let's do it in JS for flexibility with small datasets
        const deviceStats: Record<string, number> = { Mobile: 0, Desktop: 0, Tablet: 0 };

        // Fetch a larger sample for stats if needed, or just use these 20? 
        // Better to fetch a separate aggregate query for stats.
        // Let's do a second query for aggregates (last 24h)

        const { data: allStats, error: statsError } = await supabase
            .from('analytics_logs')
            .select('device_type')
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24h

        if (!statsError && allStats) {
            allStats.forEach((log: any) => {
                const type = log.device_type || 'Desktop';
                if (deviceStats[type] !== undefined) deviceStats[type]++;
                else deviceStats['Desktop']++; // Default fallback
            });
        }

        // Format Activity Feed
        const activityFeed = logs.map((log: any) => ({
            user: log.user_id ? 'Authenticated User' : `Visitor (${log.city || 'Unknown'})`,
            action: log.activity_type === 'visit' ? `Visited from ${log.device_type || 'Unknown Device'}` : log.activity_type,
            time: new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            color: log.activity_type === 'visit' ? '#46d369' : '#ffa502',
            icon: log.device_type
        }));

        // Format Device Data for Chart
        const totalDevices = Object.values(deviceStats).reduce((a, b) => a + b, 0) || 1;
        const deviceChartData = [
            { name: 'Mobile', value: Math.round((deviceStats['Mobile'] / totalDevices) * 100), color: '#e50914' },
            { name: 'Desktop', value: Math.round((deviceStats['Desktop'] / totalDevices) * 100), color: '#46d369' },
            { name: 'Tablet', value: Math.round((deviceStats['Tablet'] / totalDevices) * 100), color: '#ffa502' },
        ];

        return NextResponse.json({
            activityFeed,
            deviceStats: deviceChartData
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
