import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

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

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    });
    if (currentToken) {
      console.log('Current token:', currentToken);
      return currentToken;
    }
    
    console.log('No registration token available');
    return null;
  } catch (err) {
    console.log('An error occurred while retrieving token:', err);
    return null;
  }
};

export const requestPermission = async () => {
  console.log('Requesting notification permission...');
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.log('Notification permission granted.');

    try {
      const token = await getToken(messaging, {
        vapidKey: 'BGm4Jv6zdCPzuyn9gbjRRFp-r7d9AubNkXhBsafhDXh7TRMefIILQzhneX0IaTjiTcZVT_vTOwnD367sZTY2naQ', // VAPID key
      });
      console.log('Your FCM Token:', token);
      alert('Your FCM Token:\n' + token); // quick copy method
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  } else {
    console.log('Notification permission denied.');
  }
};