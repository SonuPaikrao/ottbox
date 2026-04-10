'use client';

import { useWatchlist } from '@/context/WatchlistContext';
import { useAuth } from '@/context/AuthContext';
import MovieCard from '@/components/Shared/MovieCard';
import styles from './page.module.css';

export default function WatchlistPage() {
    const { watchlist } = useWatchlist();

    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    }

    if (!user) {
        return (
            <div className="container" style={{ height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '15px' }}>Sign In Required</h1>
                <p style={{ color: '#aaa', marginBottom: '20px' }}>Please log in to view and manage your watchlist.</p>
            </div>
        );
    }

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
