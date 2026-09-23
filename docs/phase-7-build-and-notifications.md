# Phase 7: outbox, push-token persistence, trusted notifications, and build fixes

Implemented:

- Chat text sends now enter the AsyncStorage outbox when Firestore is unavailable.
- The root app automatically retries queued messages when the app reconnects.
- Expo push tokens are persisted under `users/{uid}/pushTokens/{tokenId}`.
- Added a Firebase Functions backend that sends Expo notifications for new text messages.
- Added native `expo-device` dependency.
- Removed the missing notification-icon asset reference from Expo configuration.
- Tightened push-token and message security rules.

## Install and check

```bash
npm install
npm run typecheck
cd functions && npm install && npm run build
```

## Deploy trusted notifications

From a configured Firebase project:

```bash
cd functions
npm run deploy
```

The mobile app never contains Firebase Admin credentials or push-service secrets. Configure `EXPO_PUBLIC_EAS_PROJECT_ID` in the mobile `.env`, and use a physical device for push-token registration.

## Notes

The backend currently notifies text messages only. Media notifications can be added after selecting a privacy-safe notification preview policy. Expo push receipts, invalid-token cleanup, and rate limiting should be added before a large public release.
