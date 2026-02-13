'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // The AuthContext (which wraps the app) listens for auth changes.
        // But we specifically want to handle the redirect completion here.
        // Supabase client automatically parses the hash or query params.

        // We just wait a brief moment for the session to be established, then redirect home.
        // Or we can explicitly check if session exists.

        const handleAuth = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (session) {
                // Login successful
                router.replace('/');
            } else if (error) {
                // Login failed
                console.error('Auth error:', error);
                router.replace('/?error=auth_failed');
            } else {
                // No session yet, waiting for auto-detection or hash parsing...
                // Supabase's onAuthStateChange in AuthContext handles the actual state update.
                // We can just redirect to home and let AuthContext do its job.
                // But better to wait for the event.

                // If we are here, likely the hash was parsed.
                // Give it a small delay or trust Supabase has fired the event.
                setTimeout(() => {
                    router.replace('/');
                }, 1000); // Small buffer to show "Logging in..."
            }
        };

        handleAuth();
    }, [router]);

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000',
            color: '#fff'
        }}>
            <div className="loader" style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                borderTopColor: '#e50914',
                animation: 'spin 1s ease-in-out infinite',
                marginBottom: '20px'
            }}></div>
            <p>Completing secure sign-in...</p>
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
