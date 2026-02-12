'use client';

import { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';

export default function SplashScreen() {
    const [show, setShow] = useState(true);
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        // Prevent scrolling while splash is visible
        document.body.style.overflow = 'hidden';

        const timer = setTimeout(() => {
            setAnimateOut(true);
            setTimeout(() => {
                setShow(false);
                document.body.style.overflow = 'auto';
            }, 500); // 500ms fade out duration
        }, 2500); // Show splash for 2.5 seconds

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!show) return null;

    return (
        <div className={`${styles.container} ${animateOut ? styles.fadeOut : ''}`}>
            <div className={styles.logoWrapper}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="120"
                    height="120"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#e50914"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.logo}
                >
                    <path d="M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4" />
                    <path d="M10 22 9 8" />
                    <path d="m14 22 1-14" />
                    <path d="M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z" />
                </svg>
                <h1 className={styles.brandName}>OTT BOX</h1>
            </div>
        </div>
    );
}
