'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/Admin/AdminSidebar';

import { useRef } from 'react';
import { Menu } from 'lucide-react';
// ... imports

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // ... existing auth check
        if (!loading) {
            const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
            if (!user) router.replace('/');
            else if (user.email !== adminEmail) router.replace('/');
            else setIsAuthorized(true);
        }
    }, [user, loading, router]);

    if (loading || !isAuthorized) {
        return (/* ... loading state */
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#e50914' }}>
                <h2>Verifying Admin Access...</h2>
            </div>
        );
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
