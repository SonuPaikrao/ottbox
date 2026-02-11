'use client';

import { useState } from 'react';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
    tmdbId: string;
    type?: 'movie' | 'tv';
    season?: number;
    episode?: number;
}

export default function VideoPlayer({ tmdbId, type = 'movie', season = 1, episode = 1 }: VideoPlayerProps) {
    // Default to Server 1 (VidSrc.to - most reliable)
    const [server, setServer] = useState(1);

    const getUrl = () => {
        switch (server) {
            case 1:
                // VidSrc.to (Most reliable, confirmed working)
                return type === 'tv'
                    ? `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`
                    : `https://vidsrc.to/embed/movie/${tmdbId}`;

            case 2:
                // Embed.su (Alternative - testing)
                return type === 'tv'
                    ? `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`
                    : `https://embed.su/embed/movie/${tmdbId}`;

            case 3:
                // AutoEmbed (New option - testing)
                return type === 'tv'
                    ? `https://watch.autoembed.cc/embed/tv/${tmdbId}/${season}/${episode}`
                    : `https://watch.autoembed.cc/embed/movie/${tmdbId}`;

            case 4:
                // VidSrc.cc (Alternative VidSrc domain)
                return type === 'tv'
                    ? `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`
                    : `https://vidsrc.cc/v2/embed/movie/${tmdbId}`;

            default:
                return '';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.playerWrapper}>
                <iframe
                    src={getUrl()}
                    allowFullScreen
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    className={styles.iframe}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    title="Video Player"
                    referrerPolicy="origin"
                ></iframe>
            </div>

            <div className={styles.controls}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span className={styles.serverLabel}>Server:</span>

                    <button
                        className={`${styles.serverBtn} ${server === 1 ? styles.active : ''}`}
                        onClick={() => setServer(1)}
                        title="Most reliable"
                    >
                        Server 1
                    </button>

                    <button
                        className={`${styles.serverBtn} ${server === 2 ? styles.active : ''}`}
                        onClick={() => setServer(2)}
                        title="Alternative"
                    >
                        Server 2
                    </button>

                    <button
                        className={`${styles.serverBtn} ${server === 3 ? styles.active : ''}`}
                        onClick={() => setServer(3)}
                        title="New option"
                    >
                        Server 3
                    </button>

                    <button
                        className={`${styles.serverBtn} ${server === 4 ? styles.active : ''}`}
                        onClick={() => setServer(4)}
                        title="VidSrc alternative"
                    >
                        Server 4
                    </button>
                </div>
            </div>

            <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
                Try different servers for best experience. All servers may show ads.
            </p>
        </div>
    );
}
