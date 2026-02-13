'use client';

import { Movie } from "@/lib/api";
import MovieCard from "@/components/Shared/MovieCard";
import styles from "@/app/page.module.css";

interface RowProps {
    title: string;
    movies: Movie[];
}

export default function Row({ title, movies }: RowProps) {
    if (!movies || movies.length === 0) return null;

    return (
        <section className="container" style={{ marginTop: '40px', position: 'relative', zIndex: 20 }}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <div className={styles.grid}>
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </section>
    );
}
