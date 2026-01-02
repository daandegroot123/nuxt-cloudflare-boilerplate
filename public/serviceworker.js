/*
 * This file exists to satisfy browser requests for a service worker that may have been
 * registered by a previous version of the application or another application running
 * on the same port (localhost zombie service worker).
 *
 * It immediately unregisters itself to clean up the client state.
 */

self.addEventListener('install', () => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Unregister this service worker immediately
  self.registration.unregister()
    .then(() => {
      console.log('Zombie service worker unregistered');
    });
});
