'use client';

import { useHistory } from '@/context/HistoryContext';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import styles from './ContinueWatchingRow.module.css';

export default function ContinueWatchingRow() {
    const { history } = useHistory();
    const rowRef = useRef<HTMLDivElement>(null);
    const [showControls, setShowControls] = useState(false);

    if (!history || history.length === 0) return null;

    return (
        <div className={styles.rowContainer}>
            <h2 className={styles.rowTitle}>Continue Watching</h2>

            <div className={styles.row} ref={rowRef}>
                {history.map((item) => (
                    <Link
                        key={`${item.movie_id}-${item.season}-${item.episode}`}
                        href={`/watch/${item.movie_id}`}
                        className={styles.card}
                    >
                        <div className={styles.posterWrapper}>
                            <Image
                                src={item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : '/placeholder-movie.jpg'}
                                alt={item.title}
                                fill
                                className={styles.poster}
                                sizes="(max-width: 768px) 40vw, 20vw"
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIyMiIvPjwvc3ZnPg=="
                            />
                            <div className={styles.overlay}>
                                <PlayCircle size={40} className={styles.playIcon} />
                                {item.media_type === 'tv' && (
                                    <span className={styles.episodeBadge}>S{item.season}:E{item.episode}</span>
                                )}
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '50%' }}></div>
                            </div>
                        </div>
                        <h3 className={styles.title}>{item.title}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
}
