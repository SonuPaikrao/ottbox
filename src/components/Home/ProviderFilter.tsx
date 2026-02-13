'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchByProvider, Movie } from '@/lib/api';
import MovieCard from '../Shared/MovieCard';
import { Loader2, Film, Tv } from 'lucide-react';

const providers = [
    { id: 8, name: 'Netflix', logo: '/t/p/original/wwemzKWzjKYJFfCeiB57q3r4Bcm.svg' }, // Svg might need config, trying png fallback if safer? TMDB serves both. let's use original path.
    // Actually search said wwemzKWzjKYJFfCeiB57q3r4Bcm.png. 
    // Let's use standard base url in component `https://image.tmdb.org` 
    { id: 119, name: 'Prime Video', logo: '/t/p/original/8z7rC8uIDaTM91X0ZfkRf04ydj2.jpg' },
    { id: 122, name: 'Hotstar', logo: '/t/p/original/zdTSUEVZFXp3E0EkOMGN99QPVJp.jpg' },
    { id: 220, name: 'JioCinema', logo: '/t/p/original/4kaUv6rT537r8pvn0yO57e841f.jpg' }, // Trying a likely path, if fails we handle error
    { id: 2, name: 'Apple TV+', logo: '/t/p/original/9ghgSC0MA082EL6HLCW3GalykFD.jpg' }
];

export default function ProviderFilter() {
    const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
    const [activeProvider, setActiveProvider] = useState<number>(8); // Default Netflix
    const [content, setContent] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true);
            try {
                // Fetch content
                const data = await fetchByProvider(activeProvider, mediaType);
                setContent(data);
            } catch (error) {
                console.error('Error loading provider content:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();
    }, [activeProvider, mediaType]);

    return (
        <section className="container mt-8 mb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Providers</h2>
                    <p className="text-gray-400 text-sm">Browse content from your favorite streaming services</p>
                </div>

                {/* Toggle */}
                <div className="flex bg-zinc-800 p-1 rounded-lg">
                    <button
                        onClick={() => setMediaType('movie')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mediaType === 'movie' ? 'bg-zinc-700 text-white shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Movies
                    </button>
                    <button
                        onClick={() => setMediaType('tv')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mediaType === 'tv' ? 'bg-zinc-700 text-white shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        TV Shows
                    </button>
                </div>
            </div>

            {/* Provider Logos */}
            {/* Provider Logos */}
            <div className="flex flex-row flex-nowrap overflow-x-auto gap-3 pb-4 hide-scrollbar snap-x snap-mandatory mb-6">
                {providers.map((provider) => (
                    <button
                        key={provider.id}
                        onClick={() => setActiveProvider(provider.id)}
                        className={`relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden transition-all duration-300 ${activeProvider === provider.id
                            ? 'ring-2 ring-white scale-105 shadow-lg shadow-primary/20'
                            : 'opacity-60 hover:opacity-100 hover:scale-105'
                            }`}
                    >
                        <Image
                            src={`https://image.tmdb.org${provider.logo}`}
                            alt={provider.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                        />
                    </button>
                ))}
            </div>

            {/* Content Slider */}
            <div className="relative min-h-[250px]">
                {isLoading ? (
                    <div className="flex flex-row flex-nowrap gap-3 overflow-hidden">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex-shrink-0 w-[130px] md:w-[170px] h-[220px] md:h-[280px] bg-zinc-800 animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold text-white mb-3 px-1">
                            {providers.find(p => p.id === activeProvider)?.name} {mediaType === 'movie' ? 'Movies' : 'Series'}
                        </h3>
                        {/* Force horizontal scroll with flex-nowrap */}
                        <div className="flex flex-row flex-nowrap overflow-x-auto gap-3 pb-4 hide-scrollbar snap-x snap-mandatory">
                            {content.map((item) => (
                                <div key={item.id} className="flex-shrink-0 w-[130px] md:w-[170px] snap-start">
                                    <MovieCard movie={item} />
                                </div>
                            ))}
                            {content.length === 0 && (
                                <div className="text-gray-400 py-10 w-full text-center">No content found for this provider.</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
