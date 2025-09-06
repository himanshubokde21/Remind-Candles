import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 🔹 Functions
const functions = getFunctions(app);

// Connect to emulator only in dev
if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}
  
// ✅ Ask for notification permission + return FCM token
export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.warn("Notification permission not granted");
      return null;
    }
  } catch (err) {
    console.error("Error getting FCM token:", err);
    return null;
  }
};

export { functions };

// This function silently gets a token if permission is already granted.
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BGm4Jv6zdCPzuyn9gbjRRFp-r7d9AubNkXhBsafhDXh7MefIILQzhneX0IaTjiTcZVT_vTOwnD367sZTY2naQ", // Replace with your VAPID key
    });
    if (currentToken) {
      console.log('Current token:', currentToken);
      return currentToken;
    }
    
    console.log('No registration token available. Request permission to generate one.');
    return null;
  } catch (err) {
    console.log('An error occurred while retrieving token:', err);
    return null;
  }
};

// This function handles the full user-facing flow: it ASKS for permission,
// and IF GRANTED, it then gets the token.
export const getOrRequestPermissionAndToken = async () => {
  console.log('Requesting notification permission...');
  try {
    // 1. Ask the user for permission.
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // 2. If granted, get the token.
      return await requestForToken();
    } 
    
    console.log('Notification permission denied.');
    alert('You have denied notification permissions. To receive reminders, please enable them in your browser settings.');
    return null;
    
  } catch (error) {
    console.error('An error occurred during the permission request:', error);
    return null;
  }
};

