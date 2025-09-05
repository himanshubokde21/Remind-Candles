import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

interface CleanupTokensData {
  token: string;
  userId: string;
  error: string;
}

export const cleanupInvalidTokens = functions.https.onCall(
  async (data: CleanupTokensData, context: functions.https.CallableContext) => {
    if (!context?.auth) {
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
    } catch (error) {
      functions.logger.error('Error cleaning up token:', error);
      throw new functions.https.HttpsError('internal', 'Error cleaning up token');
    }
  });