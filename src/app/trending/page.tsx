import React from 'react';
import Navbar from '@/components/Navbar/Navbar';

export default function TrendingPage() {
    return (
        <div style={{ paddingTop: '80px', paddingLeft: '4%', paddingRight: '4%', color: 'white' }}>
            <h1>Trending Now</h1>
            <p>See what everyone is watching.</p>
            {/* TODO: Add Trending Grid Component here */}
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                <p style={{ color: '#999' }}>Loading trending content...</p>
            </div>
        </div>
    );
}
