'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BackButton() {
    const router = useRouter();
    const pathname = usePathname();
    const [canGoBack, setCanGoBack] = useState(false);

    useEffect(() => {
        // Only show back button if not on home page
        if (pathname !== '/') {
            setCanGoBack(true);
        } else {
            setCanGoBack(false);
        }
    }, [pathname]);

    if (!canGoBack) return null;

    return (
        <button
            onClick={() => router.back()}
            style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                marginRight: '15px',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(5px)'
            }}
            aria-label="Go Back"
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = 'black';
                e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            <ChevronLeft size={24} />
        </button>
    );
}
