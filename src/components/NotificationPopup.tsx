'use client';

import { useEffect, useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    is_global: boolean;
    created_at: string;
}

export default function NotificationPopup() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [dismissed, setDismissed] = useState<string[]>([]);

    useEffect(() => {
        // Fetch notifications every 30 seconds
        const fetchNotifications = async () => {
            try {
                const res = await fetch('/api/notifications');
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data.notifications || []);
                }
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s

        return () => clearInterval(interval);
    }, []);

    const handleDismiss = (id: string) => {
        setDismissed([...dismissed, id]);
    };

    const visibleNotifications = notifications.filter(n => !dismissed.includes(n.id));

    if (visibleNotifications.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '400px'
        }}>
            {visibleNotifications.map((notification) => {
                const colorMap = {
                    success: '#46d369',
                    warning: '#ffa502',
                    error: '#e50914',
                    info: '#00d2d3'
                };

                const IconMap = {
                    success: CheckCircle,
                    warning: AlertTriangle,
                    error: AlertTriangle,
                    info: Info
                };

                const Icon = IconMap[notification.type];
                const color = colorMap[notification.type];

                return (
                    <div
                        key={notification.id}
                        style={{
                            background: '#1a1a1a',
                            borderLeft: `4px solid ${color}`,
                            padding: '15px 20px',
                            borderRadius: '8px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(10px)',
                            animation: 'slideIn 0.3s ease',
                            position: 'relative'
                        }}
                    >
                        <button
                            onClick={() => handleDismiss(notification.id)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                color: '#888',
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                        >
                            <X size={16} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginRight: '20px' }}>
                            <Icon size={20} color={color} style={{ marginTop: '2px', flexShrink: 0 }} />
                            <div>
                                <h4 style={{ margin: '0 0 5px', color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>
                                    {notification.title}
                                </h4>
                                <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                    {notification.message}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
