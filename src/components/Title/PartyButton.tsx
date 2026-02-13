'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2, Users } from 'lucide-react';
import styles from './TitleActions.module.css'; // Re-use styles

export default function PartyButton({ movie }: { movie: any }) {
    const { user } = useAuth();
    const router = useRouter();
    const [creating, setCreating] = useState(false);

    const handleCreateParty = async () => {
        if (!user) return; // Should not happen if button is hidden, but double check
        setCreating(true);

        try {
            // 1. Get Username
            let username = user.email?.split('@')[0] || 'User';
            if (user.user_metadata?.full_name) {
                username = user.user_metadata.full_name.replace(/\s+/g, '').toLowerCase(); // Sanitize for URL
            }

            // 2. Insert into DB
            const { data, error } = await supabase
                .from('watch_parties')
                .insert({
                    creator_id: user.id,
                    creator_username: username,
                    movie_id: movie.id.toString(),
                })
                .select()
                .single();

            if (error) throw error;

            // 3. Redirect
            if (data) {
                router.push(`/party/${data.creator_username}/${data.id}?movieId=${movie.id}`);
            }
        } catch (err) {
            console.error('Failed to create party:', err);
            alert('Failed to create party. Please try again.');
        } finally {
            setCreating(false);
        }
    };

    if (!user) {
        return null; // Strict Auth Guard: Hide button if not logged in
    }

    return (
        <button
            onClick={handleCreateParty}
            className={styles.trailerBtn} // Re-use trailer button style for consistency
            disabled={creating}
            title="Start Watch Party with Friends"
        >
            {creating ? <Loader2 className="animate-spin" size={20} /> : <Users size={20} style={{ marginRight: '8px' }} />}
            <span style={{ marginLeft: '5px' }}>{creating ? 'Creating...' : 'Watch Party'}</span>
        </button>
    );
}
