import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface TokenCleanupData {
  token: string;
  userId: string;
  error: string;
}

admin.initializeApp();

export const cleanupInvalidTokens = functions.https.onCall(
  async (data: TokenCleanupData, context: functions.https.CallableContext) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Must be authenticated to cleanup tokens'
      );
    }

    const { token, userId, error } = data;

    if (!token || !userId || !error) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required parameters'
      );
    }

    try {
      const tokenRef = admin.firestore()
        .collection('users')
        .doc(userId)
        .collection('tokens')
        .doc(token);

      await tokenRef.delete();

      functions.logger.info(`Cleaned up invalid token for user ${userId}`, {
        token,
        error,
        userId
      });

      return { success: true };
    } catch (cleanupError) {
      functions.logger.error('Error cleaning up token:', cleanupError);
      throw new functions.https.HttpsError('internal', 'Error cleaning up token');
    }
  }
);

export { sendBirthdayNotification } from './notifications';

// Example of sending a notification
const sendNotification = httpsCallable(getFunctions(), 'sendBirthdayNotification');
(async () => {
  await sendNotification({
    userId: 'target-user-id',
    title: 'Birthday Reminder!',
    body: 'It\'s John\'s birthday today!',
    data: {
      type: 'birthday',
      personId: 'john-123'
    }
  });
})();