import styles from '../Shared/Skeleton.module.css';

export default function TitleDetailSkeleton() {
    return (
        <div className={styles.hero}>
            <div className={styles.heroContent}>
                <div className={styles.heroTitle}></div>
                <div className={styles.heroMeta}></div>
                <div className={styles.heroDesc}></div>
                <div className={styles.heroButtons}>
                    <div className={styles.heroBtn}></div>
                    <div className={styles.heroBtn}></div>
                </div>
            </div>
        </div>
    );
}
