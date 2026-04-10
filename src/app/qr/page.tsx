'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function QRLoginContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, loading } = useAuth();

    const channelId = searchParams.get('code');
    const [status, setStatus] = useState<'idle' | 'approving' | 'approved' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!loading && !user) {
            router.push(`/?qr=${channelId}`);
        }
    }, [user, loading, channelId, router]);

    const handleApprove = async () => {
        if (!channelId) {
            setStatus('error');
            setErrorMsg('Invalid QR Code. Please scan again.');
            return;
        }

        setStatus('approving');

        try {
            const res = await fetch('/api/auth/qr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ channelId })
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus('error');
                setErrorMsg(data.error || 'Something went wrong. Try again.');
                return;
            }

            setStatus('approved');
        } catch {
            setStatus('error');
            setErrorMsg('Network error. Please try again.');
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.spinner}></div>
                    <p style={styles.subtitle}>Verifying your session...</p>
                </div>
            </div>
        );
    }

    if (!channelId) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                    <h1 style={styles.title}>Invalid QR Code</h1>
                    <p style={styles.subtitle}>Scan a valid QR code from the OTT Box login screen.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Logo */}
                <img
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/logo.svg`}
                    alt="OTT BOX"
                    width={48}
                    height={48}
                    style={{ display: 'block', margin: '0 auto 8px' }}
                />
                <p style={{ color: '#e50914', fontWeight: 800, fontSize: '18px', margin: '0 0 24px', letterSpacing: '1px' }}>OTT BOX</p>

                {status === 'idle' && (
                    <>
                        <div style={styles.iconCircle}>🖥️</div>
                        <h1 style={styles.title}>Approve Login</h1>
                        <p style={styles.subtitle}>
                            You are about to log in as<br />
                            <strong style={{ color: '#fff' }}>{user?.email}</strong><br />
                            on another device.
                        </p>
                        <button onClick={handleApprove} style={styles.approveBtn}>
                            ✅ Approve Login
                        </button>
                        <p style={styles.warning}>
                            Only tap Approve if YOU scanned this code. Do not approve if someone else is asking.
                        </p>
                    </>
                )}

                {status === 'approving' && (
                    <>
                        <div style={styles.spinner}></div>
                        <h1 style={styles.title}>Authenticating...</h1>
                        <p style={styles.subtitle}>Securely logging in the other device. Please wait.</p>
                    </>
                )}

                {status === 'approved' && (
                    <>
                        <div style={styles.iconCircle}>🎬</div>
                        <h1 style={{ ...styles.title, color: '#46d369' }}>Login Approved!</h1>
                        <p style={styles.subtitle}>
                            The other device is now logged in as <strong style={{ color: '#fff' }}>{user?.email}</strong>.<br />
                            You can close this tab.
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div style={styles.iconCircle}>❌</div>
                        <h1 style={{ ...styles.title, color: '#e50914' }}>Something went wrong</h1>
                        <p style={styles.subtitle}>{errorMsg}</p>
                        <button onClick={() => setStatus('idle')} style={{ ...styles.approveBtn, background: '#333' }}>
                            Try Again
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
    card: {
        backgroundColor: '#141414',
        borderRadius: '16px',
        padding: '40px 32px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        borderTop: '4px solid #e50914',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
    },
    iconCircle: {
        fontSize: '48px',
        marginBottom: '16px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 700,
        color: '#ffffff',
        margin: '0 0 12px',
    },
    subtitle: {
        fontSize: '15px',
        color: '#a1a1aa',
        lineHeight: 1.6,
        margin: '0 0 24px',
    },
    approveBtn: {
        display: 'block',
        width: '100%',
        padding: '16px',
        backgroundColor: '#e50914',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 700,
        cursor: 'pointer',
        marginBottom: '16px',
        boxShadow: '0 4px 20px rgba(229,9,20,0.4)',
    },
    warning: {
        fontSize: '12px',
        color: '#52525b',
        lineHeight: 1.5,
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '3px solid #333',
        borderTop: '3px solid #e50914',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px',
    },
};

export default function QRLoginPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#fff' }}>Loading...</div>
            </div>
        }>
            <QRLoginContent />
        </Suspense>
    );
}
