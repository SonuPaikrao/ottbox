'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { searchContent, Movie } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchInput({ initialQuery = '' }: { initialQuery?: string }) {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<Movie[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Debounce Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 1) {
                setIsLoading(true);
                const data = await searchContent(query);
                setResults(data.slice(0, 5));
                setIsLoading(false);
                setIsOpen(true);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    return (
        <form
            ref={wrapperRef}
            onSubmit={handleSearch}
            style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 40px', zIndex: 50 }}
        >
            <Search
                size={20}
                style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#999'
                }}
            />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                placeholder="What do you want to watch?"
                style={{
                    width: '100%',
                    padding: '15px 20px 15px 50px',
                    borderRadius: isOpen && results.length > 0 ? '20px 20px 0 0' : '50px',
                    border: '1px solid #333',
                    background: '#141414',
                    color: 'white',
                    fontSize: '1.1rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                }}
                className="search-input"
            />

            {isLoading && (
                <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)' }}>
                    <Loader2 className="animate-spin" size={20} color="#e50914" />
                </div>
            )}

            {/* Suggestions Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="suggestions-dropdown">
                    {results.map((movie) => (
                        <Link
                            key={movie.id}
                            href={`/title/${movie.id}`}
                            className="suggestion-item"
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="poster-wrapper">
                                <Image
                                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : '/placeholder-movie.jpg'}
                                    alt={movie.title || movie.name || 'Poster'}
                                    width={40}
                                    height={60}
                                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                                />
                            </div>
                            <div className="info">
                                <h4>{movie.title || movie.name}</h4>
                                <span className="meta">
                                    {(movie.release_date || movie.first_air_date || '').split('-')[0]} • {movie.media_type === 'tv' ? 'Series' : 'Movie'}
                                </span>
                            </div>
                        </Link>
                    ))}
                    <div
                        onClick={handleSearch}
                        className="suggestion-item view-all"
                    >
                        View all results for "{query}"
                    </div>
                </div>
            )}

            <style jsx>{`
                .search-input:focus {
                    border-color: #e50914 !important;
                    box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
                }
                .suggestions-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background: #1a1a1a;
                    border: 1px solid #333;
                    border-top: none;
                    border-radius: 0 0 20px 20px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                }
                .suggestion-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 10px 20px;
                    text-decoration: none;
                    color: #fff;
                    transition: background 0.2s;
                    cursor: pointer;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .suggestion-item:last-child {
                    border-bottom: none;
                }
                .suggestion-item:hover {
                    background: #252525;
                }
                .poster-wrapper {
                    flex-shrink: 0;
                    width: 40px;
                    height: 60px;
                    background: #111;
                    border-radius: 4px;
                }
                .info h4 {
                    font-size: 0.95rem;
                    margin: 0 0 4px 0;
                    color: #fff;
                }
                .meta {
                    font-size: 0.8rem;
                    color: #999;
                }
                .view-all {
                    justify-content: center;
                    color: #e50914;
                    font-weight: 600;
                    padding: 15px;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </form>
    );
}
