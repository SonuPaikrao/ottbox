'use client';

import { useState } from 'react';
import { Bell, Send, Users, User, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function NotificationCenter() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [target, setTarget] = useState('all'); // 'all' or 'user'
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!title || !message) {
            alert('Please fill in title and message');
            return;
        }
        if (target === 'user' && !userId) {
            alert('Please enter a User ID');
            return;
        }

        console.log('🚀 Sending notification:', { title, message, type, target, userId });

        setLoading(true);
        try {
            const payload = { title, message, type, target, userId };
            console.log('📤 Request payload:', payload);

            const res = await fetch('/api/God-Mod-MH1214/notifications/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log('📥 Response status:', res.status);
            const responseData = await res.json();
            console.log('📥 Response data:', responseData);

            if (res.ok) {
                alert('✅ Notification Sent Successfully!');
                setTitle('');
                setMessage('');
                if (target === 'user') setUserId('');
            } else {
                console.error('❌ Failed to send:', responseData);
                alert(`Failed to send notification: ${responseData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('❌ Error sending notification:', error);
            alert(`Error sending notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: 'rgba(20, 20, 20, 0.7)',
            backdropFilter: 'blur(10px)',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: '30px'
        }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell size={20} color="#FFA500" /> Mass Notification System
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

                {/* Left: Input Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>Target Audience</label>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button
                                onClick={() => setTarget('all')}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #333',
                                    background: target === 'all' ? '#e50914' : 'rgba(255,255,255,0.05)',
                                    color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                <Users size={16} /> Everyone ({`Global`})
                            </button>
                            <button
                                onClick={() => setTarget('user')}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #333',
                                    background: target === 'user' ? '#e50914' : 'rgba(255,255,255,0.05)',
                                    color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                <User size={16} /> Specific User
                            </button>
                        </div>
                    </div>

                    {target === 'user' && (
                        <div>
                            <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>User ID</label>
                            <input
                                value={userId}
                                onChange={e => setUserId(e.target.value)}
                                placeholder="Enter UUID..."
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #333', color: '#fff' }}
                            />
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>Message Type</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['info', 'success', 'warning', 'error'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setType(t)}
                                    style={{
                                        padding: '6px 12px', borderRadius: '20px', border: '1px solid',
                                        borderColor: type === t ? '#fff' : 'transparent',
                                        background:
                                            t === 'info' ? '#333' :
                                                t === 'success' ? 'rgba(70, 211, 105, 0.2)' :
                                                    t === 'warning' ? 'rgba(255, 165, 0, 0.2)' : 'rgba(229, 9, 20, 0.2)',
                                        color:
                                            t === 'info' ? '#aaa' :
                                                t === 'success' ? '#46d369' :
                                                    t === 'warning' ? '#orange' : '#e50914',
                                        textTransform: 'capitalize', cursor: 'pointer', fontSize: '0.85rem'
                                    }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>Title</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. System Maintenance"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #333', color: '#fff' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>Message</label>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Type your alert message here..."
                            rows={4}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #333', color: '#fff', resize: 'none' }}
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={loading}
                        style={{
                            padding: '15px', borderRadius: '8px', background: '#e50914', color: '#fff',
                            border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            marginTop: '10px'
                        }}
                    >
                        {loading ? 'Sending...' : <><Send size={18} /> Send Notification</>}
                    </button>
                </div>

                {/* Right: Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <label style={{ display: 'block', color: '#888', fontSize: '0.9rem' }}>Live Preview</label>

                    <div style={{
                        flex: 1, background: '#000', borderRadius: '12px', border: '1px solid #333',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{
                            width: '300px', padding: '15px', borderRadius: '10px',
                            background: '#1a1a1a', borderLeft: `4px solid ${type === 'success' ? '#46d369' :
                                type === 'warning' ? '#ffa500' :
                                    type === 'error' ? '#e50914' : '#00d2d3'
                                }`,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <h4 style={{ margin: 0, color: '#fff', fontSize: '0.95rem' }}>{title || 'Notification Title'}</h4>
                                <span style={{ fontSize: '0.7rem', color: '#666' }}>now</span>
                            </div>
                            <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                {message || 'Your message will appear here exactly like this.'}
                            </p>
                        </div>

                        {/* Background Overlay Hint */}
                        <div style={{ position: 'absolute', bottom: '20px', color: '#333', fontSize: '0.8rem' }}>
                            User's Screen
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
