# Firebase Setup Guide for Remind Candles

This guide will help you configure Firebase to resolve Google Sign-In issues.

## 🔧 Firebase Console Configuration

### 1. Enable Google Sign-In

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `remind-candles`
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Enable **Google Sign-In**
6. Set your **Project public-facing name**
7. Set your **Project support email**
8. Save the configuration

### 2. Add Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add the following domains (depending on your deployment):

**For Local Development:**
```
localhost
127.0.0.1
```

**For GitHub Codespaces:**
```
*.app.github.dev
{your-codespace-url}.app.github.dev
```

**For Production:**
```
your-production-domain.com
www.your-production-domain.com
```

**For Firebase Hosting:**
```
remind-candles.web.app
remind-candles.firebaseapp.com
```

### 3. Configure OAuth Redirect URIs

The OAuth redirect URIs are automatically managed by Firebase, but ensure your domains are authorized as mentioned above.

## 🔑 Environment Variables Setup

### 1. Create .env file

Copy `.env.example` to `.env` and fill in your Firebase configuration:

```bash
cp .env.example .env
```

### 2. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click on your web app or create one if it doesn't exist
4. Copy the config values and update your `.env` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=remind-candles.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=remind-candles
VITE_FIREBASE_STORAGE_BUCKET=remind-candles.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234
VITE_FIREBASE_VAPID_KEY=your_vapid_key_here
```

### 3. Get VAPID Key for Push Notifications

1. In Firebase Console, go to **Project Settings** → **Cloud Messaging**
2. In **Web configuration** section, generate or copy your **Web Push certificates** key
3. Add it to your `.env` file as `VITE_FIREBASE_VAPID_KEY`

## 🚀 Deployment Considerations

### GitHub Codespaces

If you're using GitHub Codespaces, your URL will be something like:
```
https://username-repo-randomstring.github.dev
```

Make sure to add `*.app.github.dev` to your authorized domains.

### Production Deployment

1. Add your production domain to authorized domains
2. Update CORS settings if needed
3. Ensure HTTPS is enabled (required for OAuth)

## 🐛 Troubleshooting Common Issues

### Error: "unauthorized_client"
- **Cause**: Domain not in authorized domains list
- **Solution**: Add your current domain to Firebase Console → Authentication → Settings → Authorized domains

### Error: "popup_closed_by_user"
- **Cause**: User closed the popup or popup was blocked
- **Solution**: Ensure popups are enabled in browser, or implement redirect flow

### Error: "auth/operation-not-allowed"
- **Cause**: Google Sign-In not enabled in Firebase Console
- **Solution**: Enable Google provider in Authentication → Sign-in method

### Error: "auth/invalid-api-key"
- **Cause**: Incorrect or missing Firebase API key
- **Solution**: Verify `VITE_FIREBASE_API_KEY` in your `.env` file

### Error: "auth/invalid-auth-domain"
- **Cause**: Incorrect Firebase Auth Domain
- **Solution**: Verify `VITE_FIREBASE_AUTH_DOMAIN` matches your project

## 🔍 Debugging

The app includes debug information in development mode. Check the browser console for:
- Current origin and auth domain
- Detailed error messages
- Authentication state changes

## ✅ Verification Steps

1. **Test locally**: `npm run dev` and try signing in at `http://localhost:5173/login`
2. **Check console**: Look for Firebase initialization and auth state logs
3. **Verify domain**: Ensure your current domain appears in authorized domains
4. **Test popup**: Ensure browser allows popups for your domain

## 📞 Support

If you continue to experience issues:

1. Check browser console for detailed error messages
2. Verify all environment variables are correctly set
3. Ensure your Firebase project has the Google Sign-In provider enabled
4. Check that your domain is in the authorized domains list

For more help, check the [Firebase Auth Documentation](https://firebase.google.com/docs/auth/web/google-signin).