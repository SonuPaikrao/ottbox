import styles from './Skeleton.module.css';

export default function SkeletonCard() {
    return (
        <div className={styles.card}>
            <div className={styles.image}></div>
            <div className={styles.textLine} style={{ width: '80%', marginTop: '10px' }}></div>
            <div className={styles.textLine} style={{ width: '40%', marginTop: '5px' }}></div>
        </div>
    );
}
