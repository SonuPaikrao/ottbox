import ShortsFeed from '@/components/Shorts/ShortsFeed';

export const metadata = {
    title: 'Shorts | OttBox',
    description: 'Watch trending movie trailers and clips.',
};

export default function ShortsPage() {
    return (
        <div style={{ background: '#000', minHeight: '100vh', overflow: 'hidden' }}>
            <ShortsFeed />
        </div>
    );
}
