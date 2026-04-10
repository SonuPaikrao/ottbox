import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="container" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            paddingTop: '60px'
        }}>
            <h1 style={{
                fontSize: '8rem',
                fontWeight: '900',
                color: 'var(--primary)',
                textShadow: '0 0 30px rgba(229, 9, 20, 0.5)',
                lineHeight: 1
            }}>404</h1>

            <h2 style={{
                fontSize: '2rem',
                margin: '20px 0',
                color: 'var(--foreground)'
            }}>Page Not Found</h2>

            <p style={{
                color: 'var(--text-muted)',
                maxWidth: '400px',
                marginBottom: '40px',
                fontSize: '1.1rem'
            }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <Link href="/" className="btn btn-primary" style={{ gap: '10px' }}>
                <Home size={20} />
                Back to Home
            </Link>
        </div>
    );
}
