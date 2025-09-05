"use strict";
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const serviceAccount = require("./functions/remind-candles-firebase-adminsdk-fbsvc-52abf7030f.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://remind-candles.firebaseio.com", // Replace with your Firebase project database URL
});

// Import other modules
const notifications_1 = require("./notifications");

// Cleanup invalid tokens function
exports.cleanupInvalidTokens = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be authenticated to cleanup tokens");
  }
  const { token, userId, error } = data;
  if (!token || !userId || !error) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required parameters");
  }
  try {
    const tokenRef = admin.firestore()
      .collection("users")
      .doc(userId)
      .collection("tokens")
      .doc(token);
    await tokenRef.delete();
    functions.logger.info(`Cleaned up invalid token for user ${userId}`, {
      token,
      error,
      userId,
    });
    return { success: true };
  } catch (cleanupError) {
    functions.logger.error("Error cleaning up token:", cleanupError);
    throw new functions.https.HttpsError("internal", "Error cleaning up token");
  }
});

// Export the sendBirthdayNotification function
exports.sendBirthdayNotification = notifications_1.sendBirthdayNotification;