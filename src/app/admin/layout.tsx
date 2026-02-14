'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import AdminSidebar from '@/components/Admin/AdminSidebar';

import { useRef } from 'react';
import { Menu } from 'lucide-react';
// ... imports

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const pathname = usePathname();

    useEffect(() => {
        const checkAdmin = async () => {
            if (loading) return;

            // Allow access to login page without check
            if (pathname === '/admin/login') {
                setIsAuthorized(true);
                return;
            }

            if (!user) {
                router.replace('/admin/login');
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
                router.replace('/admin/login');
            } else {
                setIsAuthorized(true);
            }
        };

        checkAdmin();
    }, [user, loading, router, pathname]);

    if (loading || !isAuthorized) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#e50914' }}>
                <h2>Verifying Admin Access...</h2>
            </div>
        );
    }

    // Special Layout for Login Page (No Sidebar, Full Screen)
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#000', color: '#fff' }}>
            {/* Mobile Header */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, height: '60px',
                background: '#0a0a0a', borderBottom: '1px solid #222', zIndex: 50,
                display: 'none', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between'
            }} className="admin-mobile-header">
                <span style={{ color: '#e50914', fontSize: '1.2rem', fontWeight: 800 }}>OTT ADMIN</span>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'white' }}>
                    <Menu />
                </button>
            </div>

            {/* Sidebar Wrapper for Mobile */}
            <div className={`admin-sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
                <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
                    className="d-lg-none"
                />
            )}

            <main className="admin-content">
                {children}
            </main>

            <style jsx global>{`
                .admin-mobile-header { display: none; }
                .admin-sidebar-wrapper { position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; transition: transform 0.3s ease; }
                .admin-content { flex: 1; margin-left: 250px; padding: 40px; width: 100%; }
                
                @media (max-width: 768px) {
                    .admin-mobile-header { display: flex; }
                    .admin-sidebar-wrapper { transform: translateX(-100%); width: 250px; }
                    .admin-sidebar-wrapper.open { transform: translateX(0); }
                    .admin-content { margin-left: 0; padding: 20px; padding-top: 80px; }
                }
            `}</style>
        </div>
    );
}
