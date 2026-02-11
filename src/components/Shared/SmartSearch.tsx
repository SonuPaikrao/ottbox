'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { searchContent, Movie } from '@/lib/api';
import styles from './SmartSearch.module.css';

export default function SmartSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 1) {
                setIsLoading(true);
                const data = await searchContent(query);
                setResults(data.slice(0, 5)); // Limit to 5 results
                setIsLoading(false);
                setIsOpen(true);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <div className={styles.searchBar}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search titles..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                    className={styles.input}
                />
                {isLoading ? (
                    <Loader2 size={18} className={styles.spinner} />
                ) : query && (
                    <button onClick={clearSearch} className={styles.clearBtn}>
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Live Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className={styles.dropdown}>
                    {results.map((movie) => (
                        <Link
                            key={movie.id}
                            href={`/title/${movie.id}?type=${movie.media_type || 'movie'}`}
                            className={styles.resultItem}
                            onClick={clearSearch}
                        >
                            <div className={styles.posterWrapper}>
                                <Image
                                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : '/placeholder-movie.jpg'}
                                    alt={movie.title || movie.name || 'Poster'}
                                    width={40}
                                    height={60}
                                    className={styles.poster}
                                    loading="lazy"
                                    sizes="40px"
                                    placeholder="blur"
                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMzMzIi8+PC9zdmc+"
                                />
                            </div>
                            <div className={styles.info}>
                                <h4 className={styles.title}>{movie.title || movie.name}</h4>
                                <span className={styles.year}>
                                    {(movie.release_date || movie.first_air_date || '').split('-')[0]} • {movie.media_type === 'tv' ? 'Series' : 'Movie'}
                                </span>
                            </div>
                        </Link>
                    ))}
                    <Link href={`/search?q=${encodeURIComponent(query)}`} className={styles.viewAll} onClick={clearSearch}>
                        View all results for "{query}"
                    </Link>
                </div>
            )}
        </div>
    );
}
