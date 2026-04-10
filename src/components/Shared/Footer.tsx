'use client';

import Link from 'next/link';
import { Github, Twitter, Instagram, Heart, Coffee } from 'lucide-react';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const pathname = usePathname();
    const isWatchPage = pathname.startsWith('/watch/');
    const isShortsPage = pathname === '/shorts';

    // Don't render footer on watch or shorts pages
    if (isWatchPage || isShortsPage) return null;

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                {/* Top Section */}
                <div className={styles.grid}>
                    {/* Brand Column */}
                    <div className={styles.brandCol}>
                        <Link href="/" className={styles.logo}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
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
                            <span className={styles.brandName}>OTT BOX</span>
                        </Link>
                        <p className={styles.description}>
                            Stream unlimited movies and TV shows in high quality.
                            No subscription, just pure entertainment.
                            Designed for the best viewing experience.
                        </p>
                    </div>

                    {/* Browse Column */}
                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Browse</h4>
                        <ul className={styles.navLinks}>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/trending">Trending</Link></li>
                            <li><Link href="/movies">Movies</Link></li>
                            <li><Link href="/series">TV Shows</Link></li>
                        </ul>
                    </div>

                    {/* Account Column */}
                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Account</h4>
                        <ul className={styles.navLinks}>
                            <li><Link href="/watchlist">My Watchlist</Link></li>
                            <li><Link href="/search">Search</Link></li>
                            {/*  <li><Link href="/profile">Profile</Link></li> */}
                        </ul>
                    </div>

                    {/* Connect Column */}
                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Connect</h4>
                        <div className={styles.socials}>
                            <a href="https://github.com/SonuPaikrao" target="_blank" rel="noreferrer" aria-label="Github">
                                <Github size={20} />
                            </a>
                            <a href="#" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                        </div>
                        <p className={styles.creatorTag}>
                            Created by <span className={styles.highlight}>Sonu Rao</span>
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className={styles.divider} />

                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>
                        &copy; {currentYear} OTT Box. All rights reserved.
                    </p>
                    <div className={styles.bottomLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                    <p className={styles.madeWith}>
                        Made with <Heart size={14} fill="#e50914" stroke="none" style={{ margin: '0 4px' }} /> & <Coffee size={14} style={{ margin: '0 4px' }} /> by Sonu Rao
                    </p>
                </div>
            </div>
        </footer>
    );
}
