'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchMovieVideos } from '@/lib/api'; // Fallback to TMDB Trailer
import { Loader2, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface CinemaPlayerProps {
    movieId?: string;
    customVideoUrl?: string; // For MP4 support
    partyId: string;
    isHost?: boolean; // In V2, maybe only host controls? For now, open.
}

export default function CinemaPlayer({ movieId, customVideoUrl, partyId }: CinemaPlayerProps) {
    // State
    const [videoSrc, setVideoSrc] = useState<string | null>(customVideoUrl || null);
    const [playerType, setPlayerType] = useState<'youtube' | 'html5'>('youtube');
    const [isPlaying, setIsPlaying] = useState(false);
    const [muted, setMuted] = useState(true);
    const [loading, setLoading] = useState(true);

    // Refs
    const playerRef = useRef<any>(null); // YT Player or HTML5 Video Element
    const isRemoteUpdate = useRef(false); // Anti-echo flag
    const videoContainerRef = useRef<HTMLDivElement>(null);

    // 1. Determine Source
    useEffect(() => {
        if (customVideoUrl) {
            setVideoSrc(customVideoUrl);
            setPlayerType('html5');
            setLoading(false);
        } else if (movieId) {
            fetchMovieVideos(parseInt(movieId)).then(key => {
                if (key) {
                    setVideoSrc(key); // YouTube Key
                    setPlayerType('youtube');
                }
                setLoading(false);
            });
        }
    }, [movieId, customVideoUrl]);

    // 2. Initialize Players
    useEffect(() => {
        if (!videoSrc || playerType !== 'youtube') return;

        // Load YT API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = () => initializeYT();
        if (window.YT && window.YT.Player) initializeYT();

        function initializeYT() {
            playerRef.current = new window.YT.Player(`cinema-player-${partyId}`, {
                videoId: videoSrc,
                playerVars: {
                    autoplay: 1,
                    controls: 0, // Custom controls for cinematic feel? Or standard? Let's use 0 and build overlay or 1 for simplicity. 
                    // User asked for "Cinematic", usually means custom UI, but YT API allows basic controls.
                    // Let's use standard controls for stability, but we can overlay a "Blocker" to force sync?
                    // No, let's keep controls enabled so they can seek.
                    controls: 1, 
                    modestbranding: 1,
                    rel: 0,
                    mute: 1 // Auto-mute to allow autoplay
                },
                events: {
                    'onStateChange': onYTStateChange
                }
            });
        }
    }, [videoSrc, playerType, partyId]);

    // 3. Supabase Sync
    useEffect(() => {
        const channel = supabase.channel(`party:${partyId}`);

        channel
            .on('broadcast', { event: 'SYNC' }, ({ payload }) => {
                // payload: { type: 'PLAY' | 'PAUSE' | 'SEEK', time: number }
                console.log('Received SYNC:', payload);
                isRemoteUpdate.current = true;

                if (playerType === 'youtube' && playerRef.current?.playVideo) {
                    if (Math.abs(playerRef.current.getCurrentTime() - payload.time) > 2) {
                        playerRef.current.seekTo(payload.time, true);
                    }
                    if (payload.type === 'PLAY') {
                        playerRef.current.playVideo();
                        setIsPlaying(true);
                    } else {
                        playerRef.current.pauseVideo();
                        setIsPlaying(false);
                    }
                } 
                else if (playerType === 'html5' && playerRef.current) {
                    const video = playerRef.current as HTMLVideoElement;
                    if (Math.abs(video.currentTime - payload.time) > 2) {
                        video.currentTime = payload.time;
                    }
                    if (payload.type === 'PLAY') {
                        video.play();
                        setIsPlaying(true);
                    } else {
                        video.pause();
                        setIsPlaying(false);
                    }
                }

                setTimeout(() => { isRemoteUpdate.current = false; }, 500);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [partyId, playerType]);

    // 4. Emitters
    const broadcast = (type: 'PLAY' | 'PAUSE', time: number) => {
        if (isRemoteUpdate.current) return;
        supabase.channel(`party:${partyId}`).send({
            type: 'broadcast',
            event: 'SYNC',
            payload: { type, time }
        });
    };

    const onYTStateChange = (e: any) => {
        if (isRemoteUpdate.current) return;
        const time = e.target.getCurrentTime();
        if (e.data === 1) { // Playing
            broadcast('PLAY', time);
            setIsPlaying(true);
        } else if (e.data === 2) { // Paused
            broadcast('PAUSE', time);
            setIsPlaying(false);
        }
    };

    const onHTML5Play = () => {
        if (isRemoteUpdate.current) return;
        broadcast('PLAY', (playerRef.current as HTMLVideoElement).currentTime);
        setIsPlaying(true);
    };

    const onHTML5Pause = () => {
        if (isRemoteUpdate.current) return;
        broadcast('PAUSE', (playerRef.current as HTMLVideoElement).currentTime);
        setIsPlaying(false);
    };


    if (loading) return <div className="w-full h-full flex items-center justify-center text-white"><Loader2 className="animate-spin w-10 h-10 text-red-600" /></div>;

    return (
        <div ref={videoContainerRef} className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden group">
            
            {playerType === 'youtube' ? (
                <div id={`cinema-player-${partyId}`} className="w-full h-full pointer-events-auto" />
            ) : (
                <video
                    ref={playerRef}
                    src={videoSrc || ''}
                    className="w-full h-full object-contain"
                    controls
                    onPlay={onHTML5Play}
                    onPause={onHTML5Pause}
                />
            )}

            {/* Cinematic Overlay (Hidden when playing, triggers on hover) */}
       
        </div>
    );
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
