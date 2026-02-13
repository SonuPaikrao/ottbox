'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import SyncPlayer from '@/components/Party/SyncPlayer';
import PartyChat from '@/components/Party/PartyChat';
import { useAuth } from '@/context/AuthContext'; // To get username if possible, else "Guest"

export default function PartyPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const roomId = params.roomId as string;
    const movieId = searchParams.get('movieId');

    const { user } = useAuth();
    const [username, setUsername] = useState('Guest');

    useEffect(() => {
        if (user?.email) {
            setUsername(user.email.split('@')[0]);
        } else if (user?.user_metadata?.full_name) {
            setUsername(user.user_metadata.full_name);
        } else {
            // Random guest name
            setUsername(`Guest-${Math.floor(Math.random() * 1000)}`);
        }
    }, [user]);

    if (!movieId) {
        return <div className="bg-black text-white h-screen flex items-center justify-center">Invalid Party Link: Missing Movie ID</div>;
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-black overflow-hidden pt-16"> {/* Add padding top for navbar if needed */}

            {/* Left: Player Section (70% on desktop) */}
            <div className="flex-1 lg:flex-[0.7] relative flex flex-col">
                <div className="w-full aspect-video bg-black shadow-2xl">
                    <SyncPlayer movieId={Number(movieId)} roomId={roomId} />
                </div>
                {/* Info Area below player */}
                <div className="p-4 text-white">
                    <h1 className="text-xl font-bold">Watch Party Room: {roomId}</h1>
                    <p className="text-gray-400 text-sm">Share this URL with friends to watch together!</p>
                </div>
            </div>

            {/* Right: Chat Section (30% on desktop) */}
            <div className="h-1/2 lg:h-full lg:flex-[0.3] w-full border-t lg:border-t-0 lg:border-l border-[#333]">
                <PartyChat roomId={roomId} username={username} />
            </div>

        </div>
    );
}
