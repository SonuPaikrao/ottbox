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
            <video
                autoPlay
                muted
                playsInline
                className={styles.video}
                onEnded={() => setAnimateOut(true)}
                ref={(el) => {
                    if (el) el.playbackRate = 1.5; // 1.5x Speed
                }}
            >
                <source src="/Animation_1.mp4" type="video/mp4" />
            </video>
        </div>
    );
}
