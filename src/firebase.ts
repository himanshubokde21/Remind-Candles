// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);

// Google Sign-In with enhanced error handling
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    
    // Add additional scopes if needed
    provider.addScope('email');
    provider.addScope('profile');
    
    // Set custom parameters for OAuth
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    console.log('🔐 Attempting Google Sign-In...');
    console.log('🔧 Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
    console.log('🌐 Current Origin:', window.location.origin);
    console.log('🌐 Current Host:', window.location.host);
    
    const result = await signInWithPopup(auth, provider);
    console.log('✅ Sign-In successful:', result.user?.displayName);
    return result;
  } catch (error: any) {
    console.error('❌ Google Sign-In Error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Provide more specific error messages
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Pop-up was blocked by your browser. Please enable pop-ups and try again.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Google Sign-In is not enabled. Please contact support.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for Google Sign-In. Please contact support.');
    } else {
      throw new Error(`Sign-in failed: ${error.message}`);
    }
  }
};

// Request FCM token
export const requestForToken = async (): Promise<string | null> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (token) {
      console.log("✅ FCM Token:", token);
      return token;
    } else {
      console.log("⚠️ No registration token available");
      return null;
    }
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
    return null;
  }
};

// Get or request permission + token
export const getOrRequestPermissionAndToken = async (): Promise<string | null> => {
  try {
    if (Notification.permission === "granted") {
      return await requestForToken();
    } else {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        return await requestForToken();
      } else {
        console.log("⚠️ Notification permission denied");
        return null;
      }
    }
  } catch (error) {
    console.error("❌ Error getting or requesting FCM token:", error);
    return null;
  }
};

// Foreground messages
onMessage(messaging, (payload) => {
  console.log("📩 Message received in foreground:", payload);
  try {
    if (payload.notification) {
      new Notification(payload.notification.title || "Notification", {
        body: payload.notification.body,
        icon: "/icons/icon-192x192.png",
      });
    }
  } catch (err) {
    console.warn("Notification error:", err);
  }
});

export default app;
