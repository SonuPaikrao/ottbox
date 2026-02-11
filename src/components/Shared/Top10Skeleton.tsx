import styles from './Skeleton.module.css';

export default function Top10Skeleton() {
    return (
        <div style={{
            display: 'flex',
            gap: '40px',
            overflowX: 'hidden',
            padding: '20px 0 40px 20px'
        }}>
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
                    {/* Number skeleton */}
                    <div style={{
                        position: 'absolute',
                        left: '-20px',
                        bottom: '-10px',
                        width: '80px',
                        height: '120px',
                        fontSize: '8rem',
                        fontWeight: 900,
                        color: '#222',
                        zIndex: 0
                    }}>
                        {i + 1}
                    </div>
                    {/* Poster skeleton */}
                    <div className={styles.image} style={{
                        width: '170px',
                        height: '255px',
                        position: 'relative',
                        zIndex: 1
                    }}></div>
                </div>
            ))}
        </div>
    );
}
