'use client';

import './admin.css';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import PremiumSidebar from '@/components/Admin/Sidebar/PremiumSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const supabase = getSupabaseBrowserClient();
    const pathname = usePathname();

    useEffect(() => {
        const checkAdmin = async () => {
            if (loading) return;

            // Allow access to login page without check
            if (pathname === '/God-Mod-MH1214/login') {
                setIsAuthorized(true);
                return;
            }

            if (!user) {
                router.replace('/God-Mod-MH1214/login');
                return;
            }

            // Verify against 'admins' table
            const { data, error } = await supabase
                .from('admins')
                .select('email')
                .eq('email', user.email)
                .single();

            if (error || !data) {
                console.error('Admin Check Failed:', error);
                router.replace('/God-Mod-MH1214/login');
            } else {
                setIsAuthorized(true);
            }
        };

        checkAdmin();
    }, [user, loading, router, pathname]);

    // Loading state
    if (loading || (!isAuthorized && pathname !== '/God-Mod-MH1214/login')) {
        return (
            <div className="admin-layout" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid rgba(229, 9, 20, 0.3)',
                        borderTop: '3px solid #e50914',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }} />
                    <h2 style={{ color: '#e50914', fontSize: '1.2rem' }}>Verifying Admin Access...</h2>
                </div>
                <style jsx>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Login page - no sidebar
    if (pathname === '/God-Mod-MH1214/login') {
        return <>{children}</>;
    }

    // Main admin layout with sidebar
    return (
        <div className="admin-layout">
            <PremiumSidebar />
            <main className="admin-main">
                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
