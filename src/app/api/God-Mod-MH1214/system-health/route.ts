import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Measure Database Latency
        const start = performance.now();
        await supabase.from('admins').select('count', { count: 'exact', head: true });
        const end = performance.now();
        const dbLatency = Math.round(end - start);

        // 2. Get Process Memory (Node.js)
        const memory = process.memoryUsage();
        const rss = Math.round(memory.rss / 1024 / 1024); // MB
        const heap = Math.round(memory.heapUsed / 1024 / 1024); // MB

        // 3. Uptime
        const uptime = Math.round(process.uptime());

        // 4. Status
        let status = 'Stable';
        if (dbLatency > 500) status = 'Degraded';
        if (dbLatency > 2000) status = 'Critical';

        return NextResponse.json({
            timestamp: Date.now(),
            dbLatency,
            memory: { rss, heap },
            uptime,
            status
        });

    } catch (error: any) {
        return NextResponse.json({
            status: 'Error',
            error: error.message,
            dbLatency: 0,
            memory: { rss: 0, heap: 0 }
        }, { status: 500 });
    }
}
