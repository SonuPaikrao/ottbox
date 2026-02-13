'use client';

import { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { discoverMoviesByGenre, Movie } from '@/lib/api';
import MovieCard from '@/components/Shared/MovieCard';
import { Camera, X, Loader, Smile, Frown, AlertCircle } from 'lucide-react';

export default function MoodSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [mood, setMood] = useState<string | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [error, setError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Load models on mount
    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = '/models';
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                ]);
                console.log('FaceAPI Models Loaded');
            } catch (err) {
                console.error('Failed to load models:', err);
                setError('Failed to load AI models. Please refresh.');
            }
        };
        loadModels();
    }, []);

    const startCamera = async () => {
        setIsOpen(true);
        setLoading(true);
        setError(null);
        setMood(null);
        setMovies([]);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setError('Camera access denied. Please allow camera permission.');
            setLoading(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const closeScanner = () => {
        stopCamera();
        setIsOpen(false);
        setScanning(false);
    };

    const handleVideoPlay = () => {
        setLoading(false);
        setScanning(true);
        detectMood();
    };

    const detectMood = async () => {
        if (!videoRef.current) return;

        // Scan repeatedly until a mood is found with high confidence
        const interval = setInterval(async () => {
            if (!videoRef.current || !scanning) {
                clearInterval(interval);
                return;
            }

            const detections = await faceapi.detectSingleFace(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions()
            ).withFaceExpressions();

            if (detections) {
                const expressions = detections.expressions;
                const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);

                // Get top emotion
                const topEmotion = sorted[0]; // [emotion, score]

                if (topEmotion[1] > 0.5) { // 50% confidence
                    clearInterval(interval);
                    stopCamera();
                    const detectedMood = topEmotion[0];
                    setMood(detectedMood);
                    fetchMoviesForMood(detectedMood);
                }
            }
        }, 500);

        // Timeout after 10 seconds
        setTimeout(() => {
            clearInterval(interval);
            if (scanning && !mood) {
                stopCamera();
                setError("Could not detect mood. Try better lighting.");
            }
        }, 10000);
    };

    const fetchMoviesForMood = async (emotion: string) => {
        setLoading(true);
        let genreId = '';
        let moodText = '';

        switch (emotion) {
            case 'happy':
                genreId = '35'; // Comedy
                moodText = 'Happy! 😄 Here are some comedies for you.';
                break;
            case 'sad':
                genreId = '18'; // Drama
                moodText = 'Sad 😢. Let it out with these dramas.';
                break;
            case 'angry':
                genreId = '28'; // Action
                moodText = 'Angry? 😠 Blow off steam with action movies!';
                break;
            case 'surprised':
                genreId = '9648'; // Mystery
                moodText = 'Surprised! 😲 Keep the suspense going.';
                break;
            case 'fearful':
                genreId = '27'; // Horror
                moodText = 'Spooked? 😱 Face your fears with horror.';
                break;
            default: // neutral, disgusted
                genreId = 'movies'; // Trending
                moodText = 'Chill 😎. Check out what\'s trending.';
                break;
        }

        setMood(moodText);
        const results = await discoverMoviesByGenre(genreId);
        setMovies(results);
        setLoading(false);
        setScanning(false);
    };

    return (
        <section className="container" style={{ marginBottom: '40px', position: 'relative' }}>
            {/* Header / Trigger */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                    Mood Picks <span style={{ color: '#e50914', fontSize: '0.8em', verticalAlign: 'middle', background: '#333', padding: '2px 8px', borderRadius: '4px', marginLeft: '10px' }}>Beta</span>
                </h2>

                {!isOpen && !movies.length && (
                    <button
                        onClick={startCamera}
                        className="btn btn-primary"
                        style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    >
                        <Camera size={18} />
                        Scan My Mood
                    </button>
                )}
            </div>

            {/* Webcam Modal */}
            {isOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 3000,
                    background: 'rgba(0,0,0,0.9)', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ position: 'relative', width: '90%', maxWidth: '500px', background: '#141414', borderRadius: '12px', padding: '20px', textAlign: 'center', border: '1px solid #333' }}>
                        <button
                            onClick={closeScanner}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <h3 style={{ marginBottom: '20px' }}>Scanning your mood...</h3>

                        <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '4/3', background: '#000', margin: '0 auto' }}>
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                onPlay={handleVideoPlay}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                            />

                            {/* Overlay Scanner Line */}
                            {scanning && (
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#e50914',
                                    boxShadow: '0 0 10px #e50914',
                                    animation: 'scan 2s infinite linear'
                                }} />
                            )}
                        </div>

                        <p style={{ marginTop: '15px', color: '#999', fontSize: '0.9rem' }}>
                            {loading ? 'Initializing camera...' : 'Keep your face visible and valid for detection.'}
                        </p>

                        {error && <p style={{ color: '#e50914', marginTop: '10px' }}>{error}</p>}
                    </div>
                </div>
            )}

            {/* Results Display */}
            {mood && !isOpen && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <div style={{
                        background: 'linear-gradient(90deg, #1f1f1f 0%, #141414 100%)',
                        padding: '20px', borderRadius: '8px', marginBottom: '20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderLeft: '4px solid #e50914'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Smile size={24} color="#e50914" />
                            </div>
                            <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{mood}</span>
                        </div>
                        <button
                            onClick={startCamera}
                            style={{ background: 'none', border: '1px solid #444', color: '#ccc', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Scan Again
                        </button>
                    </div>

                    {/* Movie List */}
                    {movies.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                            gap: '15px'
                        }}>
                            {movies.slice(0, 12).map(movie => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    ) : (
                        loading && <div style={{ textAlign: 'center', padding: '40px' }}><Loader className="animate-spin" /> Fetching recommendations...</div>
                    )}
                </div>
            )}

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}
