'use client';

import { useEffect, useState } from 'react';
import { Users, Film, Activity, Server, Zap, Globe } from 'lucide-react';
import AnalyticsChart from '@/components/Admin/Charts/AreaChart';
import DeviceChart from '@/components/Admin/Charts/PieChart';
import MapChart from '@/components/Admin/Charts/MapChart';

// Mock Data for Charts (Will replace with real API data later)
const mockUserGrowth = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 550 },
    { name: 'Thu', value: 450 },
    { name: 'Fri', value: 600 },
    { name: 'Sat', value: 800 },
    { name: 'Sun', value: 750 },
];

const mockActivityFeed = [
    { user: 'John Doe', action: 'Signed up', time: '2 mins ago', color: '#46d369' },
    { user: 'Sarah Smith', action: 'Watched "Inception"', time: '15 mins ago', color: '#e50914' },
    { user: 'Mike Ross', action: 'Failed Login Attempt', time: '1 hour ago', color: '#ffa502' },
    { user: 'Admin', action: 'Updated System Settings', time: '2 hours ago', color: '#fff' },
];

export default function GodModeDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        watchlistItems: 0
    });
    const [mapData, setMapData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch General Stats
                const statsRes = await fetch(`/api/God-Mod-MH1214/stats?t=${Date.now()}`, { cache: 'no-store' });
                if (statsRes.ok) setStats(await statsRes.json());

                // Fetch Map Data
                const mapRes = await fetch(`/api/God-Mod-MH1214/analytics/map?t=${Date.now()}`, { cache: 'no-store' });
                if (mapRes.ok) {
                    const data = await mapRes.json();
                    setMapData(data.locations || []);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Users', value: stats.totalUsers || '0', icon: Users, color: '#e50914', trend: '+12%' },
        { title: 'Watchlist Items', value: stats.watchlistItems || '0', icon: Film, color: '#46d369', trend: '+5%' },
        { title: 'Active Sessions', value: stats.activeUsers || '0', icon: Activity, color: '#ffa502', trend: '+8%' },
        { title: 'System Health', value: '98%', icon: Server, color: '#00d2d3', trend: 'Stable' },
    ];

    if (loading) return (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            Initializing Eye of God...
        </div>
    );

    return (
        <div style={{ paddingBottom: '50px' }}>
            {/* Header */}
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #e50914, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        The Eye of God
                    </h1>
                    <p style={{ color: '#666', marginTop: '5px' }}>Real-time System Overview & Analytics</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ padding: '8px 16px', background: '#1a1a1a', borderRadius: '20px', fontSize: '0.8rem', color: '#46d369', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', background: '#46d369', borderRadius: '50%', boxShadow: '0 0 10px #46d369' }}></div>
                        Systems Online
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {cards.map((card, index) => (
                    <div key={index} style={{
                        background: 'rgba(20, 20, 20, 0.7)',
                        backdropFilter: 'blur(10px)',
                        padding: '25px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <div style={{
                                width: '50px', height: '50px', borderRadius: '12px',
                                background: `${card.color}15`, color: card.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <card.icon size={24} />
                            </div>
                            <span style={{ fontSize: '0.8rem', color: card.color, background: `${card.color}10`, padding: '4px 8px', borderRadius: '6px' }}>
                                {card.trend}
                            </span>
                        </div>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, marginBottom: '5px' }}>{card.value}</h3>
                        <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>{card.title}</p>
                    </div>
                ))}
            </div>

            {/* Charts & Feed Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

                {/* Main Chart */}
                <div style={{
                    background: 'rgba(20, 20, 20, 0.7)',
                    backdropFilter: 'blur(10px)',
                    padding: '25px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>User Growth</h3>
                        <select style={{ background: '#000', border: '1px solid #333', color: '#fff', padding: '5px 10px', borderRadius: '6px', fontSize: '0.9rem' }}>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <AnalyticsChart data={mockUserGrowth} color="#e50914" />
                </div>

                {/* Map Section - NEW REAL DATA FEATURE */}
                <div style={{
                    gridColumn: '1 / -1',
                    height: '500px',
                    background: 'rgba(20, 20, 20, 0.7)',
                    backdropFilter: 'blur(10px)',
                    padding: '25px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Globe size={24} color="#e50914" /> Live Global Activity
                        </h3>
                        <span style={{ fontSize: '0.9rem', color: '#46d369', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ width: '8px', height: '8px', background: '#46d369', borderRadius: '50%', boxShadow: '0 0 10px #46d369', animation: 'pulse 2s infinite' }} />
                            Real-time Data
                        </span>
                    </div>
                    {/* Map Container */}
                    <div style={{ flex: 1, width: '100%', height: '100%', minHeight: '400px', borderRadius: '12px', overflow: 'hidden', background: '#1a1a1a' }}>
                        <MapChart data={mapData} />
                    </div>
                </div>

                {/* Activity Feed */}
                <div style={{
                    background: 'rgba(20, 20, 20, 0.7)',
                    backdropFilter: 'blur(10px)',
                    padding: '25px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Zap size={18} color="#ffa502" /> Live Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {mockActivityFeed.map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, boxShadow: `0 0 10px ${item.color}` }}></div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>
                                        <span style={{ color: '#fff' }}>{item.user}</span> <span style={{ color: '#888' }}>{item.action}</span>
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#555', marginTop: '2px' }}>{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Device Stats - NEW SECTION */}
                <div style={{
                    background: 'rgba(20, 20, 20, 0.7)',
                    backdropFilter: 'blur(10px)',
                    padding: '25px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    gridColumn: '1 / -1' // Span full width on bottom
                }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px' }}>Device Breakdown</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <DeviceChart data={[
                                { name: 'Mobile', value: 65, color: '#e50914' },
                                { name: 'Desktop', value: 25, color: '#46d369' },
                                { name: 'Tablet', value: 10, color: '#ffa502' },
                            ]} />
                        </div>
                        <div style={{ flex: 1, padding: '20px', minWidth: '300px' }}>
                            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                <Globe size={20} color="#e50914" style={{ marginBottom: '10px' }} />
                                <h4 style={{ margin: 0 }}>Top Region: India</h4>
                                <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>45% of total traffic</p>
                            </div>
                            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                <Activity size={20} color="#46d369" style={{ marginBottom: '10px' }} />
                                <h4 style={{ margin: 0 }}>Avg. Watch Time</h4>
                                <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>42 Minutes / Session</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
