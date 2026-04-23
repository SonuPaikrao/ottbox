import { discoverMoviesByGenre } from '@/lib/api';
import InfiniteMovieGrid from '@/components/Shared/InfiniteMovieGrid';
import styles from '@/app/page.module.css';

export const metadata = {
    title: 'TV Shows & Series - OTT Box',
    description: 'Binge-watch the best TV shows and series.',
};

export default async function SeriesPage() {
    const initialSeries = await discoverMoviesByGenre('series', 1, 'tv');

    return (
        <main className={styles.main}>
            <div className="container" style={{ paddingTop: '100px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>TV Shows</h1>
                    <p style={{ color: '#888', fontSize: '1.1rem' }}>Binge-watch your favorite series.</p>
                </header>

                <InfiniteMovieGrid 
                    initialMovies={initialSeries} 
                    genreId="series" 
                    type="tv"
                />
            </div>
        </main>
    );
}
