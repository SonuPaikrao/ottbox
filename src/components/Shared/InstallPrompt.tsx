'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import styles from './InstallPrompt.module.css';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check for iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);

        // Check if already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

        if (isStandalone) {
            return; // Already installed
        }

        // Listen for install prompt
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // For iOS, show prompts if not standalone (optional logic can be added here)
        // For now, only Android/Desktop Chrome triggers beforeinstallprompt

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    if (!showPrompt && !isIOS) return null;

    // Optional: Special iOS Instructions could go here
    if (isIOS && !showPrompt) return null; // Hide for now on iOS unless we built specific UI

    return (
        <div className={styles.installBanner}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <img src="/icons/icon-192x192.png" alt="App Icon" className={styles.appIcon} />
                </div>
                <div className={styles.text}>
                    <p className={styles.title}>Install OTT Box</p>
                    <p className={styles.subtitle}>Add to home screen for the best experience</p>
                </div>
            </div>
            <div className={styles.actions}>
                <button onClick={() => setShowPrompt(false)} className={styles.closeBtn}>
                    <X size={20} />
                </button>
                <button onClick={handleInstallClick} className={styles.installBtn}>
                    Install
                </button>
            </div>
        </div>
    );
}
