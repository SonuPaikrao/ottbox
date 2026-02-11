'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './SearchFilterBar.module.css';

const GENRES = [
    { id: 'all', name: 'All Genres' },
    { id: '28', name: 'Action' },
    { id: '12', name: 'Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '99', name: 'Documentary' },
    { id: '18', name: 'Drama' },
    { id: '10751', name: 'Family' },
    { id: '14', name: 'Fantasy' },
    { id: '36', name: 'History' },
    { id: '27', name: 'Horror' },
    { id: '10402', name: 'Music' },
    { id: '9648', name: 'Mystery' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Sci-Fi' },
    { id: '53', name: 'Thriller' },
    { id: '10752', name: 'War' },
    { id: '37', name: 'Western' },
];

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
const RATINGS = [9, 8, 7, 6, 5];

const LANGUAGES = [
    { id: 'all', name: 'All Regions' },
    { id: 'hi', name: 'Bollywood (Hindi)' },
    { id: 'en', name: 'Hollywood (English)' },
    { id: 'ko', name: 'K-Drama (Korean)' },
    { id: 'ja', name: 'Anime / Japanese' },
    { id: 'es', name: 'Spanish' },
    { id: 'fr', name: 'French' },
];

export default function SearchFilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [type, setType] = useState(searchParams.get('type') || 'movie');
    const [genre, setGenre] = useState(searchParams.get('genre') || 'all');
    const [year, setYear] = useState(searchParams.get('year') || '');
    const [rating, setRating] = useState(searchParams.get('rating') || '');
    const [language, setLanguage] = useState(searchParams.get('lang') || 'all');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popularity.desc');

    useEffect(() => {
        // Debounce or just update on change? 
        // For simplicity, we trigger filterUpdate immediately
    }, []);

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // If sorting/filtering, we usually clear the 'q' (text search) to switch mode, 
        // OR we keep it if we want to filter search results (though API support varies)
        // For this implementation: "Advanced Discovery" replaces text search if used.
        if (key !== 'sort') {
            // params.delete('q'); // Optional: decide if filters reset text search
        }

        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.group}>
                <label>Type</label>
                <select
                    value={type}
                    onChange={(e) => { setType(e.target.value); handleFilterChange('type', e.target.value); }}
                    className={styles.select}
                >
                    <option value="movie">Movies</option>
                    <option value="tv">TV Series</option>
                </select>
            </div>

            <div className={styles.group}>
                <label>Genre</label>
                <select
                    value={genre}
                    onChange={(e) => { setGenre(e.target.value); handleFilterChange('genre', e.target.value); }}
                    className={styles.select}
                >
                    {GENRES.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                </select>
            </div>

            <div className={styles.group}>
                <label>Year</label>
                <select
                    value={year}
                    onChange={(e) => { setYear(e.target.value); handleFilterChange('year', e.target.value); }}
                    className={styles.select}
                >
                    <option value="">All Years</option>
                    {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            <div className={styles.group}>
                <label>Min Rating</label>
                <select
                    value={rating}
                    onChange={(e) => { setRating(e.target.value); handleFilterChange('rating', e.target.value); }}
                    className={styles.select}
                >
                    <option value="">Any</option>
                    {RATINGS.map(r => (
                        <option key={r} value={r}>{r}+ Stars</option>
                    ))}
                </select>
            </div>

            <div className={styles.group}>
                <label>Region / Language</label>
                <select
                    value={language}
                    onChange={(e) => { setLanguage(e.target.value); handleFilterChange('lang', e.target.value); }}
                    className={styles.select}
                >
                    {LANGUAGES.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                </select>
            </div>

            <div className={styles.group}>
                <label>Sort By</label>
                <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); handleFilterChange('sort', e.target.value); }}
                    className={styles.select}
                >
                    <option value="popularity.desc">Most Popular</option>
                    <option value="vote_average.desc">Top Rated</option>
                    <option value="primary_release_date.desc">Newest</option>
                </select>
            </div>
        </div>
    );
}
