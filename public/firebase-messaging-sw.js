// ✅ Import Firebase compat libraries for service workers
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

// ✅ Initialize Firebase in the Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyBR0JX9p8q_0eCNFNIu3dhx6lsKancFjXI",
  authDomain: "remind-candles.firebaseapp.com",
  projectId: "remind-candles",
  storageBucket: "remind-candles.appspot.com",
  messagingSenderId: "860899862354",
  appId: "1:860899862354:web:6180680aa8f3acc907bc8b",
});

// ✅ Messaging handler for background notifications
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Received background message: ", payload);

  const notificationTitle = payload.notification?.title || "Birthday Reminder 🎂";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new reminder!",
    icon: "/assets/notify-cake.png", // your custom icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ==============================
// ⚡ PWA CACHE SETUP
// ==============================
const CACHE_NAME = "remind-candles-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-72x72.png",
  "/calendar-favicon.svg",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) => response || fetch(event.request)
    )
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = new URL("/", self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
