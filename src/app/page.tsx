import { fetchTrending, fetchTopRated, fetchTrendingSeries, fetchTrendingDay, discoverMoviesByGenre, fetchMovieDetails, Movie } from "@/lib/api";
import dynamic from 'next/dynamic';
import HeroSection from "@/components/Home/HeroSection";
// import Row from '@/components/Home/Row'; // Keeping Row if needed later, or remove. User said remove mood feature.
import Top10Row from "@/components/Home/Top10Row";
import MovieCard from "@/components/Shared/MovieCard";
import GenrePills from "@/components/Home/GenrePills";
import InfiniteMovieGrid from "@/components/Shared/InfiniteMovieGrid";
import ContinueWatchingRow from "@/components/Shared/ContinueWatchingRow";
import styles from "./page.module.css";
import { createClient } from '@supabase/supabase-js';

// Lazy load infinite scroll rows (below the fold content)
const HomeInfiniteRows = dynamic(() => import('@/components/Home/HomeInfiniteRows'), {
  loading: () => <div style={{ padding: '50px', textAlign: 'center', color: '#666' }}>Loading more content...</div>
});


const genres = [
  { id: '28', name: 'Action' },
  { id: '35', name: 'Comedy' },
  { id: '18', name: 'Drama' },
  { id: '27', name: 'Horror' },
  { id: '878', name: 'Sci-Fi' },
  { id: '10749', name: 'Romance' },
  { id: '53', name: 'Thriller' },
  { id: '16', name: 'Animation' },
  // TV Genres
  { id: '10759', name: 'Action & Adventure' },
  { id: '80', name: 'Crime' },
  { id: '9648', name: 'Mystery' },
  { id: '10765', name: 'Sci-Fi & Fantasy' },
  { id: '10768', name: 'War & Politics' },
];

export default async function Home(props: { searchParams: Promise<{ genre?: string, type?: 'movie' | 'tv' }> }) {
  const searchParams = await props.searchParams;
  const { genre, type } = await searchParams;

  // Determine effective type and genre
  // If type is explicitly set, use it. If not, check if genre is 'series' (legacy)
  const effectiveType = type || (genre === 'series' ? 'tv' : 'movie');

  // If genre is 'movies' or 'series', it's just a type switch, so cleared genreId. Otherwise it's a real ID.
  const effectiveGenre = (genre === 'movies' || genre === 'series') ? undefined : genre;

  const trending = await fetchTrending();
  const topRated = await fetchTopRated();
  const series = await fetchTrendingSeries();
  const top10Today = await fetchTrendingDay();

  // Custom Featured Content Fetch
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: featuredData } = await supabase
    .from('featured_content')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  // Map DB content match Movie interface
  const customFeatured: Movie[] = (featuredData || []).map(item => ({
    id: item.movie_id,
    title: item.title,
    poster_path: '', // Not strictly needed for Hero, utilizes fetchDetails internally or we need to ensure we have backdrop
    backdrop_path: item.backdrop_path,
    overview: '', // Hero fetches details or we need to store it. 
    // ACTUALLY: HeroSection expects full movie objects. 
    // Optimization: We should probably store overview in DB or fetch details here.
    // Let's stick to stored fields + defaults for speed, or fetch details.
    vote_average: 0,
    release_date: '',
    media_type: item.media_type as 'movie' | 'tv'
  }));

  // If we have custom content, Mix it or Use it. 
  // Let's PREPEND it to trending.
  let featuredMovies = trending.slice(0, 5);

  if (customFeatured.length > 0) {
    // We need to fetch full details to have overview/images for the Hero
    const fullDetailsPromises = customFeatured.map(m => fetchMovieDetails(m.id.toString(), m.media_type));
    const fullCustom = (await Promise.all(fullDetailsPromises)).filter(m => m !== null) as Movie[];

    if (fullCustom.length > 0) {
      featuredMovies = fullCustom;
    }
  }

  // Get genre name for title
  const currentGenreName = genre && genres.find(g => g.id === genre)?.name;
  const title = currentGenreName
    ? `${currentGenreName} ${effectiveType === 'tv' ? 'Series' : 'Movies'}`
    : effectiveType === 'tv' ? 'All Series' : 'All Movies';

  return (
    <div className={styles.main}>
      {/* Show Hero only if no specific genre filter is active */}
      {(!genre && !type) && <HeroSection movies={featuredMovies} />}

      {/* Top10 and Continue Watching - Only on Home (Unfiltered) */}
      {!genre && !type && (
        <section className="container" style={{ marginTop: '20px', position: 'relative', zIndex: 20 }}>
          <Top10Row movies={top10Today} />
          <ContinueWatchingRow />
        </section>
      )}

      {/* Sticky Pills Section */}
      <div className={styles.stickyHeader}>
        <div className="container">
          <GenrePills />
        </div>
      </div>

      {(genre || type) ? (
        <section className="container" style={{ marginTop: '20px' }}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <InfiniteMovieGrid
            initialMovies={await discoverMoviesByGenre(effectiveGenre, 1, effectiveType)}
            genreId={effectiveGenre || ''}
            type={effectiveType}
          />
        </section>
      ) : (
        <>
          {/* Trending and Series Rows for Switcher Default View */}
          <section className="container" style={{ marginTop: '20px' }}>
            <h2 className={styles.sectionTitle}>Trending Now</h2>
            <div className={styles.grid}>
              {trending.slice(0, 12).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>

          <section className="container" style={{ marginTop: '50px' }}>
            <h2 className={styles.sectionTitle}>Series on Netflix</h2>
            <div className={styles.grid}>
              {series.slice(0, 10).map((show) => (
                <MovieCard key={show.id} movie={show} />
              ))}
            </div>
          </section>

          <section className="container" style={{ marginTop: '50px' }}>
            <h2 className={styles.sectionTitle}>Top Rated</h2>
            <div className={styles.grid}>
              {topRated.slice(0, 12).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>

          <HomeInfiniteRows />
        </>
      )}
    </div>
  );
}
