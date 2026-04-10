import React from 'react';
import Navbar from '@/components/Navbar/Navbar';

export default function MoviesPage() {
    return (
        <div style={{ paddingTop: '80px', paddingLeft: '4%', paddingRight: '4%', color: 'white' }}>
            <h1>Movies</h1>
            <p>Explore our vast collection of movies.</p>
            {/* TODO: Add Movie Grid Component here */}
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                <p style={{ color: '#999' }}>Loading movies...</p>
            </div>
        </div>
    );
}
