'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

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
            <div style={{
                background: 'rgba(229, 9, 20, 0.1)',
                padding: '20px',
                borderRadius: '50%',
                marginBottom: '20px',
                border: '1px solid rgba(229, 9, 20, 0.2)'
            }}>
                <AlertCircle size={48} color="var(--primary)" />
            </div>

            <h2 style={{
                fontSize: '2rem',
                margin: '10px 0',
                color: 'var(--foreground)'
            }}>Something went wrong!</h2>

            <p style={{
                color: 'var(--text-muted)',
                maxWidth: '400px',
                marginBottom: '30px'
            }}>
                We apologize for the inconvenience. Our team has been notified.
            </p>

            <button
                onClick={reset}
                className="btn btn-primary"
                style={{ gap: '10px' }}
            >
                <RefreshCcw size={18} />
                Try Again
            </button>
        </div>
    );
}
