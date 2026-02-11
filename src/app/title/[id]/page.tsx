import { fetchMovieDetails, fetchSimilarMovies, fetchCredits } from "@/lib/api";
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, Calendar, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import WatchlistButton from '@/components/Shared/WatchlistButton';
import MovieCard from "@/components/Shared/MovieCard";
import { Metadata } from 'next';

// Lazy load heavy components that aren't immediately needed
const SeasonSelector = dynamic(() => import('@/components/Title/SeasonSelector'), {
    loading: () => <div style={{ padding: '20px', color: '#888' }}>Loading episodes...</div>
});
const CastList = dynamic(() => import('@/components/Title/CastList'));
const TitleActions = dynamic(() => import('@/components/Title/TitleActions'));

type Props = {
    params: { id: string },
    searchParams: { type?: 'movie' | 'tv' }
}

export async function generateMetadata(
    { params, searchParams }: Props,
): Promise<Metadata> {
    const { id } = await params;
    const { type } = await searchParams;
    const movie = await fetchMovieDetails(id, type);

    if (!movie) {
        return {
            title: 'Content Not Found',
        }
    }
    // ... (rest of metadata)
    return {
        title: movie.title || movie.name,
        // ...
        openGraph: {
            title: `${movie.title || movie.name} - Watch on OTT Box`,
            // ...
        }
    };
}

export default async function TitlePage({ params, searchParams }: { params: { id: string }, searchParams: { type?: 'movie' | 'tv' } }) {
    const { id } = await params;
    const { type } = await searchParams;

    const movie = await fetchMovieDetails(id, type);
    const similarMovies = await fetchSimilarMovies(parseInt(id));

    if (!movie) {
        return <div className="container">Movie not found</div>;
    }

    // Fetch Cast
    const cast = await fetchCredits(id, movie.media_type || 'movie');

    const bgImage = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop';

    return (
        <div className={styles.container}>
            <div className={styles.backdrop} style={{ backgroundImage: `url(${bgImage})` }}>
                <div className={styles.overlay}></div>
            </div>

            <div className={`container ${styles.content}`}>
                <div className={styles.posterWrapper}>
                    <Image
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.jpg'}
                        alt={movie.title || movie.name || 'Movie Poster'}
                        width={300}
                        height={450}
                        className={styles.poster}
                        priority
                        sizes="(max-width: 768px) 80vw, 300px"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzIyMiIvPjwvc3ZnPg=="
                    />
                </div>

                <div className={styles.info}>
                    <h1 className={styles.title}>{movie.title || movie.name}</h1>

                    <div className={styles.meta}>
                        <div className={styles.rating}>
                            <Star fill="#eab308" color="#eab308" size={20} />
                            <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <Calendar size={18} />
                            <span>{movie.release_date || movie.first_air_date}</span>
                        </div>
                    </div>

                    <p className={styles.overview}>{movie.overview}</p>

                    <TitleActions movie={movie} />

                    {/* Cast List */}
                    <div style={{ marginTop: '20px', maxWidth: '100%', overflow: 'hidden' }}>
                        <CastList cast={cast} />
                    </div>
                </div>
            </div>

            {/* Similar Content Section */}

            {/* Season Selector for TV Shows */}
            {movie.media_type === 'tv' && movie.seasons && (
                <div className="container" style={{ marginTop: '40px', marginBottom: '40px' }}>
                    <SeasonSelector
                        tvId={movie.id}
                        seasons={movie.seasons}
                    // Note: For now this is just UI. To play specific episode, we'd update a state or URL if player was on this page
                    />
                </div>
            )}

            {similarMovies.length > 0 && (
                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <h2 className={styles.sectionTitle}>More Like This</h2>
                    <div className={styles.grid}>
                        {similarMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Add Seasons to Movie interface (temporary augmentation or update api.ts interface)
// Ideally update api.ts but for speed adding here if needed, but api.ts returns "any" mostly or needs update.
// Let's rely on api.ts updating the Movie type or casting. The `seasons` prop exists on TMDB TV details.
