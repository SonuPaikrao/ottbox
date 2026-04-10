'use client';

import { useState, useEffect, useRef } from 'react';
import { Movie, discoverMoviesByGenre } from '@/lib/api';
import MovieCard from '@/components/Shared/MovieCard';
import styles from '@/app/page.module.css';

const EXTRA_GENRES = [
    { id: '28', name: 'Action Hits' },
    { id: '35', name: 'Comedy Favorites' },
    { id: '27', name: 'Horror Night' },
    { id: '878', name: 'Sci-Fi Worlds' },
    { id: '10749', name: 'Romance' },
    { id: '53', name: 'Thriller Picks' },
    { id: '16', name: 'Animated Gems' },
    { id: '12', name: 'Adventure' },
    { id: '80', name: 'Crime Sagas' },
];

export default function HomeInfiniteRows() {
    const [rows, setRows] = useState<{ id: string; name: string; movies: Movie[] }[]>([]);
    const [page, setPage] = useState(0);
    const observerTarget = useRef(null);
    const [loading, setLoading] = useState(false);

    const loadNextRow = async () => {
        if (loading || page >= EXTRA_GENRES.length) return;
        setLoading(true);

        const genre = EXTRA_GENRES[page];
        const movies = await discoverMoviesByGenre(genre.id, 1);

        if (movies.length > 0) {
            setRows(prev => [...prev, { ...genre, movies: movies.slice(0, 10) }]);
            setPage(prev => prev + 1);
        }
        setLoading(false);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadNextRow();
                }
            },
            { threshold: 0.1, rootMargin: '200px' }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [page, loading]);

    return (
        <>
            {rows.map((row, index) => (
                <section key={`${row.id}-${index}`} className="container" style={{ marginTop: '50px' }}>
                    <h2 className={styles.sectionTitle}>{row.name}</h2>
                    <div className={styles.grid} style={{ overflowX: 'auto', display: 'flex', paddingBottom: '20px', scrollbarWidth: 'none' }}>
                        {/* Reusing grid style for card look but forcing horizontal scroll layout manually if needed, 
                           OR finding a way to reuse grid class but make it horizontal. 
                           Actually, the existing Top10 is horizontal. 
                           The existing page structure uses `grid` which is 5 columns. 
                           User wants 'Infinite Scroll' implies vertical list of rows usually.
                           Let's stick to the 5-column grid for consistency or make them horizontal sliders like Netflix?
                           Netflix is horizontal sliders. The existing Top10Row is horizontal.
                           The existing 'Trending Now' on page uses `styles.grid` which is CSS Grid (multiline).
                           Let's stick to Grid to fill the page vertically which feels more "Endless" content rows.
                        */}
                        <div className={styles.grid}>
                            {row.movies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {page < EXTRA_GENRES.length && (
                <div ref={observerTarget} style={{ height: '100px', width: '100%' }}></div>
            )}
        </>
    );
}
