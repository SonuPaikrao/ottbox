'use client';

import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Activity, Server, Database, Clock } from 'lucide-react';

export default function ServerMetrics() {
    const [data, setData] = useState<any[]>([]);
    const [current, setCurrent] = useState({
        dbLatency: 0,
        memory: 0,
        uptime: 0,
        status: 'Checking...'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/God-Mod-MH1214/system-health', { cache: 'no-store' });
                const metric = await res.json();

                const timeStr = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

                setCurrent({
                    dbLatency: metric.dbLatency,
                    memory: metric.memory.rss,
                    uptime: metric.uptime,
                    status: metric.status
                });

                setData(prev => {
                    const newData = [...prev, {
                        time: timeStr,
                        latency: metric.dbLatency,
                        memory: metric.memory.rss
                    }];
                    if (newData.length > 20) newData.shift(); // Keep last 20 points
                    return newData;
                });

            } catch (error) {
                console.error('Metrics Error:', error);
            }
        };

        // Initial fetch
        fetchData();

        // Poll every 3 seconds
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Status Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                    <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>System Status</p>
                    <h3 style={{ margin: '5px 0 0', color: current.status === 'Stable' ? '#46d369' : '#e50914' }}>
                        {current.status}
                    </h3>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                    <p style={{ color: '#888', fontSize: '0.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Database size={14} /> DB Latency
                    </p>
                    <h3 style={{ margin: '5px 0 0', color: '#fff' }}>{current.dbLatency}ms</h3>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                    <p style={{ color: '#888', fontSize: '0.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Server size={14} /> Memory
                    </p>
                    <h3 style={{ margin: '5px 0 0', color: '#fff' }}>{current.memory} MB</h3>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                    <p style={{ color: '#888', fontSize: '0.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={14} /> Uptime
                    </p>
                    <h3 style={{ margin: '5px 0 0', color: '#fff' }}>{formatUptime(current.uptime)}</h3>
                </div>
            </div>

            {/* Live Chart */}
            <div style={{ height: '200px', width: '100%', marginTop: '10px' }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ background: '#000', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="latency" stroke="#e50914" strokeWidth={2} dot={false} name="DB Latency (ms)" />
                        <Line type="monotone" dataKey="memory" stroke="#46d369" strokeWidth={2} dot={false} name="Memory (MB)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
