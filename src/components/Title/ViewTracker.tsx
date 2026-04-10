'use client';

import { useEffect, useRef } from 'react';
import { useTracker } from '@/lib/tracker';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

interface Props {
    contentId: string;
    contentTitle: string;
    contentType: string;
    posterPath?: string | null;
}

// Milestones to report: 25%, 50%, 75%, 100%
const MILESTONES = [25, 50, 75, 100];

export default function ViewTracker({ contentId, contentTitle, contentType, posterPath }: Props) {
    const reported = useRef<Set<number>>(new Set());
    const startTime = useRef<number>(Date.now());
    const estimatedDuration = useRef<number>(90 * 60 * 1000);
    const { track } = useTracker();
    const tokenRef = useRef<string | undefined>();

    useEffect(() => {
        getSupabaseBrowserClient().auth.getSession().then(({ data }) => {
            tokenRef.current = data.session?.access_token;
        });
    }, []);

    const log = async (completion_pct: number) => {
        if (reported.current.has(completion_pct)) return;
        reported.current.add(completion_pct);

        const access_token = tokenRef.current;

        // View log API (admin analytics)
        fetch('/api/view-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content_id: contentId, content_title: contentTitle,
                content_type: contentType, poster_path: posterPath ?? null,
                completion_pct,
                access_token,
            }),
        }).catch(() => {});

        // 🧠 ML tracker — richer event with type
        track({
            event_type: completion_pct === 0 ? 'view_start' : 'view_milestone',
            content_id: contentId,
            content_title: contentTitle,
            content_type: contentType,
            metadata: { completion_pct, poster_path: posterPath },
        });
    };

    useEffect(() => {
        log(0); // view_start

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime.current;
            const pct = Math.min(100, Math.round((elapsed / estimatedDuration.current) * 100));
            for (const milestone of MILESTONES) {
                if (pct >= milestone && !reported.current.has(milestone)) {
                    log(milestone);
                }
            }
        }, 30_000);

        const handleUnload = () => {
            const elapsed = Date.now() - startTime.current;
            const pct = Math.min(100, Math.round((elapsed / estimatedDuration.current) * 100));
            const access_token = tokenRef.current;

            if (navigator.sendBeacon) {
                navigator.sendBeacon('/api/view-log', new Blob([
                    JSON.stringify({ 
                        content_id: contentId, content_title: contentTitle, 
                        content_type: contentType, poster_path: posterPath ?? null, 
                        completion_pct: pct, access_token 
                    })
                ], { type: 'application/json' }));
            }
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [contentId]);

    return null;
}

