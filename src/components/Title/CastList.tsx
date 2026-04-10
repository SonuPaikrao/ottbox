import Image from 'next/image';
import { CastMember } from '@/lib/api';
import styles from './CastList.module.css';

export default function CastList({ cast }: { cast: CastMember[] }) {
    if (!cast || cast.length === 0) return null;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Cast</h3>
            <div className={styles.scrollContainer}>
                {cast.map((actor) => (
                    <div key={actor.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            {actor.profile_path ? (
                                <Image
                                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                    alt={actor.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="120px"
                                    loading="lazy"
                                    placeholder="blur"
                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iIzMzMyIvPjwvc3ZnPg=="
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '2rem', background: '#222' }}>
                                    {actor.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className={styles.name}>{actor.name}</div>
                        <div className={styles.character}>{actor.character}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
