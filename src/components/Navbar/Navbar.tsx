'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import SmartSearch from '@/components/Shared/SmartSearch';
import styles from './Navbar.module.css';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/Shared/LoginModal';
import BackButton from '@/components/Shared/BackButton';

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const isHomePage = pathname === '/';

    // Dynamic Navbar Background & Hide/Show Logic with Throttle
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;

                    // Show background if scrolled slightly
                    setIsScrolled(currentScrollY > 20);

                    // Smart Hide/Show Logic
                    if (currentScrollY > lastScrollY && currentScrollY > 100) {
                        // Scrolling DOWN -> Hide
                        setIsVisible(false);
                    } else {
                        // Scrolling UP -> Show
                        setIsVisible(true);
                    }

                    setLastScrollY(currentScrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className={`
            ${styles.navbar} 
            ${isScrolled ? styles.scrolled : ''} 
            ${!isVisible ? styles.hidden : ''}
        `}>
            <div className={`container ${styles.navContainer}`}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <BackButton />
                    <Link href="/" className={`${styles.logo} ${!isHomePage ? styles.hideOnMobile : ''}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#e50914"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-popcorn"
                        >
                            <path d="M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4" />
                            <path d="M10 22 9 8" />
                            <path d="m14 22 1-14" />
                            <path d="M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z" />
                        </svg>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className={styles.desktopNav}>
                    {/* Links removed as per user request to centralize navigation on Home */}
                    <Link href="/shorts" style={{ color: '#ccc', fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Shorts
                    </Link>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <div className={styles.desktopSearch}>
                        <SmartSearch />
                    </div>

                    {/* Auth Button (Desktop & Mobile) */}
                    <div className={styles.authWrapper}>
                        {loading ? (
                            // Loading Skeleton
                            <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#333' }} />
                        ) : user ? (
                            <div style={{ position: 'relative' }}>
                                <div
                                    className={styles.userProfile}
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#E50914', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {user.email?.[0].toUpperCase()}
                                    </div>
                                </div>

                                {/* Dropdown Menu */}
                                {showProfileMenu && (
                                    <div style={{
                                        position: 'absolute', top: '40px', right: 0,
                                        background: '#141414', border: '1px solid #333',
                                        borderRadius: '4px', padding: '10px', minWidth: '150px',
                                        display: 'flex', flexDirection: 'column', gap: '5px'
                                    }}>
                                        <div style={{ padding: '5px 10px', fontSize: '0.8rem', color: '#999', borderBottom: '1px solid #333', marginBottom: '5px' }}>
                                            {user.email}
                                        </div>
                                        <Link href="/watchlist" style={{ padding: '8px 10px', color: 'white', textDecoration: 'none', fontSize: '0.9rem', borderRadius: '4px', transition: 'background 0.2s' }} className="hover:bg-zinc-800">
                                            My Watchlist
                                        </Link>
                                        <button
                                            onClick={() => { signOut(); setShowProfileMenu(false); }}
                                            style={{ padding: '8px 10px', color: '#ff4d4d', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', borderRadius: '4px' }}
                                            className="hover:bg-zinc-800"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button onClick={() => setShowLogin(true)} className="btn btn-primary" style={{ padding: '6px 15px', fontSize: '0.9rem' }}>
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
        </nav>
    );
}
