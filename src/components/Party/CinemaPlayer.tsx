'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchMovieVideos } from '@/lib/api';
import { Loader2, AlertCircle } from 'lucide-react';

interface CinemaPlayerProps {
    movieId: string;
    partyId: string;
    isHost: boolean; // Future: Enforce control
}

export default function CinemaPlayer({ movieId, partyId, isHost }: CinemaPlayerProps) {
    const [videoKey, setVideoKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Refs for player and strict loop prevention
    const playerRef = useRef<any>(null);
    const isRemoteUpdate = useRef(false);
    const channelRef = useRef<any>(null);

    // 1. Fetch Video Key (Robust)
    useEffect(() => {
        let mounted = true;
        const loadVideo = async () => {
            try {
                // If ID is numeric, assume TMDB ID. If URL, handle differently (not implemented yet for URL)
                if (!isNaN(Number(movieId))) {
                    const key = await fetchMovieVideos(Number(movieId));
                    if (mounted) {
                        if (key) setVideoKey(key);
                        else setError('No trailer found for this title.');
                    }
                } else {
                    // Custom URL logic could go here
                    setError('Invalid Video Source ID');
                }
            } catch (err) {
                if (mounted) setError('Failed to load video source.');
                console.error(err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        loadVideo();
        return () => { mounted = false; };
    }, [movieId]);

    // 2. Init Channel & Sync Logic
    useEffect(() => {
        const channel = supabase.channel(`party:${partyId}`);
        channelRef.current = channel;

        channel
            .on('broadcast', { event: 'PLAY' }, ({ payload }) => {
                if (!playerRef.current?.playVideo) return;

                // Echo Cancellation
                if (Math.abs(playerRef.current.getCurrentTime() - payload.timestamp) < 0.5 && playerRef.current.getPlayerState() === 1) {
                    return; // Already playing at same time
                }

                console.log('SYNC: Received PLAY', payload);
                isRemoteUpdate.current = true;

                // Sync drift
                if (Math.abs(playerRef.current.getCurrentTime() - payload.timestamp) > 1.0) {
                    playerRef.current.seekTo(payload.timestamp, true);
                }
                playerRef.current.playVideo();

                // Release lock after short delay
                setTimeout(() => { isRemoteUpdate.current = false; }, 800);
            })
            .on('broadcast', { event: 'PAUSE' }, ({ payload }) => {
                if (!playerRef.current?.pauseVideo) return;

                if (playerRef.current.getPlayerState() === 2) return; // Already paused

                console.log('SYNC: Received PAUSE', payload);
                isRemoteUpdate.current = true;
                playerRef.current.pauseVideo();
                if (Math.abs(playerRef.current.getCurrentTime() - payload.timestamp) > 1.0) {
                    playerRef.current.seekTo(payload.timestamp, true);
                }
                setTimeout(() => { isRemoteUpdate.current = false; }, 800);
            })
            .on('broadcast', { event: 'SEEK' }, ({ payload }) => {
                if (!playerRef.current?.seekTo) return;
                console.log('SYNC: Received SEEK', payload);
                isRemoteUpdate.current = true;
                playerRef.current.seekTo(payload.timestamp, true);
                setTimeout(() => { isRemoteUpdate.current = false; }, 800);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [partyId]);

    // 3. Init YouTube Player
    useEffect(() => {
        if (!videoKey) return;

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = initializePlayer;
        if (window.YT && window.YT.Player) initializePlayer();

        function initializePlayer() {
            // Prevent duplicate inits
            if (playerRef.current) return;

            playerRef.current = new window.YT.Player(`cinema-player-${partyId}`, {
                videoId: videoKey,
                height: '100%',
                width: '100%',
                playerVars: {
                    autoplay: 0,
                    controls: 1, // Keep controls for now, allow anyone to control
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3,
                    fs: 0, // Disable Fullscreen button (we are already full viewport)
                },
                events: {
                    'onStateChange': handleLocalStateChange,
                    'onReady': () => { console.log('Player Ready'); }
                }
            });
        }
    }, [videoKey, partyId]);

    // 4. Local Event Broadcaster
    const handleLocalStateChange = (event: any) => {
        if (isRemoteUpdate.current) return; // IGNORE if logic initiated by remote signal

        const currentTime = event.target.getCurrentTime();
        const state = event.data;

        // PLAYING
        if (state === window.YT.PlayerState.PLAYING) {
            broadcast('PLAY', { timestamp: currentTime });
        }
        // PAUSED
        else if (state === window.YT.PlayerState.PAUSED) {
            broadcast('PAUSE', { timestamp: currentTime });
        }
        // BUFFERING (Often happens during seek)
        else if (state === window.YT.PlayerState.BUFFERING) {
            // Optional: Broadcast buffering state?
        }
    };

    const broadcast = (event: string, payload: any) => {
        // Debounce?
        if (channelRef.current) {
            console.log(`BROADCAST: ${event}`, payload);
            channelRef.current.send({
                type: 'broadcast',
                event: event,
                payload: payload
            });
        }
    };


    if (loading) return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black text-zinc-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="tracking-widest text-xs uppercase">Loading Theater...</p>
        </div>
    );

    if (error) return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black text-red-500">
            <AlertCircle size={40} className="mb-4" />
            <p className="tracking-widest text-xs uppercase">{error}</p>
        </div>
    );

    return (
        <div className="w-full h-full bg-black relative shadow-2xl overflow-hidden rounded-r-2xl border-r border-white/5">
            <div id={`cinema-player-${partyId}`} className="w-full h-full pointer-events-auto" />
            {/* Gradient Overlay for Cinematic Feel (Top/Bottom) */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
        </div>
    );
}
