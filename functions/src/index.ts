import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import { sendBirthdayNotification } from './notifications';

interface TokenCleanupData {
  token: string;
  userId: string;
  error: string;
}

admin.initializeApp();

// Gen 2 callable function
export const cleanupInvalidTokens = onCall(
  { region: 'us-central1' },
  async (request): Promise<{ success: boolean }> => {
    const data = request.data as TokenCleanupData;
    const context = request.auth;

    if (!context) {
      throw new HttpsError('unauthenticated', 'Must be authenticated to cleanup tokens');
    }

    const { token, userId, error } = data;

    if (!token || !userId || !error) {
      throw new HttpsError('invalid-argument', 'Missing required parameters');
    }

    try {
      const tokenRef = admin
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('tokens')
        .doc(token);

      await tokenRef.delete();

      logger.info(`✅ Cleaned up invalid token for user ${userId}`, {
        token,
        error,
        userId,
      });

      return { success: true };
    } catch (cleanupError) {
      logger.error('❌ Error cleaning up token:', cleanupError);
      throw new HttpsError('internal', 'Error cleaning up token');
    }
  }
);

// Still export birthday notifications (make sure it's updated to Gen 2 in notifications.ts)
export { sendBirthdayNotification };
