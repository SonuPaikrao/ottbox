import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'OTT Box',
        short_name: 'OTT Box',
        description: 'Watch the latest movies and series in high quality. No ads, just entertainment.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#e50914',
        icons: [
            {
                src: '/icon',
                sizes: 'any',
                type: 'image/png',
            },
            {
                src: '/apple-icon',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    };
}
