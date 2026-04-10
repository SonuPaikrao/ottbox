'use client';



import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, List, User, LogOut, Film } from 'lucide-react'; // Added LogOut, Film
import styles from './MobileNav.module.css';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/Shared/LoginModal';

export default function MobileNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, signOut } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const isActive = (path: string) => pathname === path;

    const handleProfileClick = () => {
        if (user) {
            setShowProfileMenu(!showProfileMenu);
        } else {
            setShowLogin(true);
        }
    };

    return (
        <>
            <nav className={styles.mobileNav}>
                <Link href="/" className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}>
                    <Home size={24} fill="currentColor" />
                </Link>

                <Link href="/search" className={`${styles.navItem} ${isActive('/search') ? styles.active : ''}`}>
                    <Search size={24} strokeWidth={2.5} />
                </Link>

                <Link href="/shorts" className={`${styles.navItem} ${isActive('/shorts') ? styles.active : ''}`}>
                    {/* Using a custom Play icon or similar for Shorts */}
                    <Film size={24} strokeWidth={2.5} />
                </Link>

                <div
                    onClick={() => {
                        if (user) {
                            router.push('/watchlist');
                        } else {
                            setShowLogin(true);
                        }
                    }}
                    className={`${styles.navItem} ${isActive('/watchlist') ? styles.active : ''}`}
                    style={{ cursor: 'pointer' }}
                >
                    <List size={24} strokeWidth={2.5} />
                </div>

                <button
                    onClick={handleProfileClick}
                    className={`${styles.navItem} ${showProfileMenu ? styles.active : ''}`}
                    style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit' }}
                >
                    <User size={24} fill="currentColor" />
                </button>
            </nav>

            {/* Mobile Profile Menu Overlay */}
            {showProfileMenu && user && (
                <div style={{
                    position: 'fixed', bottom: '80px', right: '10px', left: '10px',
                    background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px',
                    padding: '20px', zIndex: 1001, boxShadow: '0 -5px 20px rgba(0,0,0,0.5)',
                    animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E50914', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontWeight: 'bold', color: 'white', margin: 0 }}>My Account</p>
                            <p style={{ fontSize: '0.9rem', color: '#999', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Link
                            href="/watchlist"
                            onClick={() => setShowProfileMenu(false)}
                            style={{ padding: '12px', background: '#262626', borderRadius: '8px', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
                        >
                            <List size={20} />
                            My Watchlist
                        </Link>

                        <button
                            onClick={() => { signOut(); setShowProfileMenu(false); }}
                            style={{ padding: '12px', background: '#260000', border: '1px solid #4a0000', borderRadius: '8px', color: '#ff4d4d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', fontSize: '1rem' }}
                        >
                            <LogOut size={20} />
                            Sign Out
                        </button>
                    </div>

                    {/* Close Area */}
                    <div
                        onClick={() => setShowProfileMenu(false)}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: '80px', zIndex: -1 }}
                    />
                </div>
            )}

            <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

            <style jsx global>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </>
    );
}
