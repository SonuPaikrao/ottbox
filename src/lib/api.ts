
const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c'; // Public TMDB Key for Demo
const BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
    id: number;
    title: string;
    name?: string; // For TV Series
    poster_path: string;
    backdrop_path: string;
    overview: string;
    vote_average: number;
    release_date?: string;
    first_air_date?: string; // For TV Series
    genre_ids?: number[];
    media_type?: 'movie' | 'tv';
    seasons?: { season_number: number; name: string; episode_count: number }[];
    runtime?: number; // Runtime in minutes (for movies)
    genres?: { id: number; name: string }[]; // Full genre objects (from details API)
}

export const fetchTrendingSeries = async (): Promise<Movie[]> => {
    try {
        const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Failed to fetch trending series:", error);
        return [];
    }
};

export const fetchTrendingDay = async (): Promise<Movie[]> => {
    try {
        const res = await fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`, {
            next: { revalidate: 1800 } // Cache for 30 minutes (trending updates frequently)
        });
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Failed to fetch trending today:", error);
        return [];
    }
};

export const fetchTrending = async (): Promise<Movie[]> => {
    try {
        const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Failed to fetch trending:", error);
        return [];
    }
};

export const fetchTopRated = async (): Promise<Movie[]> => {
    try {
        const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`, {
            next: { revalidate: 86400 } // Cache for 24 hours (top rated rarely changes)
        });
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Failed to fetch top rated:", error);
        return [];
    }
};

export const fetchMovieVideos = async (id: number): Promise<string | null> => {
    try {
        const res = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`, {
            next: { revalidate: 604800 } // Cache video/trailer keys for 7 days
        });
        const data = await res.json();
        // Find the first trailer or teaser
        const video = data.results?.find((v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
        return video ? video.key : null;
    } catch (error) {
        console.error("Failed to fetch videos:", error);
        return null;
    }
};

export const searchContent = async (query: string): Promise<Movie[]> => {
    try {
        if (!query) return [];
        const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`);
        const data = await res.json();
        // Filter out people and ensure media_type is present or inferred
        return (data.results || []).filter((item: any) =>
            item.poster_path && (item.media_type === 'movie' || item.media_type === 'tv')
        );
    } catch (error) {
        console.error("Failed to search content:", error);
        return [];
    }
};

export const fetchMovieDetails = async (id: string, type?: 'movie' | 'tv'): Promise<Movie | null> => {
    try {
        // If type is known, use it
        if (type) {
            const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`, {
                next: { revalidate: 86400 } // Cache detail pages for 24 hours
            });
            if (res.ok) {
                const data = await res.json();
                return { ...data, media_type: type };
            }
        }

        // Otherwise try movie first
        let res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`, {
            next: { revalidate: 86400 }
        });
        if (res.ok) {
            const data = await res.json();
            return { ...data, media_type: 'movie' };
        }

        // If not movie, try TV
        res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`, {
            next: { revalidate: 86400 }
        });
        if (res.ok) {
            const data = await res.json();
            return { ...data, media_type: 'tv' };
        }

        return null;
    } catch (error) {
        console.error("Failed to fetch details:", error);
        return null;
    }
};

export const fetchSeasonDetails = async (tvId: number, seasonNumber: number) => {
    try {
        const res = await fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`, {
            next: { revalidate: 604800 } // Cache season data for 7 days (rarely changes)
        });
        const data = await res.json();
        return data; // Returns episodes list
    } catch (error) {
        console.error("Failed to fetch season details:", error);
        return null;
    }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
    try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Failed to search movies:", error);
        return [];
    }
}

export const fetchSimilarMovies = async (id: number): Promise<Movie[]> => {
    try {
        const res = await fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`, {
            next: { revalidate: 86400 } // Cache similar movies for 24 hours
        });
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Failed to fetch similar movies:", error);
        return [];
    }
};

export const discoverMoviesByGenre = async (genreId?: string, page: number = 1, type: 'movie' | 'tv' = 'movie'): Promise<Movie[]> => {
    try {
        const today = new Date().toISOString().split('T')[0];
        let url = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_date.lte=${today}&vote_count.gte=50&include_adult=false&page=${page}`;

        // Handle special "pseudo-genres" or regular genres
        if (genreId === 'series') {
            type = 'tv';
            url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&first_air_date.lte=${today}&vote_count.gte=50&include_adult=false&page=${page}`;
        } else if (genreId === 'movies') {
            type = 'movie';
            // url already set for movie
        } else if (genreId) {
            // Normal genre ID
            url += `&with_genres=${genreId}`;
        }

        const res = await fetch(url, {
            next: { revalidate: 3600 } // Cache discovery results for 1 hour
        });
        const data = await res.json();
        return (data.results || []).map((item: any) => ({ ...item, media_type: type }));
    } catch (error) {
        console.error("Failed to discover movies by genre:", error);
        return [];
    }
};

interface DiscoverParams {
    type?: 'movie' | 'tv';
    genreId?: string;
    year?: string;
    sortBy?: string;
    voteAverage?: number;
    page?: number;
    language?: string;
}

export const discoverAdvanced = async (params: DiscoverParams): Promise<Movie[]> => {
    try {
        const { type = 'movie', genreId, year, sortBy = 'popularity.desc', voteAverage = 0, page = 1, language } = params;

        let url = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&sort_by=${sortBy}&include_adult=false&include_video=false&page=${page}&vote_count.gte=10`;

        if (genreId && genreId !== 'all') url += `&with_genres=${genreId}`;

        if (year) {
            if (type === 'movie') url += `&primary_release_year=${year}`;
            else url += `&first_air_date_year=${year}`;
        }

        if (voteAverage > 0) {
            url += `&vote_average.gte=${voteAverage}`;
        }

        if (language && language !== 'all') {
            url += `&with_original_language=${language}`;
        }

        const res = await fetch(url, {
            next: { revalidate: 3600 } // Cache filtered results for 1 hour
        });
        const data = await res.json();

        return (data.results || []).map((item: any) => ({ ...item, media_type: type }));
    } catch (error) {
        console.error("Failed to discover content:", error);
        return [];
    }
};
export const fetchFeaturedContent = async (): Promise<Movie[]> => {
    try {
        // This runs on the server (in page.tsx) so we can use supabase logic if we import it,
        // BUT strict separation is better. For now we will assume this calls an internal API or just uses supabase client directly in the component.
        // Actually, let's keep it simple and do the supabase call in page.tsx for now.
        return [];
    } catch (error) {
        return [];
    }
};

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export const fetchCredits = async (id: string, type: 'movie' | 'tv' = 'movie'): Promise<CastMember[]> => {
    try {
        const res = await fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`, {
            next: { revalidate: 604800 } // Cache cast/crew for 7 days
        });
        const data = await res.json();
        return (data.cast || []).slice(0, 15); // limit to top 15
    } catch (error) {
        console.error("Failed to fetch credits:", error);
        return [];
    }
};
