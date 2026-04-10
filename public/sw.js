// FORCE UNREGISTER AND CLEANUP
// This script ensures that any existing Service Worker functionality is removed
// to prevent the "Oxygen" legacy code from persisting.

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('[SW] Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            console.log('[SW] All caches deleted. Unregistering...');
            return self.registration.unregister();
        }).then(() => {
            return self.clients.claim();
        })
    );
});
