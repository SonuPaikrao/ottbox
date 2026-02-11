'use client';

import { useState, useEffect } from 'react';
import { fetchSeasonDetails } from '@/lib/api';
import { ChevronDown, PlayCircle } from 'lucide-react';
import Image from 'next/image';

interface Episode {
    id: number;
    episode_number: number;
    name: string;
    overview: string;
    still_path: string | null;
    air_date: string;
    runtime: number;
}

interface SeasonSelectorProps {
    tvId: number;
    seasons: { season_number: number; name: string; episode_count: number }[];
    onEpisodeSelect?: (season: number, episode: number) => void;
}

export default function SeasonSelector({ tvId, seasons, onEpisodeSelect }: SeasonSelectorProps) {
    const [selectedSeason, setSelectedSeason] = useState(seasons[0]?.season_number || 1);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(false);

    // Filter out Season 0 (Specials) if desired, usually users want Season 1 first
    const cleanSeasons = seasons.filter(s => s.season_number > 0);

    useEffect(() => {
        const loadEpisodes = async () => {
            setLoading(true);
            const data = await fetchSeasonDetails(tvId, selectedSeason);
            if (data && data.episodes) {
                setEpisodes(data.episodes);
            }
            setLoading(false);
        };
        loadEpisodes();
    }, [tvId, selectedSeason]);

    return (
        <div style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Season</h3>
            </div>

            {/* Grid Season Buttons (Matching Sidebar Style) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '10px',
                marginBottom: '30px'
            }}>
                {cleanSeasons.map(season => (
                    <button
                        key={season.season_number}
                        onClick={() => setSelectedSeason(season.season_number)}
                        style={{
                            background: selectedSeason === season.season_number ? '#e50914' : '#1a1a1a',
                            color: selectedSeason === season.season_number ? 'white' : '#aaa',
                            border: '1px solid',
                            borderColor: selectedSeason === season.season_number ? '#e50914' : '#333',
                            padding: '12px 0',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'center'
                        }}
                    >
                        S{season.season_number.toString().padStart(2, '0')}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Episodes</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading episodes...</div>
                ) : (
                    episodes.map(episode => (
                        <div
                            key={episode.id}
                            onClick={() => onEpisodeSelect && onEpisodeSelect(selectedSeason, episode.episode_number)}
                            style={{
                                display: 'flex',
                                gap: '20px',
                                padding: '20px',
                                background: '#111',
                                borderRadius: '8px',
                                border: '1px solid #222',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            className="episode-card"
                        >
                            <div style={{ position: 'relative', width: '160px', height: '90px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', background: '#222' }}>
                                {episode.still_path ? (
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                                        alt={episode.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        loading="lazy"
                                        sizes="(max-width: 768px) 40vw, 20vw"
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>No Image</div>
                                )}
                                <div className="play-overlay" style={{
                                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)'
                                }}>
                                    <PlayCircle size={30} fill="white" />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{episode.episode_number}. {episode.name}</h4>
                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>{episode.runtime}m</span>
                                </div>
                                <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {episode.overview}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
                .episode-card:hover {
                    background: #1a1a1a !important;
                    border-color: #333 !important;
                }
            `}</style>
        </div>
    );
}
