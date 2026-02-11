import SkeletonCard from './SkeletonCard';
import styles from './Skeleton.module.css';

interface GridSkeletonProps {
    count?: number;
}

export default function GridSkeleton({ count = 10 }: GridSkeletonProps) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '20px',
            padding: '20px 0'
        }}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}
