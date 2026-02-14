'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/Admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

            if (!user) {
                // Not logged in -> Redirect to Home
                router.replace('/');
            } else if (user.email !== adminEmail) {
                // Logged in but NOT Admin -> Redirect to Home
                console.warn('Unauthorized Access Attempt:', user.email);
                router.replace('/');
            } else {
                // Authorized
                setIsAuthorized(true);
            }
        }
    }, [user, loading, router]);

    if (loading || !isAuthorized) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000',
                color: '#e50914'
            }}>
                <h2>Verifying Admin Access...</h2>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#000', color: '#fff' }}>
            <AdminSidebar />
            <main style={{ flex: 1, marginLeft: '250px', padding: '40px' }}>
                {children}
            </main>
        </div>
    );
}
