'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './GenrePills.module.css';

// Separate genre lists for Movies and TV
const movieGenres = [
    { id: '28', name: 'Action' },
    { id: '35', name: 'Comedy' },
    { id: '18', name: 'Drama' },
    { id: '27', name: 'Horror' },
    { id: '878', name: 'Sci-Fi' },
    { id: '10749', name: 'Romance' },
    { id: '53', name: 'Thriller' },
    { id: '16', name: 'Animation' },
];

const tvGenres = [
    { id: '10759', name: 'Action & Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '18', name: 'Drama' },
    { id: '9648', name: 'Mystery' },
    { id: '10765', name: 'Sci-Fi & Fantasy' },
    { id: '10768', name: 'War & Politics' },
];

export default function GenrePills() {
    const searchParams = useSearchParams();
    const currentGenre = searchParams.get('genre');
    const currentType = searchParams.get('type'); // 'movie', 'tv', or null

    // Determine which genres to show
    const displayGenres = currentType === 'tv' ? tvGenres : movieGenres;

    return (
        <div className={styles.container}>
            <div className={styles.scrollWrapper}>
                {/* Type Selectors */}
                <Link
                    href="/"
                    className={`${styles.pill} ${!currentType ? styles.active : ''}`}
                    style={{ fontWeight: 'bold', border: '1px solid #333' }}
                >
                    All
                </Link>
                <Link
                    href="/?type=movie"
                    className={`${styles.pill} ${currentType === 'movie' ? styles.active : ''}`}
                    style={{ fontWeight: 'bold', border: '1px solid #333' }}
                >
                    Movies
                </Link>
                <Link
                    href="/?type=tv"
                    className={`${styles.pill} ${currentType === 'tv' ? styles.active : ''}`}
                    style={{ fontWeight: 'bold', border: '1px solid #333' }}
                >
                    Series
                </Link>

                <div style={{ width: '1px', height: '20px', background: '#333', margin: '0 10px' }}></div>

                {/* Genre Selectors */}
                {displayGenres.map((genre) => (
                    <Link
                        key={genre.id}
                        // If type is selected, preserve it. Logic:
                        // 1. If currently All, selecting a genre defaults to Movie (standard behavior) or keeps All? 
                        //    Let's keep it simple: If no type, default Type=movie for genre filtering? 
                        //    Actually, better to allow filtering mixed content if API supports it, but simple discover API splits movie/tv.
                        //    So: If no Type, default to Movie when selecting a genre.
                        href={`/?${currentType ? `type=${currentType}&` : 'type=movie&'}genre=${genre.id}`}
                        className={`${styles.pill} ${currentGenre === genre.id ? styles.active : ''}`}
                    >
                        {genre.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}
