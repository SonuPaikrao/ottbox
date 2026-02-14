'use client';

import { useEffect, useState } from 'react';
import { Users, Film, Activity, Server } from 'lucide-react';
import StatCard from '@/components/Admin/Widgets/StatCard';
import ChartCard from '@/components/Admin/Widgets/ChartCard';
import AnalyticsChart from '@/components/Admin/Charts/AreaChart';
import ServerMetrics from '@/components/Admin/Charts/ServerMetrics';
import NotificationCenter from '@/components/Admin/NotificationCenter';
import ActiveSessionsWidget from '@/components/Admin/ActiveSessionsWidget';

export default function GodModeDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        watchlistItems: 0,
        userGrowth: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const now = Date.now();
                const statsRes = await fetch(`/api/God-Mod-MH1214/stats?t=${now}`, { cache: 'no-store' });
                if (statsRes.ok) setStats(await statsRes.json());
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    margin: 0,
                    background: 'linear-gradient(135deg, #e50914, #ff6b6b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px'
                }}>
                    The Eye of God
                </h1>
                <p style={{ color: '#888', margin: 0 }}>Real-time System Overview & Analytics</p>
            </div>

            {/* Premium Stat Cards */}
            <div className="dashboard-grid">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="#e50914"
                    trend="Live"
                    loading={loading}
                />
                <StatCard
                    title="Watchlist Items"
                    value={stats.watchlistItems}
                    icon={Film}
                    color="#46d369"
                    trend="Database"
                    loading={loading}
                />
                <StatCard
                    title="Active Sessions"
                    value={stats.activeUsers}
                    icon={Activity}
                    color="#ffa502"
                    trend="Approx"
                    loading={loading}
                />
                <StatCard
                    title="System Health"
                    value="98%"
                    icon={Server}
                    color="#00d2d3"
                    trend="Stable"
                    loading={false}
                />
            </div>

            {/* Charts & Widgets Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginTop: '32px' }}>
                {/* User Growth Chart */}
                <ChartCard title="User Growth" subtitle="Last 7 Days" fullWidth>
                    {stats.userGrowth && stats.userGrowth.length > 0 ? (
                        <AnalyticsChart data={stats.userGrowth} color="#e50914" />
                    ) : (
                        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                            No user growth data available yet.
                        </div>
                    )}
                </ChartCard>

                {/* Server Metrics */}
                <ChartCard title="System Health Monitor" subtitle="Live Polling (3s)" fullWidth>
                    <ServerMetrics />
                </ChartCard>

                {/* Active Sessions */}
                <ChartCard title="Active Sessions" subtitle="Real-time user sessions" fullWidth>
                    <ActiveSessionsWidget />
                </ChartCard>

                {/* Notification Center */}
                <ChartCard title="Mass Notifications" subtitle="Send alerts to users" fullWidth>
                    <NotificationCenter />
                </ChartCard>
            </div>
        </div>
    );
}
