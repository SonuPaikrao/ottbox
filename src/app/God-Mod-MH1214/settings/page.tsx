'use client';

export default function SettingsPage() {
    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    margin: 0,
                    background: 'linear-gradient(135deg, #e50914, #ff6b6b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px'
                }}>
                    Settings
                </h1>
                <p style={{ color: '#888', margin: 0 }}>System configuration and preferences</p>
            </div>

            <div style={{
                background: 'rgba(20, 20, 20, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '48px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>⚙️</div>
                <h2 style={{ color: '#fff', marginBottom: '8px' }}>Coming Soon</h2>
                <p style={{ color: '#888' }}>Settings panel is under development</p>
            </div>
        </div>
    );
}
