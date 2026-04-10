'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Movie } from '@/lib/api';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface WatchlistContextType {
    watchlist: Movie[];
    addToWatchlist: (movie: Movie) => Promise<void>;
    removeFromWatchlist: (id: number) => Promise<void>;
    isInWatchlist: (id: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [watchlist, setWatchlist] = useState<Movie[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load
    useEffect(() => {
        const loadWatchlist = async () => {
            if (user) {
                // Load from Supabase with selective fields
                const { data, error } = await supabase
                    .from('watchlist')
                    .select('movie_id, title, poster_path, vote_average, release_date, media_type') // Only select needed fields
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false }) // Most recent first
                    .limit(100); // Limit to 100 items for performance

                if (data) {
                    // Start with cloud data
                    const cloudMovies: Movie[] = data.map(item => ({
                        id: item.movie_id,
                        title: item.title,
                        poster_path: item.poster_path,
                        backdrop_path: '', // Not stored to save space
                        overview: '', // Not stored
                        vote_average: item.vote_average,
                        release_date: item.release_date,
                        media_type: item.media_type as 'movie' | 'tv'
                    }));
                    setWatchlist(cloudMovies);
                }
            } else {
                // Load from LocalStorage
                const saved = localStorage.getItem('ottbox_watchlist');
                if (saved) {
                    try {
                        setWatchlist(JSON.parse(saved));
                    } catch (e) {
                        console.error("Failed to parse watchlist", e);
                    }
                }
            }
            setIsLoaded(true);
        };

        loadWatchlist();
    }, [user]);

    // Sync Local to Cloud on Login (Batch operation for performance)
    useEffect(() => {
        if (user && isLoaded) {
            const localSaved = localStorage.getItem('ottbox_watchlist');
            if (localSaved) {
                const localMovies: Movie[] = JSON.parse(localSaved);
                if (localMovies.length > 0) {
                    // Batch upload local movies to cloud (single query instead of N queries)
                    const batchData = localMovies.map(movie => ({
                        user_id: user.id,
                        movie_id: movie.id,
                        media_type: movie.media_type || 'movie',
                        title: movie.title || movie.name,
                        poster_path: movie.poster_path,
                        vote_average: movie.vote_average,
                        release_date: movie.release_date || movie.first_air_date
                    }));

                    // Single batch insert
                    supabase.from('watchlist').insert(batchData).then(() => {
                        // Refresh watchlist after batch sync
                        const loadWatchlist = async () => {
                            const { data } = await supabase
                                .from('watchlist')
                                .select('movie_id, title, poster_path, vote_average, release_date, media_type')
                                .eq('user_id', user.id)
                                .order('created_at', { ascending: false })
                                .limit(100);

                            if (data) {
                                const cloudMovies: Movie[] = data.map(item => ({
                                    id: item.movie_id,
                                    title: item.title,
                                    poster_path: item.poster_path,
                                    backdrop_path: '',
                                    overview: '',
                                    vote_average: item.vote_average,
                                    release_date: item.release_date,
                                    media_type: item.media_type as 'movie' | 'tv'
                                }));
                                setWatchlist(cloudMovies);
                            }
                        };
                        loadWatchlist();
                    });

                    // Clear local after sync
                    localStorage.removeItem('ottbox_watchlist');
                }
            }
        }
    }, [user, isLoaded]);

    // Save to LocalStorage if Guest
    useEffect(() => {
        if (!user && isLoaded) {
            localStorage.setItem('ottbox_watchlist', JSON.stringify(watchlist));
        }
    }, [watchlist, user, isLoaded]);

    const addToWatchlist = async (movie: Movie) => {
        // Optimistic UI Update
        setWatchlist(prev => {
            if (prev.some(m => m.id === movie.id)) return prev;
            return [...prev, movie];
        });

        if (user) {
            await supabase.from('watchlist').insert({
                user_id: user.id,
                movie_id: movie.id,
                media_type: movie.media_type || 'movie',
                title: movie.title || movie.name,
                poster_path: movie.poster_path,
                vote_average: movie.vote_average,
                release_date: movie.release_date || movie.first_air_date
            });
        }
    };

    const removeFromWatchlist = async (id: number) => {
        // Optimistic UI Update
        setWatchlist(prev => prev.filter(m => m.id !== id));

        if (user) {
            await supabase.from('watchlist').delete().eq('user_id', user.id).eq('movie_id', id);
        }
    };

    const isInWatchlist = (id: number) => {
        return watchlist.some(m => m.id === id);
    };

    return (
        <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlist() {
    const context = useContext(WatchlistContext);
    if (context === undefined) {
        throw new Error('useWatchlist must be used within a WatchlistProvider');
    }
    return context;
}
