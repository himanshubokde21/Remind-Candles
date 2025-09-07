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
const https_1 = require("firebase-functions/v2/https");
const firebase_functions_1 = require("firebase-functions");
exports.sendBirthdayNotification = (0, https_1.onCall)({ region: 'us-central1' }, async (request) => {
    const context = request.auth;
    const { userId, title, body, data: customData } = request.data;
    if (!context) {
        throw new https_1.HttpsError('unauthenticated', 'Must be authenticated to send notifications');
    }
    try {
        const tokensSnapshot = await admin
            .firestore()
            .collection('users')
            .doc(userId)
            .collection('tokens')
            .where('isActive', '==', true)
            .get();
        if (tokensSnapshot.empty) {
            throw new https_1.HttpsError('failed-precondition', 'No active notification tokens found for user');
        }
        const message = {
            notification: { title, body },
            data: customData || {},
            android: {
                notification: {
                    icon: '@drawable/ic_notification',
                    color: '#FFD700',
                },
            },
            apns: {
                payload: { aps: { sound: 'default' } },
            },
            webpush: {
                notification: {
                    icon: '/icons/golden-icon-192x192.png',
                    badge: '/icons/golden-badge-72x72.png',
                },
            },
        };
        const tokens = tokensSnapshot.docs
            .map((doc) => doc.data().token)
            .filter((token) => Boolean(token));
        const response = await admin.messaging().sendMulticast(Object.assign(Object.assign({}, message), { tokens }));
        if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success && resp.error) {
                    failedTokens.push({ token: tokens[idx], error: resp.error });
                }
            });
            if (failedTokens.length) {
                const batch = admin.firestore().batch();
                failedTokens.forEach(({ token }) => {
                    const ref = admin.firestore()
                        .collection('users')
                        .doc(userId)
                        .collection('tokens')
                        .doc(token);
                    batch.delete(ref);
                });
                await batch.commit();
            }
        }
        return {
            success: true,
            sentCount: response.successCount,
            failureCount: response.failureCount,
        };
    }
    catch (error) {
        firebase_functions_1.logger.error('❌ Error sending notification:', error);
        throw new https_1.HttpsError('internal', 'Error sending notification');
    }
});
//# sourceMappingURL=notifications.js.map