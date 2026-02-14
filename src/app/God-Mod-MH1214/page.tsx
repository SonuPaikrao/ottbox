'use client';

import { useEffect, useState } from 'react';
import { Users, Film, Activity, UserPlus } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0, // Using same as total for now or logic from API
        watchlistItems: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                console.log('Dashboard: Fetching stats...');
                // Add timestamp to prevent browser caching
                const res = await fetch(`/api/admin/stats?t=${Date.now()}`, {
                    cache: 'no-store',
                    credentials: 'include'
                });

                console.log('Dashboard: API Status:', res.status);

                if (res.ok) {
                    const data = await res.json();
                    console.log('Dashboard: Stats Data Received:', data);
                    setStats(data);
                } else {
                    console.error('Dashboard: Fetch failed with status', res.status);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: '#e50914' },
        { title: 'Active Watchlists', value: stats.watchlistItems, icon: Film, color: '#46d369' },
        { title: 'User Growth', value: '+12%', icon: Activity, color: '#ffa502' }, // Static for demo visuals
    ];

    if (loading) return <div style={{ color: '#fff' }}>Loading Stats...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '30px', borderLeft: '4px solid #e50914', paddingLeft: '15px' }}>
                Dashboard Overview
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {cards.map((card, index) => (
                    <div key={index} style={{
                        background: '#141414',
                        padding: '25px',
                        borderRadius: '12px',
                        border: '1px solid #333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}>
                        <div style={{
                            width: '60px', height: '60px',
                            borderRadius: '50%',
                            background: `${card.color}20`,
                            color: card.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <card.icon size={30} />
                        </div>
                        <div>
                            <p style={{ color: '#888', marginBottom: '5px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {card.title}
                            </p>
                            <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
                                {card.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions Placeholder */}
            <div style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Quick Actions</h2>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button style={{
                        padding: '12px 24px', background: '#e50914', color: 'white', border: 'none',
                        borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                    }}>
                        Manage Users
                    </button>
                    <button style={{
                        padding: '12px 24px', background: '#333', color: 'white', border: 'none',
                        borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                    }}>
                        View Reports
                    </button>
                </div>
            </div>
        </div>
    );
}
