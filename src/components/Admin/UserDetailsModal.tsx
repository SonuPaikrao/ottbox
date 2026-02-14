'use client';

import { useEffect, useState } from 'react';
import { X, ShieldAlert, Globe, Clock, Smartphone, AlertTriangle } from 'lucide-react';

interface UserDetailsModalProps {
    userId: string;
    onClose: () => void;
    onUpdate: () => void; // Refresh table
}

export default function UserDetailsModal({ userId, onClose, onUpdate }: UserDetailsModalProps) {
    const [user, setUser] = useState<any>(null);
    const [activity, setActivity] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('Activity');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`/api/God-Mod-MH1214/users/${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    setActivity(data.recentActivity);
                    setHistory(data.history || []);
                    setWatchlist(data.watchlist || []);
                }
            } catch (error) {
                console.error('Failed to fetch details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [userId]);

    const handleBanAction = async (action: 'ban' | 'unban') => {
        if (!confirm(`Are you sure you want to ${action.toUpperCase()} ${user?.email}?`)) return;

        setProcessing(true);
        try {
            const res = await fetch(`/api/God-Mod-MH1214/users/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });

            if (res.ok) {
                alert(`User ${action}ned successfully.`);
                onUpdate();
                onClose();
            } else {
                alert('Action failed.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#fff' }}>Loading God View...</div>
        </div>
    );

    const isBanned = user?.banned_until && new Date(user.banned_until) > new Date();

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
            <div
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }}
                onClick={onClose}
            ></div>

            <div style={{
                position: 'relative',
                width: '600px',
                maxWidth: '90vw',
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                animation: 'fadeIn 0.2s ease'
            }}>
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, #1a1a1a, #252525)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            background: isBanned ? '#e50914' : '#46d369',
                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.2rem', fontWeight: 800
                        }}>
                            {user?.email?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{user?.email}</h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>ID: {user?.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '25px', color: '#ddd' }}>

                    {/* Status Alert */}
                    <div style={{
                        padding: '15px', borderRadius: '8px', marginBottom: '20px',
                        background: isBanned ? 'rgba(229, 9, 20, 0.1)' : 'rgba(70, 211, 105, 0.1)',
                        border: `1px solid ${isBanned ? '#e50914' : '#46d369'}`,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {isBanned ? <ShieldAlert size={20} color="#e50914" /> : <ShieldAlert size={20} color="#46d369" />}
                            <span style={{ fontWeight: 600, color: isBanned ? '#e50914' : '#46d369' }}>
                                {isBanned ? `BANNED until ${new Date(user.banned_until).toLocaleDateString()}` : 'Account Active & Secure'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={async () => {
                                    if (!confirm(`⚠️ KILL SESSION WARNING ⚠️\n\nThis will force sign out ${user?.email} from ALL devices immediately.\n\nProceed?`)) return;
                                    setProcessing(true);
                                    try {
                                        await fetch(`/api/God-Mod-MH1214/users/${userId}`, {
                                            method: 'POST', body: JSON.stringify({ action: 'kill_sessions' })
                                        });
                                        alert('User sessions killed successfully.');
                                        onUpdate();
                                    } catch (e) { console.error(e); alert('Failed'); }
                                    setProcessing(false);
                                }}
                                disabled={processing}
                                style={{
                                    padding: '8px 16px', borderRadius: '6px',
                                    background: 'rgba(255, 165, 0, 0.2)', border: '1px solid orange',
                                    color: 'orange', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px'
                                }}
                            >
                                <AlertTriangle size={16} /> Kill Sessions
                            </button>
                            <button
                                onClick={() => handleBanAction(isBanned ? 'unban' : 'ban')}
                                disabled={processing}
                                style={{
                                    padding: '8px 16px', borderRadius: '6px',
                                    background: isBanned ? '#46d369' : '#e50914',
                                    color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600
                                }}
                            >
                                {processing ? '...' : (isBanned ? 'Unban User' : 'Ban User')}
                            </button>
                        </div>
                    </div>

                    {/* Badges & Roles */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                        {/* Verified Badge */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    padding: '8px', borderRadius: '50%',
                                    background: user?.app_metadata?.is_verified ? '#00d2d3' : '#333'
                                }}>
                                    <Globe size={18} color="#fff" />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 600, color: '#fff' }}>Verified Badge</p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>
                                        {user?.app_metadata?.is_verified ? 'Active' : 'Not Verified'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={async () => {
                                    if (!confirm('Toggle Verified Status?')) return;
                                    setProcessing(true);
                                    await fetch(`/api/God-Mod-MH1214/users/${userId}`, {
                                        method: 'POST', body: JSON.stringify({ action: 'toggle_verified' })
                                    });
                                    setProcessing(false);
                                    onUpdate();
                                    // wrapper to refresh local user data
                                    const res = await fetch(`/api/God-Mod-MH1214/users/${userId}`);
                                    const data = await res.json();
                                    setUser(data.user);
                                }}
                                disabled={processing}
                                style={{
                                    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', border: 'none',
                                    background: user?.app_metadata?.is_verified ? '#333' : '#00d2d3',
                                    color: user?.app_metadata?.is_verified ? '#888' : '#000', fontWeight: 600
                                }}
                            >
                                {user?.app_metadata?.is_verified ? 'Revoke' : 'Grant'}
                            </button>
                        </div>

                        {/* Premium Badge */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    padding: '8px', borderRadius: '50%',
                                    background: user?.app_metadata?.is_premium ? '#ffa502' : '#333'
                                }}>
                                    <Smartphone size={18} color="#fff" />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 600, color: '#fff' }}>Premium Plan</p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>
                                        {user?.app_metadata?.is_premium ? 'Active' : 'Free User'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={async () => {
                                    if (!confirm('Toggle Premium Status?')) return;
                                    setProcessing(true);
                                    await fetch(`/api/God-Mod-MH1214/users/${userId}`, {
                                        method: 'POST', body: JSON.stringify({ action: 'toggle_premium' })
                                    });
                                    setProcessing(false);
                                    onUpdate();
                                    const res = await fetch(`/api/God-Mod-MH1214/users/${userId}`);
                                    const data = await res.json();
                                    setUser(data.user);
                                }}
                                disabled={processing}
                                style={{
                                    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', border: 'none',
                                    background: user?.app_metadata?.is_premium ? '#333' : '#ffa502',
                                    color: user?.app_metadata?.is_premium ? '#888' : '#000', fontWeight: 600
                                }}
                            >
                                {user?.app_metadata?.is_premium ? 'Revoke' : 'Grant'}
                            </button>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px' }}>
                            <p style={{ margin: '0 0 5px', color: '#888', fontSize: '0.8rem' }}>Last Sign In</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Clock size={16} color="#ffa502" />
                                <span>{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</span>
                            </div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px' }}>
                            <p style={{ margin: '0 0 5px', color: '#888', fontSize: '0.8rem' }}>Account Created</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Clock size={16} color="#00d2d3" />
                                <span>{new Date(user?.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Data Tabs */}
                    <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #333', marginBottom: '15px' }}>
                        {['Activity', 'History', 'Watchlist'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    background: 'none', border: 'none',
                                    padding: '10px 0',
                                    color: activeTab === tab ? '#e50914' : '#888',
                                    borderBottom: activeTab === tab ? '2px solid #e50914' : 'none',
                                    cursor: 'pointer', fontWeight: 600
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div style={{ maxHeight: '250px', overflowY: 'auto', borderRadius: '8px', border: '1px solid #333', background: '#111' }}>

                        {/* ACTIVITY TAB */}
                        {activeTab === 'Activity' && (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead style={{ background: '#222', color: '#888', fontSize: '0.8rem', position: 'sticky', top: 0 }}>
                                    <tr>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Location</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Device</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activity.length > 0 ? activity.map((log, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                                            <td style={{ padding: '10px' }}>{log.city}, {log.country}</td>
                                            <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                {log.device_type === 'Mobile' ? <Smartphone size={14} /> : <Globe size={14} />} {log.os} / {log.browser}
                                            </td>
                                            <td style={{ padding: '10px', color: '#666', fontSize: '0.8rem' }}>
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No recent login activity.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {/* HISTORY TAB */}
                        {activeTab === 'History' && (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead style={{ background: '#222', color: '#888', fontSize: '0.8rem', position: 'sticky', top: 0 }}>
                                    <tr>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Title</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Type</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Watched</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.length > 0 ? history.map((item: any, i: number) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                                            <td style={{ padding: '10px', color: '#fff' }}>{item.title}</td>
                                            <td style={{ padding: '10px', textTransform: 'capitalize', color: '#aaa' }}>{item.media_type}</td>
                                            <td style={{ padding: '10px', color: '#666', fontSize: '0.8rem' }}>{new Date(item.last_watched).toLocaleDateString()}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No watch history found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {/* WATCHLIST TAB */}
                        {activeTab === 'Watchlist' && (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead style={{ background: '#222', color: '#888', fontSize: '0.8rem', position: 'sticky', top: 0 }}>
                                    <tr>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Title</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Added</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {watchlist.length > 0 ? watchlist.map((item: any, i: number) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                                            <td style={{ padding: '10px', color: '#fff' }}>{item.title}</td>
                                            <td style={{ padding: '10px', color: '#666', fontSize: '0.8rem' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={2} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Watchlist is empty.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
