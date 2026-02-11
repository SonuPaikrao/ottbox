'use client';

import { useWatchlist } from '@/context/WatchlistContext';
import MovieCard from '@/components/Shared/MovieCard';
import styles from './page.module.css';

export default function WatchlistPage() {
    const { watchlist } = useWatchlist();

    if (watchlist.length === 0) {
        return (
            <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Your Watchlist is Empty</h1>
                <p style={{ color: '#aaa' }}>Add movies and series to track what you want to watch.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Watchlist</h1>
            <div className={styles.grid}>
                {watchlist.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}
