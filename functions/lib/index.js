"use strict";
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://<your-project-id>.firebaseio.com", // Replace <your-project-id> with your Firebase project ID
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
    }
    catch (cleanupError) {
        functions.logger.error("Error cleaning up token:", cleanupError);
        throw new functions.https.HttpsError("internal", "Error cleaning up token");
    }
});
// Export the sendBirthdayNotification function
exports.sendBirthdayNotification = notifications_1.sendBirthdayNotification;
const softChime = new Audio("/sounds/soft-chime.mp3");
const loudAlert = new Audio("/sounds/loud-alert.mp3");

function playSoftChime() {
    softChime.play();
}

function playLoudAlert() {
    loudAlert.play();
}
//# sourceMappingURL=index.js.map