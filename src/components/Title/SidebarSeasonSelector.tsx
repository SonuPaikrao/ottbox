'use client';

import { useState, useEffect } from 'react';
import { fetchSeasonDetails } from '@/lib/api';
import styles from './SidebarSeasonSelector.module.css';

interface Episode {
    episode_number: number;
    name: string;
}

interface SidebarSeasonSelectorProps {
    tvId: number;
    seasons: { season_number: number; name: string; episode_count: number }[];
    currentSeason: number;
    currentEpisode: number;
    onEpisodeSelect: (season: number, episode: number) => void;
}

export default function SidebarSeasonSelector({
    tvId,
    seasons,
    currentSeason,
    currentEpisode,
    onEpisodeSelect
}: SidebarSeasonSelectorProps) {
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(false);

    // Sometimes seasons start from 0 (Specials), sometimes 1.
    // If we want to show all, removing filter. But typically user wants S1.
    const displaySeasons = seasons.filter(s => s.season_number > 0);

    useEffect(() => {
        const loadEpisodes = async () => {
            setLoading(true);
            const data = await fetchSeasonDetails(tvId, currentSeason);
            if (data && data.episodes) {
                setEpisodes(data.episodes);
            }
            setLoading(false);
        };
        loadEpisodes();
    }, [tvId, currentSeason]);

    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.header}>
                <div className={styles.title}>Resources</div>
                <div className={styles.subtitle}>Select Season & Episode</div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>Season</div>
                <div className={styles.seasonGrid}>
                    {displaySeasons.map(season => (
                        <button
                            key={season.season_number}
                            className={`${styles.seasonBtn} ${currentSeason === season.season_number ? styles.activeSeason : ''}`}
                            onClick={() => onEpisodeSelect(season.season_number, 1)} // Default to ep 1 when changing season? Or keep current? Usually 1.
                        >
                            S{season.season_number.toString().padStart(2, '0')}
                        </button>
                    ))}
                </div>

                <div className={styles.sectionTitle} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Episodes</span>
                    <span style={{ fontSize: '0.7em', paddingTop: '2px' }}>{episodes.length} Total</span>
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : (
                    <div className={styles.episodeGrid}>
                        {episodes.map(epis => (
                            <button
                                key={epis.episode_number}
                                className={`${styles.episodeBtn} ${currentEpisode === epis.episode_number ? styles.activeEpisode : ''}`}
                                onClick={() => onEpisodeSelect(currentSeason, epis.episode_number)}
                                title={epis.name}
                            >
                                {epis.episode_number.toString().padStart(2, '0')}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
