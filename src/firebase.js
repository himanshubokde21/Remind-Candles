import { getMessaging, getToken } from "firebase/messaging";
import { getFunctions } from "firebase/functions";
import FirebaseService from "./services/FirebaseService";

const app = FirebaseService.getInstance().getApp();
const messaging = getMessaging(app);
const functions = getFunctions(app);

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
