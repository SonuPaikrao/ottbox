'use client';

import { useEffect, useState } from 'react';
import { Monitor, Smartphone, Tablet, Activity, MapPin, Globe } from 'lucide-react';

interface ActiveSession {
    userId: string;
    email: string;
    lastSignIn: string;
    deviceType: string;
    browser: string;
    os: string;
    ip: string;
}

export default function ActiveSessionsWidget() {
    const [sessions, setSessions] = useState<ActiveSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch('/api/God-Mod-MH1214/active-sessions');
                if (res.ok) {
                    const data = await res.json();
                    setSessions(data.activeSessions || []);
                }
            } catch (error) {
                console.error('Failed to fetch active sessions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
        const interval = setInterval(fetchSessions, 30000); // Refresh every 30s

        return () => clearInterval(interval);
    }, []);

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType.toLowerCase()) {
            case 'mobile':
                return <Smartphone size={18} color="#00d2d3" />;
            case 'tablet':
                return <Tablet size={18} color="#00d2d3" />;
            default:
                return <Monitor size={18} color="#00d2d3" />;
        }
    };

    return (
        <div style={{
            background: 'rgba(20, 20, 20, 0.7)',
            backdropFilter: 'blur(10px)',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={20} color="#46d369" /> Active Sessions
                </h3>
                <div style={{
                    background: '#46d369',
                    color: '#000',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                }}>
                    {sessions.length} Online
                </div>
            </div>

            {loading ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Loading sessions...</p>
            ) : sessions.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No active sessions</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                    {sessions.map((session) => (
                        <div
                            key={session.userId}
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '10px',
                                padding: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px'
                            }}
                        >
                            {/* Device Icon */}
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: 'rgba(0, 210, 211, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {getDeviceIcon(session.deviceType)}
                            </div>

                            {/* Session Info */}
                            <div style={{ flex: 1 }}>
                                <div style={{ color: '#fff', fontWeight: 600, marginBottom: '4px' }}>
                                    {session.email}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                    <span>🖥️ {session.deviceType}</span>
                                    <span>🌐 {session.browser}</span>
                                    <span>💻 {session.os}</span>
                                    {session.ip !== 'N/A' && <span>📍 {session.ip}</span>}
                                </div>
                            </div>

                            {/* Last Active */}
                            <div style={{ fontSize: '0.75rem', color: '#666', textAlign: 'right' }}>
                                {new Date(session.lastSignIn).toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
