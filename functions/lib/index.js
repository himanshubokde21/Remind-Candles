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
exports.sendBirthdayNotification = exports.cleanupInvalidTokens = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const admin = __importStar(require("firebase-admin"));
const notifications_1 = require("./notifications");
Object.defineProperty(exports, "sendBirthdayNotification", { enumerable: true, get: function () { return notifications_1.sendBirthdayNotification; } });
admin.initializeApp();
// Gen 2 callable function
exports.cleanupInvalidTokens = (0, https_1.onCall)({ region: 'us-central1' }, async (request) => {
    const data = request.data;
    const context = request.auth;
    if (!context) {
        throw new https_1.HttpsError('unauthenticated', 'Must be authenticated to cleanup tokens');
    }
    const { token, userId, error } = data;
    if (!token || !userId || !error) {
        throw new https_1.HttpsError('invalid-argument', 'Missing required parameters');
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
    }
    catch (cleanupError) {
        logger.error('❌ Error cleaning up token:', cleanupError);
        throw new https_1.HttpsError('internal', 'Error cleaning up token');
    }
});
//# sourceMappingURL=index.js.map