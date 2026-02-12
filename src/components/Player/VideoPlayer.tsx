'use client';

import { useEffect, useRef } from 'react';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
    tmdbId: string;
    type: 'movie' | 'tv';
    season?: number;
    episode?: number;
    color?: string;
    autoPlay?: boolean;
}

export default function VideoPlayer({
    tmdbId,
    type,
    season = 1,
    episode = 1,
    color = 'e50914',
    autoPlay = true,
}: VideoPlayerProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Security check: ensure message is from vidking if possible, but they don't specify origin restrictions in docs provided.
            // The user provided script example just listens to "message".

            try {
                if (typeof event.data === 'string') {
                    // Some messages might be strings
                    // console.log("Player Message:", event.data);
                } else {
                    // JSON objects
                    // console.log("Player Event:", event.data);
                    // Verify if it's a player event
                    if (event.data && event.data.type === 'PLAYER_EVENT') {
                        const { event: playerEvent, progress, duration, currentTime } = event.data.data;

                        if (playerEvent === 'timeupdate') {
                            // Save progress to local storage
                            const progressKey = `watch-progress-${type}-${tmdbId}-${type === 'tv' ? `${season}-${episode}` : ''}`;
                            localStorage.setItem(progressKey, JSON.stringify({
                                currentTime,
                                duration,
                                progress,
                                timestamp: Date.now()
                            }));
                        }
                    }
                }
            } catch (e) {
                // Ignore parse errors from other sources
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [tmdbId, type, season, episode]);

    let src = '';
    if (type === 'movie') {
        src = `https://vidsrc.xyz/embed/movie/${tmdbId}`;
    } else {
        src = `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`;
    }

    return (
        <div className={styles.playerContainer}>
            <iframe
                ref={iframeRef}
                src={src}
                className={styles.iframe}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
            />
        </div>
    );
}
