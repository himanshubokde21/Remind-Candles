"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBirthdayNotification = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions/v1"));
exports.sendBirthdayNotification = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated to send notifications');
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
            throw new functions.https.HttpsError('failed-precondition', 'No active notification tokens found for user');
        }
        const message = {
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
        const response = await admin.messaging().sendMulticast(Object.assign(Object.assign({}, message), { tokens }));
        if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success && resp.error) {
                    failedTokens.push({
                        token: tokens[idx],
                        error: resp.error
                    });
                }
            });
            await Promise.all(failedTokens.map(({ token }) => admin
                .firestore()
                .collection('users')
                .doc(userId)
                .collection('tokens')
                .doc(token)
                .delete()));
        }
        return {
            success: true,
            sentCount: response.successCount,
            failureCount: response.failureCount
        };
    }
    catch (error) {
        functions.logger.error('Error sending notification:', error);
        throw new functions.https.HttpsError('internal', 'Error sending notification');
    }
});
//# sourceMappingURL=notifications.js.map