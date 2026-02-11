import { searchMovies, discoverAdvanced } from "@/lib/api";
import MovieCard from "@/components/Shared/MovieCard";
import styles from "../page.module.css";
import Link from "next/link";
import SearchInput from "@/components/Shared/SearchInput";
import SearchFilterBar from "@/components/Search/SearchFilterBar";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const params = await searchParams;
    const q = typeof params.q === 'string' ? params.q : '';

    // Determine if we are filtering or just searching
    // If 'genre', 'year', 'sort', 'type' are present, we use discovery.
    // If only 'q' is present, we uses search.
    // If both? We could prioritize discovery and ignore Q, or just show Q results.
    // Let's go with: If filters exist, use discover. Else use search.

    const hasFilters = params.genre || params.year || params.sort || params.type || params.rating || params.lang;

    let results: any[] = [];
    let title = '';

    if (hasFilters) {
        results = await discoverAdvanced({
            type: (params.type as 'movie' | 'tv') || 'movie',
            genreId: params.genre as string,
            year: params.year as string,
            sortBy: params.sort as string,
            voteAverage: params.rating ? parseFloat(params.rating as string) : 0,
            language: params.lang as string,
        });
        title = 'Filtered Results';
    } else if (q) {
        results = await searchMovies(q);
        title = `Results for "${q}"`;
    }

    return (
        <div className={styles.main}>
            <div className="container" style={{ paddingTop: '100px' }}>
                <div style={{ marginBottom: '30px' }}>
                    <SearchInput initialQuery={q} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '10px', color: '#888' }}>Advanced Filters</h3>
                    <SearchFilterBar />
                </div>

                {title && (
                    <h2 className={styles.sectionTitle}>
                        {title}
                    </h2>
                )}

                {results.length > 0 ? (
                    <div className={styles.grid}>
                        {results.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)' }}>
                        <p>{(q || hasFilters) ? 'No results found.' : 'Search for a movie or use filters to browse.'}</p>
                        <Link href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
                            Back Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
