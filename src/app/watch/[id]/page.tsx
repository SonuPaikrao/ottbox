import { fetchMovieDetails } from "@/lib/api";
import dynamic from 'next/dynamic';

// Lazy load the heavy WatchContainer component (includes VideoPlayer iframe)
const WatchContainer = dynamic(() => import('@/components/Title/WatchContainer'), {
    loading: () => <div className="container" style={{ paddingTop: '100px', textAlign: 'center', color: '#fff' }}>Loading player...</div>
});

export default async function WatchPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const movie = await fetchMovieDetails(id);

    if (!movie) {
        return <div className="container" style={{ paddingTop: '100px' }}>Movie not found</div>;
    }

    return <WatchContainer movie={movie} tmdbId={id} />;
}
