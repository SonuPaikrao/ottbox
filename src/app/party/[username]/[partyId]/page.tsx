'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CinemaPlayer from '@/components/Party/CinemaPlayer';
import CinemaChat from '@/components/Party/CinemaChat';
import { useAuth } from '@/context/AuthContext';
import styles from '@/components/Navbar/Navbar.module.css'; // Hack to hide navbar even more strictly?

export default function CinematicPartyPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    // URL Params
    const creatorUsername = params.username as string;
    const partyId = params.partyId as string;
    const movieId = searchParams.get('movieId');

    // Auth
    const { user } = useAuth();
    const [myUsername, setMyUsername] = useState('Guest');

    useEffect(() => {
        if (user) {
            const name = user.user_metadata?.full_name || user.email?.split('@')[0];
            if (name) setMyUsername(name);
        }
    }, [user]);

    if (!movieId) return <div className="bg-black text-white h-screen flex items-center justify-center">Invalid Config</div>;

    return (
        <div className="flex h-[100dvh] w-screen bg-black overflow-hidden relative">

            {/* FORCE HIDE NAVBAR VIA STYLE INJECTION */}
            <style jsx global>{`
                nav { display: none !important; }
                footer { display: none !important; }
            `}</style>

            {/* Main Stage (Video) - 75% */}
            <main className="flex-[0.75] relative z-10">
                <CinemaPlayer
                    movieId={movieId}
                    partyId={partyId}
                    isHost={myUsername === creatorUsername} // Logic for host control future proofing
                />
            </main>

            {/* Sidebar (Chat) - 25% */}
            <aside className="flex-[0.25] h-full relative z-20">
                <CinemaChat
                    partyId={partyId}
                    username={myUsername}
                    hostName={creatorUsername}
                />
            </aside>

        </div>
    );
}
