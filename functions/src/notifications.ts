import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";

admin.initializeApp();

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

export const sendBirthdayNotification = onCall<NotificationPayload>(
  { region: "us-central1" },
  async (
    request
  ): Promise<{ success: boolean; sentCount: number; failureCount: number }> => {
    const context = request.auth;
    const { userId, title, body, data: customData } = request.data;

    if (!context) {
      throw new HttpsError(
        "unauthenticated",
        "Must be authenticated to send notifications"
      );
    }

    try {
      const tokensSnapshot = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("tokens")
        .where("isActive", "==", true)
        .get();

      if (tokensSnapshot.empty) {
        throw new HttpsError(
          "failed-precondition",
          "No active notification tokens found for user"
        );
      }

      // Collect tokens
      const tokens = tokensSnapshot.docs
        .map((doc) => doc.data().token)
        .filter((token): token is string => Boolean(token));

      // Construct message
      const message: NotificationMessage = {
        notification: { title, body },
        data: customData || {},
        android: {
          notification: {
            icon: "@drawable/ic_notification",
            color: "#FFD700",
          },
        },
        apns: {
          payload: { aps: { sound: "default" } },
        },
        webpush: {
          notification: {
            icon: "/icons/golden-icon-192x192.png",
            badge: "/icons/golden-badge-72x72.png",
          },
        },
      };

      // ✅ Use sendEachForMulticast instead of sendMulticast
      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        ...message,
      });

      const failedTokens: FailedToken[] = [];

      // Handle individual responses
      response.responses.forEach((resp, idx) => {
        if (resp.success) {
          console.log(`✅ Notification sent successfully to token[${idx}]`);
        } else {
          console.error(
            `❌ Failed to send notification to token[${idx}]:`,
            resp.error
          );
          failedTokens.push({
            token: tokens[idx],
            error: resp.error as unknown as Error,
          });
        }
      });

      // Clean up invalid tokens
      if (failedTokens.length) {
        const batch = admin.firestore().batch();
        failedTokens.forEach(({ token }) => {
          const ref = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("tokens")
            .doc(token);
          batch.delete(ref);
        });
        await batch.commit();
      }

      return {
        success: true,
        sentCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      logger.error("❌ Error sending notification:", error);
      throw new HttpsError("internal", "Error sending notification");
    }
  }
);
