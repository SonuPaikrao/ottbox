'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Top10Row.module.css';
import { Movie } from '@/lib/api';

export default function Top10Row({ movies }: { movies: Movie[] }) {
    return (
        <section className={styles.container}>
            <h2 className={styles.title}>
                TOP 10 <span className={styles.subtitle}>CONTENT TODAY</span>
            </h2>

            <div className={styles.slider}>
                {movies.slice(0, 10).map((movie, index) => (
                    <Link href={`/title/${movie.id}`} key={movie.id} className={styles.card}>
                        <span className={styles.number}>{index + 1}</span>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.jpg'}
                                alt={movie.title || movie.name || 'Content Poster'}
                                width={160}
                                height={240}
                                className={styles.image}
                                loading="lazy"
                                sizes="(max-width: 768px) 130px, 170px"
                                placeholder="blur"
                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjI0MCIgZmlsbD0iIzIyMiIvPjwvc3ZnPg=="
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
