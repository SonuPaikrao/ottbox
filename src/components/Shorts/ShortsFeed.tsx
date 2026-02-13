'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchTrending, fetchMovieVideos, Movie } from '@/lib/api';
import { PlayCircle, Info, Share2, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import BackButton from '@/components/Shared/BackButton';

export default function ShortsFeed() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [videoKeys, setVideoKeys] = useState<{ [key: number]: string | null }>({});
    const [muted, setMuted] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const pressTimer = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadTrending = async () => {
            const data = await fetchTrending();
            // Shuffle for randomness or keep order? Let's shuffle slightly or just take top 20
            setMovies(data.slice(0, 15));
        };
        loadTrending();
    }, []);

    // Intersection Observer to detect active slide
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        setActiveIndex(index);
                        setIsPlaying(true); // Auto-play when scrolling to new slide

                        // Fetch video key if not already loaded
                        const movieId = Number(entry.target.getAttribute('data-id'));
                        if (!videoKeys[movieId]) {
                            fetchMovieVideos(movieId).then((key) => {
                                setVideoKeys((prev) => ({ ...prev, [movieId]: key }));
                            });
                        }
                    }
                });
            },
            { threshold: 0.6 } // 60% visibility triggers active
        );

        const slides = document.querySelectorAll('.short-slide');
        slides.forEach((slide) => observer.observe(slide));

        return () => observer.disconnect();
    }, [movies, videoKeys]);

    const handleShare = (movie: Movie) => {
        if (navigator.share) {
            navigator.share({
                title: movie.title || movie.name,
                text: `Check out ${movie.title || movie.name} on OttBox!`,
                url: window.location.origin + `/watch/${movie.id}?type=${movie.media_type || 'movie'}`,
            }).catch(console.error);
        } else {
            alert('Link copied to clipboard!');
            navigator.clipboard.writeText(window.location.origin + `/watch/${movie.id}?type=${movie.media_type || 'movie'}`);
        }
    };

    // Long Press Handlers
    const handleTouchStart = () => {
        pressTimer.current = setTimeout(() => {
            setIsPlaying(false); // Pause on long hold
        }, 200); // 200ms threshold
    };

    const handleTouchEnd = () => {
        if (pressTimer.current) clearTimeout(pressTimer.current);
        setIsPlaying(true); // Resume on release
    };

    return (
        <div className="shorts-container" ref={containerRef}>
            {/* Desktop Back Button Overlay - Managed locally, ensuring no Navbar overlap */}
            <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100 }}>
                <BackButton />
            </div>

            {movies.map((movie, index) => {
                const isActive = index === activeIndex;
                const videoKey = videoKeys[movie.id];
                const shouldPlay = isActive && isPlaying;

                return (
                    <div
                        key={movie.id}
                        className="short-slide"
                        data-index={index}
                        data-id={movie.id}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleTouchStart} // For Desktop testing
                        onMouseUp={handleTouchEnd}
                    >
                        {/* Video Background */}
                        <div className="video-wrapper">
                            {isActive && videoKey ? (
                                <div className="video-inner" style={{ pointerEvents: 'none' }}> {/* Block iframe interaction to allow touch events on parent */}
                                    <iframe
                                        src={`https://www.youtube.com/embed/${videoKey}?autoplay=${shouldPlay ? 1 : 0}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&loop=1&playlist=${videoKey}&mute=${muted ? 1 : 0}&start=5&enablejsapi=1`}
                                        allow="autoplay; encrypted-media"
                                        title={movie.title}
                                        className="video-iframe"
                                        style={{ pointerEvents: 'none' }} // Crucial for touch events to bubble to container
                                    />
                                </div>
                            ) : (
                                <div
                                    className="poster-bg"
                                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})` }}
                                />
                            )}

                            {/* Dark Overlay Gradient */}
                            <div className="gradient-overlay" />
                        </div>

                        {/* Content Overlay */}
                        <div className="content-overlay">
                            <div className="info-section">
                                <h2 className="movie-title">{movie.title || movie.name}</h2>
                                <p className="movie-overview line-clamp-2">{movie.overview}</p>

                                <div className="buttons-row">
                                    <button
                                        onClick={() => router.push(`/watch/${movie.id}?type=${movie.media_type || 'movie'}`)}
                                        className="action-btn primary"
                                    >
                                        <PlayCircle size={20} fill="currentColor" />
                                        Watch Now
                                    </button>

                                    <button
                                        onClick={() => router.push(`/watch/${movie.id}?type=${movie.media_type || 'movie'}`)} // Reuse watch for details for now, or make a separate details modal
                                        className="action-btn secondary"
                                    >
                                        <Info size={20} />
                                        Details
                                    </button>
                                </div>
                            </div>

                            <div className="side-actions">
                                <button className="icon-btn" onClick={() => setMuted(!muted)}>
                                    {muted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                                    <span>{muted ? 'Unmute' : 'Mute'}</span>
                                </button>

                                <button className="icon-btn" onClick={() => handleShare(movie)}>
                                    <Share2 size={28} />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            <style jsx>{`
                .shorts-container {
                    height: 100vh;
                    width: 100%;
                    overflow-y: scroll;
                    scroll-snap-type: y mandatory;
                    background: #000;
                    position: relative;
                }

                /* Hide scrollbar */
                .shorts-container::-webkit-scrollbar {
                    display: none;
                }

                .short-slide {
                    height: 100vh;
                    width: 100%;
                    scroll-snap-align: start;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .video-wrapper {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                }

                .video-iframe {
                    width: 100%;
                    height: 100%;
                    transform: scale(1.35); /* Zoom to fill/crop slightly like TikTok */
                    pointer-events: none; /* Prevent interaction with YT controls */
                    border: none;
                }

                .poster-bg {
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    filter: brightness(0.7);
                }

                .gradient-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%);
                    pointer-events: none;
                }

                .content-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 20px 20px 80px 20px; /* Extra bottom padding for mobile nav */
                    z-index: 10;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                }

                .info-section {
                    flex: 1;
                    padding-right: 20px;
                    max-width: 80%;
                }

                .movie-title {
                    font-size: 1.8rem;
                    font-weight: 800;
                    margin-bottom: 10px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }

                .movie-overview {
                    font-size: 0.95rem;
                    color: #ddd;
                    margin-bottom: 20px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
                }

                .buttons-row {
                    display: flex;
                    gap: 12px;
                }

                .action-btn {
                    padding: 10px 20px;
                    border-radius: 8px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: transform 0.2s;
                }

                .action-btn:active {
                    transform: scale(0.95);
                }

                .primary {
                    background: #e50914;
                    color: white;
                }

                .secondary {
                    background: rgba(255,255,255,0.2);
                    backdrop-filter: blur(10px);
                    color: white;
                }

                .side-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    align-items: center;
                    padding-bottom: 20px;
                }

                .icon-btn {
                    background: none;
                    border: none;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    cursor: pointer;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }

                .icon-btn span {
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                /* Desktop Adjustments */
                @media (min-width: 768px) {
                    .shorts-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        background: #0a0a0a;
                    }

                    .short-slide {
                        width: 450px; /* Mobile width on Desktop */
                        border-left: 1px solid #333;
                        border-right: 1px solid #333;
                        box-shadow: 0 0 50px rgba(0,0,0,0.5);
                    }

                    .content-overlay {
                        padding-bottom: 40px; /* Less padding on desktop */
                    }
                }
            `}</style>
        </div>
    );
}
