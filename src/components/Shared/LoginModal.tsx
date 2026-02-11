'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Mail } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const [loading, setLoading] = useState(false);

    // 'signin' or 'signup'
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError(null);
            await signInWithGoogle();
        } catch (error: any) {
            setError(error.message || 'Google login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'signin') {
                const { error } = await signInWithEmail(email, password);
                if (error) throw error;
                onClose(); // Success
            } else {
                const { error } = await signUpWithEmail(email, password);
                if (error) throw error;
                setMessage('Check your email to confirm account!');
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: '#141414', border: '1px solid #333',
                borderRadius: '12px', padding: '40px', width: '90%', maxWidth: '400px',
                position: 'relative', textAlign: 'center'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '15px', right: '15px',
                    background: 'none', border: 'none', color: '#888', cursor: 'pointer'
                }}>
                    <X size={24} />
                </button>

                <h2 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: 700 }}>
                    {mode === 'signin' ? 'Welcome Back' : 'Join OTT Box'}
                </h2>

                {/* Main Action: Google */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    style={{
                        width: '100%', padding: '12px', borderRadius: '4px',
                        background: 'white', color: 'black', border: 'none',
                        fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        marginBottom: '20px', opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Processing...' : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26c.01-.19.01-.39.01-.58z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
                        </>
                    )}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#666' }}>
                    <div style={{ flex: 1, height: '1px', background: '#333' }}></div>
                    OR
                    <div style={{ flex: 1, height: '1px', background: '#333' }}></div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {error && <p style={{ color: '#e50914', fontSize: '0.9rem', margin: 0 }}>{error}</p>}
                    {message && <p style={{ color: '#46d369', fontSize: '0.9rem', margin: 0 }}>{message}</p>}

                    <input
                        type="email"
                        placeholder="Email Address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: '12px', background: '#333', border: 'none', borderRadius: '4px', color: 'white' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '12px', background: '#333', border: 'none', borderRadius: '4px', color: 'white' }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '12px', background: '#e50914', color: 'white', border: 'none',
                            borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <p style={{ marginTop: '20px', color: '#999', fontSize: '0.9rem' }}>
                    {mode === 'signin' ? 'New to OTT Box?' : 'Already have an account?'}
                    <span
                        onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setMessage(null); }}
                        style={{ color: 'white', marginLeft: '5px', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {mode === 'signin' ? 'Sign up now.' : 'Sign in.'}
                    </span>
                </p>
            </div>
        </div>
    );
}
