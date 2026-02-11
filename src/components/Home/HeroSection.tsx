'use client';

import { useState, useEffect } from 'react';
import { Movie, fetchMovieVideos } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import styles from './HeroSection.module.css';

export default function HeroSection({ movies }: { movies: Movie[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [showVideo, setShowVideo] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false); // Track iframe load

    const movie = movies[currentIndex];

    useEffect(() => {
        const interval = setInterval(() => {
            if (!showVideo) { // Only slide if video isn't playing
                setCurrentIndex((prev) => (prev + 1) % movies.length);
            }
        }, 8000); // Slower slide for video time
        return () => clearInterval(interval);
    }, [movies.length, showVideo]);

    // Fetch trailer when slide changes
    useEffect(() => {
        setShowVideo(false); // Reset video state
        setTrailerKey(null);
        setIsVideoLoaded(false); // Reset load state

        const loadTrailer = async () => {
            const key = await fetchMovieVideos(movie.id);
            if (key) {
                setTrailerKey(key);
                // Delay video start to let image show first
                setTimeout(() => setShowVideo(true), 2000);
            }
        };
        loadTrailer();
    }, [movie.id]);

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
            <div className={styles.hero}>
                {/* Background Image (Always there as fallback/underlay) */}
                <div className={`${styles.backdrop} ${(showVideo && isVideoLoaded) ? styles.hidden : ''}`}>
                    <Image
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                        alt={movie.title}
                        fill
                        className={styles.image}
                        priority
                        sizes="100vw"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9IiMxMTEiLz48L3N2Zz4="
                    />
                    <div className={styles.overlay}></div>
                </div>

                {/* Video Background */}
                {showVideo && trailerKey && (
                    <div className={styles.videoWrapper}>
                        {/* NUCLEAR OPTION: Blocking overlay until video ready */}
                        {!isVideoLoaded && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'transparent',
                                zIndex: 9999, // Block EVERYTHING
                                pointerEvents: 'none'
                            }}></div>
                        )}
                        <iframe
                            className={styles.iframe}
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailerKey}&mute=${isMuted ? '1' : '0'}`}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            onLoad={() => {
                                // Delay to ensure video actually starts playing
                                setTimeout(() => setIsVideoLoaded(true), 1500);
                            }}
                            style={{
                                opacity: isVideoLoaded ? 1 : 0,
                                transition: 'opacity 1.2s ease'
                            }}
                        ></iframe>
                        <div className={styles.videoOverlay}></div>
                    </div>
                )}

                <div className={styles.content}>
                    {/* Premium Metadata Badges */}
                    <div className={styles.metadata}>
                        <span className={styles.matchBadge}>97% Match</span>
                        <span className={styles.year}>{new Date(movie.release_date || movie.first_air_date || '2024').getFullYear()}</span>
                        <span className={styles.maturity}>U/A 16+</span>
                        {movie.runtime && <span className={styles.duration}>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>}
                    </div>

                    <h1 className={styles.title}>{movie.title}</h1>

                    {/* Genre Pills */}
                    <div className={styles.genrePills}>
                        {movie.genres?.slice(0, 3).map((genre: any) => (
                            <span key={genre.id} className={styles.genrePill}>{genre.name}</span>
                        ))}
                    </div>

                    <p className={styles.overview}>{movie.overview}</p>
                    <div className={styles.actions}>
                        <Link href={`/watch/${movie.id}`} className="btn btn-primary">
                            <Play fill="black" size={24} style={{ marginRight: '10px' }} />
                            Play Now
                        </Link>
                        <Link href={`/title/${movie.id}`} className="btn btn-secondary" style={{ background: 'rgba(109, 109, 110, 0.7)', color: 'white' }}>
                            <Info size={24} style={{ marginRight: '10px' }} />
                            More Info
                        </Link>
                        {showVideo && (
                            <button onClick={() => setIsMuted(!isMuted)} className={styles.muteBtn}>
                                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Dots */}
                <div className={styles.dots}>
                    {movies.map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ''}`}
                            onClick={() => setCurrentIndex(i)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
