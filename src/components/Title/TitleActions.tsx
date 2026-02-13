'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Play, Film, X } from 'lucide-react';
import WatchlistButton from '@/components/Shared/WatchlistButton';
import { Movie, fetchMovieVideos } from '@/lib/api';
import styles from './TitleActions.module.css';

interface TitleActionsProps {
    movie: Movie;
}

export default function TitleActions({ movie }: TitleActionsProps) {
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [loadingTrailer, setLoadingTrailer] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleTrailerClick = async () => {
        if (trailerKey) {
            setShowTrailer(true);
            return;
        }

        setLoadingTrailer(true);
        // We can't call server action directly if not set up, so we rely on client-side fetch wrapper or api
        // Since api.ts uses fetch, it works on client too if CORS allows or if using Next API routes.
        // Quick fix: api.ts fetchMovieVideos targets TMDB directly which works client-side mostly
        const key = await fetchMovieVideos(movie.id);
        setLoadingTrailer(false);

        if (key) {
            setTrailerKey(key);
            setShowTrailer(true);
        } else {
            alert('No trailer available for this title.');
        }
    };

    return (
        <>
            <div className={styles.actionsWrapper}>
                <Link href={`/watch/${movie.id}`} className={styles.playBtn}>
                    <Play fill="currentColor" size={24} style={{ marginRight: '10px' }} />
                    Play Now
                </Link>

                <button
                    onClick={handleTrailerClick}
                    className={styles.trailerBtn}
                    disabled={loadingTrailer}
                >
                    <Film size={24} style={{ marginRight: '10px' }} />
                    {loadingTrailer ? 'Loading...' : 'Trailer'}
                </button>

                <div className={styles.watchlistWrapper}>
                    <WatchlistButton movie={movie} />
                </div>
            </div>


            {/* Trailer Modal via Portal */}
            {showTrailer && trailerKey && mounted && createPortal(
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999, /* Super High Z-Index */
                    background: 'rgba(0,0,0,0.95)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    backdropFilter: 'blur(10px)'
                }} onClick={() => setShowTrailer(false)}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '1200px',
                        aspectRatio: '16/9',
                        background: 'black',
                        boxShadow: '0 0 50px rgba(0,0,0,0.5)',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowTrailer(false)}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'rgba(0,0,0,0.5)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                zIndex: 10,
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <X size={24} />
                        </button>
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                            title="Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
