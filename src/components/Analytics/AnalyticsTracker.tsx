'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AnalyticsTracker() {
    const { user } = useAuth();
    const ranOnce = useRef(false);

    useEffect(() => {
        const trackVisit = async () => {
            // Prevent double tracking in React Strict Mode or fast re-renders
            if (ranOnce.current) return;

            // Check Session Storage to only track ONCE per session
            if (sessionStorage.getItem('analytics_tracked')) return;

            ranOnce.current = true;

            try {
                // 1. Get IP & Geo Data
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();

                if (data.error) {
                    console.warn('Analytics Geo Error:', data.reason);
                    return;
                }

                // 2. Send to our API
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ip: data.ip,
                        country: data.country_name,
                        city: data.city,
                        region: data.region,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        userId: user?.id || null
                    })
                });

                // Mark as tracked for this tab closure
                sessionStorage.setItem('analytics_tracked', 'true');

            } catch (error) {
                console.error('Analytics Error:', error);
            }
        };

        trackVisit();
    }, [user]);

    return null; // Invisible Component
}
