import React from 'react';
import Navbar from '@/components/Navbar/Navbar';

export default function SeriesPage() {
    return (
        <div style={{ paddingTop: '80px', paddingLeft: '4%', paddingRight: '4%', color: 'white' }}>
            <h1>Series</h1>
            <p>Binge-watch your favorite TV shows.</p>
            {/* TODO: Add Series Grid Component here */}
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                <p style={{ color: '#999' }}>Loading series...</p>
            </div>
        </div>
    );
}
