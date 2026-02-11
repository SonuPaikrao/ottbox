'use client';

import { Suspense } from 'react';
import HeroSkeleton from './HeroSkeleton';
import GridSkeleton from './GridSkeleton';
import Top10Skeleton from './Top10Skeleton';
import SkeletonCard from './SkeletonCard';

// Section Title Skeleton
export function SectionTitleSkeleton() {
    return (
        <div style={{
            width: '200px',
            height: '32px',
            background: '#1f1f1f',
            backgroundImage: 'linear-gradient(to right, #1f1f1f 0%, #2a2a2a 20%, #1f1f1f 40%, #1f1f1f 100%)',
            backgroundSize: '1000px 100%',
            animation: 'shimmer 2s infinite linear forwards',
            borderRadius: '6px',
            marginBottom: '20px'
        }}></div>
    );
}

// Row Skeleton (Title + Grid)
export function RowSkeleton() {
    return (
        <section className="container" style={{ marginTop: '50px' }}>
            <SectionTitleSkeleton />
            <GridSkeleton count={5} />
        </section>
    );
}

// Continue Watching Skeleton
export function ContinueWatchingSkeleton() {
    return (
        <section className="container" style={{ marginTop: '50px' }}>
            <SectionTitleSkeleton />
            <div style={{
                display: 'flex',
                gap: '20px',
                overflowX: 'hidden',
                padding: '20px 0'
            }}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{ flexShrink: 0, width: '200px' }}>
                        <SkeletonCard />
                    </div>
                ))}
            </div>
        </section>
    );
}

// Export all skeleton components
export {
    HeroSkeleton,
    GridSkeleton,
    Top10Skeleton,
    SkeletonCard
};
