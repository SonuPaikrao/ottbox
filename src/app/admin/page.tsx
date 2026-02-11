'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { fetchMovieDetails, Movie } from '@/lib/api';
import Image from 'next/image';
import { Trash2, Plus, Search } from 'lucide-react';

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [featured, setFeatured] = useState<any[]>([]);

    // Add New State
    const [tmdbId, setTmdbId] = useState('');
    const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
    const [searchError, setSearchError] = useState('');

    useEffect(() => {
        if (loading) return; // Wait for auth to initialize
        if (!user) {
            router.push('/');
            return;
        }
        fetchFeatured();
        setIsLoading(false);
    }, [user, loading, router]);

    const fetchFeatured = async () => {
        const { data } = await supabase.from('featured_content').select('*').order('created_at', { ascending: false });
        if (data) setFeatured(data);
    };

    const handlePreview = async () => {
        setSearchError('');
        setPreviewMovie(null);
        if (!tmdbId) return;

        const movie = await fetchMovieDetails(tmdbId, 'movie'); // Default to movie check
        if (movie) {
            setPreviewMovie(movie);
        } else {
            // Try TV
            const tv = await fetchMovieDetails(tmdbId, 'tv');
            if (tv) setPreviewMovie(tv);
            else setSearchError('Content not found (check ID or Type)');
        }
    };

    const addToFeatured = async () => {
        if (!previewMovie || !user) return;

        const { error } = await supabase.from('featured_content').insert({
            movie_id: previewMovie.id,
            media_type: previewMovie.media_type || 'movie',
            title: previewMovie.title || previewMovie.name,
            backdrop_path: previewMovie.backdrop_path,
            active: true
        });

        if (!error) {
            setPreviewMovie(null);
            setTmdbId('');
            fetchFeatured();
        } else {
            alert('Error adding content');
        }
    };

    const removeFeatured = async (id: number) => {
        if (!confirm('Remove this movie from Home Page?')) return;
        await supabase.from('featured_content').delete().eq('id', id);
        fetchFeatured();
    };

    if (isLoading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Admin...</div>;

    return (
        <div style={{ padding: '100px 20px', maxWidth: '1000px', margin: '0 auto', color: '#fff' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                Admin Dashboard
            </h1>

            {/* Add New Section */}
            <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Plus size={20} color="#e50914" /> Add Featured Content
                </h3>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Enter TMDB ID (e.g. 550)"
                        value={tmdbId}
                        onChange={(e) => setTmdbId(e.target.value)}
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: 'white', flex: 1 }}
                    />
                    <button onClick={handlePreview} style={{ padding: '12px 24px', background: '#333', color: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Search size={16} /> Preview
                    </button>
                </div>

                {searchError && <p style={{ color: '#e50914' }}>{searchError}</p>}

                {previewMovie && (
                    <div style={{ display: 'flex', gap: '20px', padding: '20px', background: '#222', borderRadius: '8px', alignItems: 'center' }}>
                        <Image
                            src={`https://image.tmdb.org/t/p/w200${previewMovie.poster_path}`}
                            alt="preview"
                            width={100}
                            height={150}
                            style={{ borderRadius: '4px' }}
                        />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>{previewMovie.title || previewMovie.name}</h3>
                            <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '15px' }}>
                                {previewMovie.overview?.slice(0, 100)}...
                            </p>
                            <button onClick={addToFeatured} style={{ padding: '10px 20px', background: '#e50914', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                                Confirm & Add to Hero
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Existing List */}
            <h3 style={{ marginBottom: '20px' }}>Current Featured Lineup</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
                {featured.length === 0 && <p style={{ color: '#666' }}>No featured content yet. The site is using default trending movies.</p>}

                {featured.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                {item.movie_id}
                            </div>
                            <span style={{ fontSize: '1.1rem' }}>{item.title}</span>
                            <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: '#333', borderRadius: '4px', textTransform: 'uppercase' }}>{item.media_type}</span>
                        </div>
                        <button onClick={() => removeFeatured(item.id)} style={{ padding: '8px', color: '#666', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}>
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
