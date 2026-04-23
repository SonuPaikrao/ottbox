import { fetchTrendingDay } from '@/lib/api';
import InfiniteMovieGrid from '@/components/Shared/InfiniteMovieGrid';
import styles from '@/app/page.module.css';

export const metadata = {
    title: 'Trending Content - OTT Box',
    description: 'See what everyone is watching right now.',
};

export default async function TrendingPage() {
    const initialTrending = await fetchTrendingDay();

    return (
        <main className={styles.main}>
            <div className="container" style={{ paddingTop: '100px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>Trending Now</h1>
                    <p style={{ color: '#888', fontSize: '1.1rem' }}>The most popular movies and shows today.</p>
                </header>

                <InfiniteMovieGrid 
                    initialMovies={initialTrending} 
                    genreId="trending" 
                />
            </div>
        </main>
    );
}
