import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v1';

interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

interface FailedToken {
  token: string;
  error: Error;
}

interface NotificationMessage {
  notification: {
    title: string;
    body: string;
  };
  data: Record<string, string>;
  android: {
    notification: {
      icon: string;
      color: string;
    };
  };
  apns: {
    payload: {
      aps: {
        sound: string;
      };
    };
  };
  webpush: {
    notification: {
      icon: string;
      badge: string;
    };
  };
}

export const sendBirthdayNotification = functions.https.onCall(
  async (data: NotificationPayload, context: functions.https.CallableContext) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Must be authenticated to send notifications'
      );
    }

    const { userId, title, body, data: customData } = data;

    try {
      const tokensSnapshot = await admin
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('tokens')
        .where('isActive', '==', true)
        .get();

      if (tokensSnapshot.empty) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'No active notification tokens found for user'
        );
      }

      const message: NotificationMessage = {
        notification: {
          title,
          body,
        },
        data: customData || {},
        android: {
          notification: {
            icon: '@drawable/ic_notification',
            color: '#FFB5E8'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default'
            }
          }
        },
        webpush: {
          notification: {
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png'
          }
        }
      };

      const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
      const response = await admin.messaging().sendMulticast({
        ...message,
        tokens
      });

      if (response.failureCount > 0) {
        const failedTokens: FailedToken[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success && resp.error) {
            failedTokens.push({
              token: tokens[idx],
              error: resp.error as unknown as Error
            });
          }
        });

        await Promise.all(
          failedTokens.map(({ token }) =>
            admin
              .firestore()
              .collection('users')
              .doc(userId)
              .collection('tokens')
              .doc(token)
              .delete()
          )
        );
      }

      return {
        success: true,
        sentCount: response.successCount,
        failureCount: response.failureCount
      };
    } catch (error) {
      functions.logger.error('Error sending notification:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Error sending notification'
      );
    }
  }
);