'use client';

import { useWatchlist } from "@/context/WatchlistContext";
import { useToast } from "@/context/ToastContext";
import { Movie } from "@/lib/api";
import { Plus, Check } from "lucide-react";
import styles from './WatchlistButton.module.css';

export default function WatchlistButton({ movie }: { movie: Movie }) {
    const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
    const { showToast } = useToast();
    const isAdded = isInWatchlist(movie.id);

    const toggle = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if inside a link
        e.stopPropagation();

        if (isAdded) {
            removeFromWatchlist(movie.id);
            showToast(`Removed from My List`, 'info');
        } else {
            addToWatchlist(movie);
            showToast(`Added to My List`, 'success');
        }
    };

    return (
        <button
            className={`${styles.btn} ${isAdded ? styles.added : ''}`}
            onClick={toggle}
            title={isAdded ? "Remove from Watchlist" : "Add to Watchlist"}
        >
            {isAdded ? <Check size={18} /> : <Plus size={18} />}
        </button>
    );
}
