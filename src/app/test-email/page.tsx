
'use client';

import { useState } from 'react';

export default function TestEmailPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/test-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage('✅ Email Sent! Check your inbox.');
            } else {
                setMessage(`❌ Failed: ${JSON.stringify(data.error)}`);
            }
        } catch (err) {
            setMessage('❌ Error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            color: 'white',
            fontFamily: 'sans-serif'
        }}>
            <div style={{
                padding: '40px',
                backgroundColor: '#141414',
                border: '1px solid #333',
                borderRadius: '12px',
                textAlign: 'center',
                maxWidth: '400px',
                width: '100%'
            }}>
                <h1 style={{ color: '#e50914', marginBottom: '20px' }}>Test Email Template</h1>

                <div style={{ background: '#331111', border: '1px solid #662222', borderRadius: '8px', padding: '15px', marginBottom: '25px', textAlign: 'left' }}>
                    <p style={{ color: '#ff4d4d', fontWeight: 'bold', margin: '0 0 10px 0', fontSize: '0.9rem' }}>⚠️ Resend Test Mode Restriction</p>
                    <p style={{ color: '#ccc', fontSize: '0.85rem', margin: 0, lineHeight: '1.4' }}>
                        You are currently in <strong>Test Mode</strong>. You can ONLY send emails to your verified account email:
                        <br />
                        <code style={{ background: '#000', padding: '2px 6px', borderRadius: '4px', color: '#fff', marginTop: '5px', display: 'inline-block' }}>sirelliotalderson@gmail.com</code>
                    </p>
                    <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '10px' }}>
                        To send to other emails, you must verify your domain on Resend.
                    </p>
                </div>

                <p style={{ color: '#888', marginBottom: '30px' }}>
                    Enter an email address to receive the new "Professional" Welcome Email.
                </p>

                <form onSubmit={handleSend}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #333',
                            backgroundColor: '#222',
                            color: 'white',
                            marginBottom: '20px',
                            fontSize: '16px'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#e50914',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Sending...' : 'Send Test Email'}
                    </button>
                </form>

                {message && (
                    <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
