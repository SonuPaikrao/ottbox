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

                // 2. Parse User Agent (Basic Detection)
                const ua = navigator.userAgent;
                let device = 'Desktop';
                if (/Mobi|Android/i.test(ua)) device = 'Mobile';
                else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';

                let os = 'Unknown';
                if (ua.indexOf("Win") != -1) os = "Windows";
                if (ua.indexOf("Mac") != -1) os = "MacOS";
                if (ua.indexOf("Linux") != -1) os = "Linux";
                if (ua.indexOf("Android") != -1) os = "Android";
                if (ua.indexOf("like Mac") != -1) os = "iOS";

                let browser = 'Unknown';
                if (ua.indexOf("Chrome") != -1) browser = "Chrome";
                else if (ua.indexOf("Safari") != -1) browser = "Safari";
                else if (ua.indexOf("Firefox") != -1) browser = "Firefox";

                // 3. Send to our API
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
                        userId: user?.id || null,
                        device_type: device,
                        os: os,
                        browser: browser,
                        activity_type: 'visit'
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
