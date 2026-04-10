import SkeletonCard from '../Shared/SkeletonCard';
import styles from '../../app/page.module.css';

export default function SearchSkeleton() {
    return (
        <div style={{ marginTop: '20px' }}>
            <div className={styles.grid}>
                {Array.from({ length: 15 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </div>
    );
}
