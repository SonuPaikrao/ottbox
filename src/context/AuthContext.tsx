'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, pass: string) => Promise<any>;
    signUpWithEmail: (email: string, pass: string) => Promise<any>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signInWithGoogle: async () => { },
    signInWithEmail: async () => null,
    signUpWithEmail: async () => null,
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            // Trigger Welcome Email / Password Generation for Google Users
            if (_event === 'SIGNED_IN' && session?.user?.app_metadata?.provider === 'google') {
                try {
                    await fetch('/api/auth/welcome', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: session.user.id,
                            email: session.user.email,
                            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                            // No manualPassword -> triggers generation logic in API
                        }),
                    });
                } catch (err) {
                    console.error('Failed to trigger welcome email:', err);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    const signInWithEmail = async (email: string, pass: string) => {
        return await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });
    };

    const signUpWithEmail = async (email: string, pass: string) => {
        return await supabase.auth.signUp({
            email,
            password: pass,
        });
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
