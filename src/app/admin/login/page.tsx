'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, Mail, Key } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Authenticate User
            const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError || !user) {
                throw new Error('Invalid credentials');
            }

            // 2. Check Authorization (God Mode Check)
            // Query public table 'admins' to see if this email is allowed
            const { data: adminRecord, error: adminError } = await supabase
                .from('admins')
                .select('email')
                .eq('email', user.email)
                .single();

            if (adminError || !adminRecord) {
                // Not an admin! Log them out immediately.
                await supabase.auth.signOut();
                throw new Error('Access Denied: You are not authorized as an Admin.');
            }

            // 3. Success -> Redirect to Dashboard
            router.push('/admin');
            router.refresh();

        } catch (err: any) {
            console.error('Login Error:', err);
            setError(err.message || 'Login failed');
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
            background: '#000',
            color: '#fff'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px',
                background: '#111',
                borderRadius: '12px',
                border: '1px solid #333',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{
                        width: '60px', height: '60px', background: '#e50914', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
                    }}>
                        <Lock size={30} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin Access</h1>
                    <p style={{ color: '#888' }}>Secure Login for God Mode</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(229, 9, 20, 0.1)', border: '1px solid #e50914',
                        color: '#ff4d4d', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '0.9rem' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#666' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '12px 12px 12px 40px',
                                    background: '#222', border: '1px solid #444', borderRadius: '6px',
                                    color: 'white', fontSize: '1rem', outline: 'none'
                                }}
                                placeholder="admin@ott.com"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '0.9rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Key size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#666' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '12px 12px 12px 40px',
                                    background: '#222', border: '1px solid #444', borderRadius: '6px',
                                    color: 'white', fontSize: '1rem', outline: 'none'
                                }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '14px',
                            background: loading ? '#666' : '#e50914',
                            color: 'white', border: 'none', borderRadius: '6px',
                            fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        {loading ? 'Authenticating...' : 'Enter God Mode'}
                    </button>
                </form>
            </div>
        </div>
    );
}
