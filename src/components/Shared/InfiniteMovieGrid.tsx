'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Movie, discoverMoviesByGenre } from '@/lib/api';
import MovieCard from '@/components/Shared/MovieCard';
import { Loader2 } from 'lucide-react';
import styles from '@/app/page.module.css';

interface InfiniteMovieGridProps {
    initialMovies: Movie[];
    genreId: string;
    type?: 'movie' | 'tv';
}

export default function InfiniteMovieGrid({ initialMovies, genreId, type = 'movie' }: InfiniteMovieGridProps) {
    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef(null);

    // Reset when genre or type changes
    useEffect(() => {
        setMovies(initialMovies);
        setPage(1);
        setHasMore(true);
    }, [genreId, type, initialMovies]);

    const loadMore = useCallback(async () => {
        const nextPage = page + 1;
        const newMovies = await discoverMoviesByGenre(genreId, nextPage, type);

        if (newMovies.length === 0) {
            setHasMore(false);
        } else {
            // Filter duplicates based on ID
            setMovies((prev) => {
                const existingIds = new Set(prev.map(m => m.id));
                const uniqueNewMovies = newMovies.filter(m => !existingIds.has(m.id));
                return [...prev, ...uniqueNewMovies];
            });
            setPage(nextPage);
        }
    }, [page, genreId, type]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '200px' } // Load earlier
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loadMore]);

    return (
        <>
            <div className={styles.grid}>
                {movies.map((movie, index) => (
                    <MovieCard key={`${movie.id}-${index}`} movie={movie} />
                ))}
            </div>

            {hasMore && (
                <div ref={observerTarget} style={{ display: 'flex', justifyContent: 'center', padding: '40px', width: '100%' }}>
                    <Loader2 className="animate-spin" size={30} color="var(--primary)" />
                </div>
            )}
        </>
    );
}
