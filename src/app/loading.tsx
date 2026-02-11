import HeroSkeleton from '@/components/Shared/HeroSkeleton';
import Top10Skeleton from '@/components/Shared/Top10Skeleton';
import { SectionTitleSkeleton, RowSkeleton, ContinueWatchingSkeleton } from '@/components/Shared/skeletons';

export default function Loading() {
    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
            {/* Hero Skeleton - Visible immediately */}
            <HeroSkeleton />

            {/* Top 10 Section with overlap effect */}
            <section className="container" style={{ marginTop: '-80px', position: 'relative', zIndex: 20 }}>
                <SectionTitleSkeleton />
                <Top10Skeleton />
            </section>

            {/* Continue Watching Section */}
            <ContinueWatchingSkeleton />

            {/* Trending Row */}
            <RowSkeleton />

            {/* Top Rated Row */}
            <RowSkeleton />
        </div>
    );
}
