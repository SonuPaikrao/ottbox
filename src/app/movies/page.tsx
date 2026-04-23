import { discoverMoviesByGenre } from '@/lib/api';
import InfiniteMovieGrid from '@/components/Shared/InfiniteMovieGrid';
import styles from '@/app/page.module.css';

export const metadata = {
    title: 'Explore Movies - OTT Box',
    description: 'Discover the latest and greatest movies.',
};

export default async function MoviesPage() {
    const initialMovies = await discoverMoviesByGenre('movies');

    return (
        <main className={styles.main}>
            <div className="container" style={{ paddingTop: '100px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>Movies</h1>
                    <p style={{ color: '#888', fontSize: '1.1rem' }}>Browse our full collection of cinema.</p>
                </header>

                <InfiniteMovieGrid 
                    initialMovies={initialMovies} 
                    genreId="movies" 
                    type="movie"
                />
            </div>
        </main>
    );
}
