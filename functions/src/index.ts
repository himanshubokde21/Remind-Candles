import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { sendBirthdayNotification } from './notifications';

interface TokenCleanupData {
  token: string;
  userId: string;
  error: string;
}

admin.initializeApp();

// Callable function to clean up invalid tokens
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
      const tokenRef = admin
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('tokens')
        .doc(token);

      await tokenRef.delete();

      functions.logger.info(`Cleaned up invalid token for user ${userId}`, {
        token,
        error,
        userId,
      });

      return { success: true };
    } catch (cleanupError) {
      functions.logger.error('Error cleaning up token:', cleanupError);
      throw new functions.https.HttpsError('internal', 'Error cleaning up token');
    }
  }
);

// Export your notification function (implemented in ./notifications.ts)
export { sendBirthdayNotification };
