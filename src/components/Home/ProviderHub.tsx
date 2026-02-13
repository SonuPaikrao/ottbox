'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Movie, fetchByProvider } from '@/lib/api';
import { ChevronLeft, ChevronRight, Film, Tv, Play } from 'lucide-react';
import Link from 'next/link';

// Provider Data with Brand Colors
const PROVIDERS = [
    { id: '8', name: 'Netflix', logo: '/providers/netflix.png', color: 'rgba(229, 9, 20, 0.6)', borderColor: '#E50914' },
    { id: '119', name: 'Prime Video', logo: '/providers/prime.png', color: 'rgba(0, 168, 225, 0.6)', borderColor: '#00A8E1' },
    { id: '337', name: 'Disney+', logo: '/providers/disney.png', color: 'rgba(17, 60, 207, 0.6)', borderColor: '#113CCF' },
    { id: '122', name: 'Hotstar', logo: '/providers/hotstar.png', color: 'rgba(19, 172, 25, 0.6)', borderColor: '#13AC19' },
    { id: '238', name: 'SonyLIV', logo: '/providers/sonyliv.png', color: 'rgba(255, 165, 0, 0.6)', borderColor: '#FFA500' },
    { id: '220', name: 'JioCinema', logo: '/providers/jio.png', color: 'rgba(206, 17, 107, 0.6)', borderColor: '#CE116B' },
    { id: '121', name: 'Apple TV', logo: '/providers/appletv.png', color: 'rgba(255, 255, 255, 0.3)', borderColor: '#FFFFFF' },
    { id: '2500', name: 'Zee5', logo: '/providers/zee5.png', color: 'rgba(128, 0, 128, 0.6)', borderColor: '#800080' },
];

export default function ProviderHub() {
    const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
    const [activeProvider, setActiveProvider] = useState<string>('8'); // Default: Netflix
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // Initial Load & Effect
    useEffect(() => {
        loadContent();
    }, [activeProvider, mediaType, page]);

    const loadContent = async () => {
        setLoading(true);
        const data = await fetchByProvider(activeProvider, page, mediaType);
        setMovies(data);
        setLoading(false);
    };

    const handleProviderClick = (id: string) => {
        if (id === activeProvider) return;
        setActiveProvider(id);
        setPage(1); // Reset to page 1 on provider change
    };

    const toggleType = (type: 'movie' | 'tv') => {
        if (type === mediaType) return;
        setMediaType(type);
        setPage(1);
    };

    const activeProviderData = PROVIDERS.find(p => p.id === activeProvider);

    return (
        <div className="w-full px-4 md:px-12 py-8 bg-black/40 backdrop-blur-sm border-t border-b border-[#222] my-8 relative overflow-hidden">

            {/* Background Glow based on active provider */}
            <div
                className="absolute inset-0 opacity-10 blur-3xl transition-colors duration-1000 pointer-events-none"
                style={{ backgroundColor: activeProviderData?.borderColor || '#000' }}
            />

            {/* Header Area */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Streaming</span>
                        Hub
                    </h2>
                    <p className="text-gray-400 text-sm">Browse content from your favorite services</p>
                </div>

                {/* Type Toggle */}
                <div className="flex items-center bg-[#111] border border-[#333] rounded-full p-1 mt-4 md:mt-0">
                    <button
                        onClick={() => toggleType('movie')}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${mediaType === 'movie' ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Film size={14} /> Movies
                    </button>
                    <button
                        onClick={() => toggleType('tv')}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${mediaType === 'tv' ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Tv size={14} /> TV Shows
                    </button>
                </div>
            </div>

            {/* Provider List (Horizontal Scroll) */}
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide relative z-10">
                {PROVIDERS.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => handleProviderClick(p.id)}
                        className="group relative flex-shrink-0 transition-all duration-300 transform hover:scale-105"
                    >
                        <div
                            className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border-2 overflow-hidden bg-[#1a1a1a] transition-all duration-300 ${activeProvider === p.id
                                    ? 'shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-105'
                                    : 'border-[#333] grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'
                                }`}
                            style={{
                                borderColor: activeProvider === p.id ? p.borderColor : '#333',
                                boxShadow: activeProvider === p.id ? `0 0 15px ${p.color}` : 'none'
                            }}
                        >
                            {/* Logo */}
                            <span className="text-[10px] font-bold text-white">{p.name}</span>
                        </div>
                        {/* Active Indicator Dot */}
                        {activeProvider === p.id && (
                            <div
                                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: p.borderColor, boxShadow: `0 0 5px ${p.borderColor}` }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Grid Header */}
            <div className="mb-4 flex items-center justify-between relative z-10 mt-2">
                <h3 className="text-xl font-semibold text-white">
                    <span style={{ color: activeProviderData?.borderColor }}>{activeProviderData?.name}</span> {mediaType === 'movie' ? 'Movies' : 'TV Shows'}
                </h3>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#222] text-white hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed border border-[#333]"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-mono text-gray-400">Page {page}</span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#222] text-white hover:bg-[#333] border border-[#333]"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 relative z-10 min-h-[300px]">
                {loading ? (
                    // Skeleton Loading
                    [...Array(10)].map((_, i) => (
                        <div key={i} className="aspect-[2/3] bg-[#1a1a1a] rounded-xl animate-pulse" />
                    ))
                ) : (
                    movies.map((movie) => (
                        <Link
                            key={movie.id}
                            href={`/${mediaType === 'movie' ? 'watch' : 'series'}/${movie.id}`}
                            className="group relative block aspect-[2/3] bg-[#111] rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-black/50 hover:z-20"
                        >
                            <Image
                                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.png'}
                                alt={movie.title || movie.name || 'Untitled'}
                                fill
                                className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <h4 className="text-white font-bold text-sm line-clamp-2 leading-tight">
                                    {movie.title || movie.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white">
                                        {(movie.vote_average || 0).toFixed(1)} ★
                                    </span>
                                    <span className="text-[10px] text-gray-300">
                                        {new Date(movie.release_date || movie.first_air_date || '').getFullYear() || 'N/A'}
                                    </span>
                                </div>
                                <button className="mt-3 w-full py-1.5 bg-white text-black text-xs font-bold rounded flex items-center justify-center gap-1 hover:bg-gray-200 transition-colors">
                                    <Play size={10} fill="currentColor" /> Watch
                                </button>
                            </div>
                        </Link>
                    ))
                )}
            </div>
            {!loading && movies.length === 0 && (
                <div className="w-full h-40 flex items-center justify-center text-gray-500">
                    No content found for this provider.
                </div>
            )}
        </div>
    );
}
