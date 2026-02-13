'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchMovieVideos } from '@/lib/api';
import { Play, Pause, Loader2 } from 'lucide-react';

interface SyncPlayerProps {
    movieId: number;
    roomId: string;
}

export default function SyncPlayer({ movieId, roomId }: SyncPlayerProps) {
    const [videoKey, setVideoKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const playerRef = useRef<any>(null);
    const [isPlaying, setIsPlaying] = useState(false); // Local state to track
    const isRemoteUpdate = useRef(false); // Flag to prevent echo loops

    // 1. Fetch Video Key
    useEffect(() => {
        const loadVideo = async () => {
            try {
                const key = await fetchMovieVideos(movieId);
                setVideoKey(key);
            } catch (err) {
                console.error('Failed to load video', err);
            } finally {
                setLoading(false);
            }
        };
        loadVideo();
    }, [movieId]);

    // 2. Initialize YouTube Player
    // We need to load the IFrame API if not already present, or rely on a wrapper.
    // Using raw iframe is hard to control sync. We strictly need the JS API (YT.Player).
    // For simplicity and robustness given previous "iframe" usage, let's inject script.

    useEffect(() => {
        if (!videoKey) return;

        // Load YT Script
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        // Init Player Callback
        window.onYouTubeIframeAPIReady = () => {
            initializePlayer();
        };

        // If API already ready
        if (window.YT && window.YT.Player) {
            initializePlayer();
        }

        function initializePlayer() {
            // Destroy existing if any
            if (playerRef.current) {
                // playerRef.current.destroy(); // Optional, but risky with React strict mode re-mounts
            }

            playerRef.current = new window.YT.Player(`youtube-player-${roomId}`, {
                videoId: videoKey,
                playerVars: {
                    autoplay: 0, // Don't auto-play, let user click start
                    controls: 1, // Show controls so they can seek
                    modestbranding: 1,
                    rel: 0,
                },
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        return () => {
            // Cleanup?
        };
    }, [videoKey, roomId]);

    // 3. Supabase Sync Logic
    useEffect(() => {
        const channel = supabase.channel(`room:${roomId}`);

        channel
            .on('broadcast', { event: 'PLAY' }, ({ payload }) => {
                if (!playerRef.current?.playVideo) return;
                console.log('Received PLAY', payload);
                isRemoteUpdate.current = true;
                // Seek if drift is large (> 2s)? For now just play.
                // Better: Sync Time too.
                if (Math.abs(playerRef.current.getCurrentTime() - payload.timestamp) > 2) {
                    playerRef.current.seekTo(payload.timestamp, true);
                }
                playerRef.current.playVideo();
                setIsPlaying(true);
                setTimeout(() => { isRemoteUpdate.current = false; }, 500);
            })
            .on('broadcast', { event: 'PAUSE' }, ({ payload }) => {
                if (!playerRef.current?.pauseVideo) return;
                console.log('Received PAUSE', payload);
                isRemoteUpdate.current = true;
                playerRef.current.pauseVideo();
                if (Math.abs(playerRef.current.getCurrentTime() - payload.timestamp) > 2) {
                    playerRef.current.seekTo(payload.timestamp, true);
                }
                setIsPlaying(false);
                setTimeout(() => { isRemoteUpdate.current = false; }, 500);
            })
            // We can also listen for seek, but Youtube 'onStateChange' handles seek buffering usually.
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId]);


    // 4. Handle Local Events -> Broadcast
    const onPlayerStateChange = (event: any) => {
        // Event Codes: 1 = Playing, 2 = Paused, 3 = Buffering
        if (isRemoteUpdate.current) return; // Ignore if triggered by remote

        const currentTime = event.target.getCurrentTime();

        if (event.data === window.YT.PlayerState.PLAYING) {
            console.log('Broadcasting PLAY');
            supabase.channel(`room:${roomId}`).send({
                type: 'broadcast',
                event: 'PLAY',
                payload: { timestamp: currentTime }
            });
            setIsPlaying(true);
        } else if (event.data === window.YT.PlayerState.PAUSED) {
            console.log('Broadcasting PAUSE');
            supabase.channel(`room:${roomId}`).send({
                type: 'broadcast',
                event: 'PAUSE',
                payload: { timestamp: currentTime }
            });
            setIsPlaying(false);
        }
    };

    if (loading) return <div className="aspect-video bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;
    if (!videoKey) return <div className="aspect-video bg-gray-900 flex items-center justify-center text-white">Video not found</div>;

    return (
        <div className="w-full h-full bg-black relative">
            {/* Use a wrapper ID for the iframe replacement */}
            <div id={`youtube-player-${roomId}`} className="w-full h-full" />
        </div>
    );
}

// Global typing for YT API
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}
