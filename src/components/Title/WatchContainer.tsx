'use client';

import { useState, useEffect } from 'react';
import VideoPlayer from '@/components/Player/VideoPlayer';
import SeasonSelector from '@/components/Title/SeasonSelector';
import SidebarSeasonSelector from '@/components/Title/SidebarSeasonSelector';
import { Movie } from '@/lib/api';
import styles from '@/app/watch/[id]/page.module.css';
import Link from 'next/link';
import { Star, Calendar } from 'lucide-react';
import { useHistory } from '@/context/HistoryContext';

interface WatchContainerProps {
    movie: Movie;
    tmdbId: string;
}

export default function WatchContainer({ movie, tmdbId }: WatchContainerProps) {
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);
    const { addToHistory } = useHistory();

    // Track history when season/episode changes or on mount
    useEffect(() => {
        addToHistory(movie, season, episode);
    }, [movie, season, episode]);

    const handleEpisodeSelect = (s: number, e: number) => {
        setSeason(s);
        setEpisode(e);
        // Scroll to top to watch
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const isTV = movie.media_type === 'tv';

    return (
        <div className="container" style={{ paddingTop: '80px' }}>
            <div className={isTV ? styles.watchLayoutTV : ''}>

                {/* Main Content Area (Player + Info) */}
                <div className={styles.mainContent}>
                    <div className={styles.playerSection}>
                        <VideoPlayer
                            tmdbId={tmdbId}
                            type={movie.media_type || 'movie'}
                            season={season}
                            episode={episode}
                        />
                    </div>

                    <div className={styles.details}>
                        <h1 className={styles.title}>
                            {movie.title || movie.name}
                            {isTV && <span style={{ opacity: 0.7, fontSize: '0.8em', marginLeft: '10px' }}>S{season}:E{episode}</span>}
                        </h1>

                        <div className={styles.meta}>
                            <span className={styles.tag}>
                                <Star size={16} fill="#eab308" color="#eab308" />
                                {movie.vote_average?.toFixed(1)}
                            </span>
                            <span className={styles.tag}>
                                <Calendar size={16} />
                                {movie.release_date || movie.first_air_date}
                            </span>
                            <span className={styles.quality}>HD</span>
                        </div>

                        <p className={styles.overview}>{movie.overview}</p>

                        {/* Traditional Season Selector for Mobile or logical fallback if sidebar hidden by CSS */}
                        {isTV && movie.seasons && (
                            <div className="d-lg-none"> {/* Hidden on desktop if we use sidebar */}
                                <SeasonSelector
                                    tvId={Number(tmdbId)}
                                    seasons={movie.seasons}
                                    onEpisodeSelect={handleEpisodeSelect}
                                />
                            </div>
                        )}

                        <div className={styles.actions} style={{ marginTop: '30px' }}>
                            <Link href="/" className="btn btn-outline">Back to Home</Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar for TV Shows */}
                {isTV && movie.seasons && (
                    <div className={styles.sidebarWrapper}>
                        <SidebarSeasonSelector
                            tvId={Number(tmdbId)}
                            seasons={movie.seasons}
                            currentSeason={season}
                            currentEpisode={episode}
                            onEpisodeSelect={handleEpisodeSelect}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
