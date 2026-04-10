'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { Movie } from '@/lib/api';

export interface HistoryItem {
    movie_id: number;
    user_id: string;
    media_type: 'movie' | 'tv';
    season: number;
    episode: number;
    title: string;
    poster_path: string;
    last_watched: string;
}

interface HistoryContextType {
    history: HistoryItem[];
    addToHistory: (movie: Movie, season?: number, episode?: number) => Promise<void>;
    refreshHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const refreshHistory = useCallback(async () => {
        if (!user) {
            setHistory([]);
            return;
        }

        const { data, error } = await supabase
            .from('watch_history')
            .select('*')
            .eq('user_id', user.id) // CRITICAL: Filter by user_id for security and performance
            .order('last_watched', { ascending: false })
            .limit(50); // Limit to 50 most recent items

        if (data) {
            setHistory(data as HistoryItem[]);
        }
    }, [user]);

    useEffect(() => {
        refreshHistory();
    }, [refreshHistory]);

    const addToHistory = async (movie: Movie, season = 1, episode = 1) => {
        if (!user) return;

        // Optimistic update (optional, but good for UI responsiveness)
        // For simplicity, we'll just wait for the DB to update then refresh or rely on the next fetch
        // But to make it feel instant we could update local state here.

        const newItem = {
            user_id: user.id,
            movie_id: movie.id,
            media_type: movie.media_type || 'movie',
            season: season,
            episode: episode,
            title: movie.title || movie.name || '',
            poster_path: movie.poster_path || '',
            last_watched: new Date().toISOString()
        };

        // Upsert into Supabase
        const { error } = await supabase
            .from('watch_history')
            .upsert(newItem, { onConflict: 'user_id, movie_id' });

        if (!error) {
            // refresh history to move this item to the top
            refreshHistory();
        } else {
            console.error("Error adding to history:", error);
        }
    };

    return (
        <HistoryContext.Provider value={{ history, addToHistory, refreshHistory }}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
}
