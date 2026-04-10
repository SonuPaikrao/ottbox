'use client';

import { createContext, useContext, useRef, useCallback, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface TrackEvent {
    event_type:
    | 'search'
    | 'search_click'
    | 'view_start'
    | 'view_milestone'
    | 'watchlist_add'
    | 'watchlist_remove'
    | 'content_click';
    content_id?: string | number;
    content_title?: string;
    content_type?: string;
    content_genre?: string;
    metadata?: Record<string, unknown>;
}

interface TrackerContextType {
    track: (event: TrackEvent) => void;
    getToken: () => string | undefined;
}

const TrackerContext = createContext<TrackerContextType>({ track: () => {}, getToken: () => undefined });

export function useTracker() {
    return useContext(TrackerContext);
}

function getSessionId(): string {
    if (typeof window === 'undefined') return 'ssr';
    let sid = sessionStorage.getItem('_ott_sid');
    if (!sid) {
        sid = crypto.randomUUID();
        sessionStorage.setItem('_ott_sid', sid);
    }
    return sid;
}

export function TrackerProvider({ children }: { children: ReactNode }) {
    const queue = useRef<TrackEvent[]>([]);
    const flushing = useRef(false);
    const { session } = useAuth(); // ✅ Get session directly from AuthContext (already works!)
    const tokenRef = useRef<string | undefined>(undefined);

    // Keep tokenRef in sync with session — AuthContext already handles cookie/token refresh
    useEffect(() => {
        tokenRef.current = session?.access_token ?? undefined;
    }, [session]);

    const getToken = useCallback(() => tokenRef.current, []);

    const flush = useCallback(async (immediate = false) => {
        if (flushing.current || queue.current.length === 0) return;
        flushing.current = true;

        const batch = [...queue.current];
        queue.current = [];

        const sessionId = getSessionId();
        const payloadEvents = batch.map(e => ({ ...e, session_id: sessionId }));
        const token = tokenRef.current;

        try {
            const payload = { events: payloadEvents, access_token: token };

            if (immediate && navigator.sendBeacon) {
                navigator.sendBeacon(
                    '/api/track',
                    new Blob([JSON.stringify(payload)], { type: 'application/json' })
                );
            } else {
                await fetch('/api/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }
        } catch {
            // Silent fail — never interrupt user experience
        } finally {
            flushing.current = false;
        }
    }, []);

    // Flush every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => flush(), 10_000);
        const onUnload = () => flush(true); // immediate on tab close
        window.addEventListener('beforeunload', onUnload);
        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', onUnload);
        };
    }, [flush]);

    const track = useCallback((event: TrackEvent) => {
        queue.current.push({
            ...event,
            content_id: event.content_id ? String(event.content_id) : undefined,
            metadata: {
                ...event.metadata,
                watch_hour: new Date().getHours(),
                from_page: typeof window !== 'undefined' ? window.location.pathname : undefined,
            }
        });
        // If queue is getting large, flush early
        if (queue.current.length >= 10) flush();
    }, [flush]);

    return (
        <TrackerContext.Provider value={{ track, getToken }}>
            {children}
        </TrackerContext.Provider>
    );
}
