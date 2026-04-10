'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play, Star } from 'lucide-react';
import styles from './MovieCard.module.css';
import { Movie } from '@/lib/api';
import WatchlistButton from './WatchlistButton';

interface MovieCardProps {
    movie: Movie;
    type?: 'movie' | 'bg'; // 'bg' for background style cards if needed
}

export default function MovieCard({ movie }: MovieCardProps) {
    return (
        <Link href={`/title/${movie.id}?type=${movie.media_type || 'movie'}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <Image
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.jpg'}
                    alt={movie.title || movie.name || 'Movie Poster'}
                    width={200}
                    height={300}
                    className={styles.image}
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIyMiIvPjwvc3ZnPg=="
                />
                <div className={styles.overlay}>
                    <button className={styles.playBtn}>
                        <Play fill="white" size={20} />
                    </button>
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        <WatchlistButton movie={movie} />
                    </div>
                </div>
                <div className={styles.rating}>
                    <Star size={12} fill="#eab308" color="#eab308" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                </div>
            </div>
            <div className={styles.info}>
                <h3 className={styles.title}>{movie.title}</h3>
                <p className={styles.meta}>{movie.release_date?.split('-')[0] || 'N/A'}</p>
            </div>
        </Link>
    );
}
