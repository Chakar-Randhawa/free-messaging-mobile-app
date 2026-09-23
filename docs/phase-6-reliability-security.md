# Phase 6: Offline reliability, notifications, permissions, and security

Implemented:

- AsyncStorage outbox for text-message retry queues
- Connectivity monitoring with NetInfo
- Automatic queue processing when connectivity returns
- Maximum five retry attempts per queued message
- Expo push-notification permission registration
- Android notification channel configuration
- iOS and Android media/notification permission declarations
- Stricter Firestore ownership and conversation-membership rules
- Protected conversation member and typing subcollections

## Required setup

Install dependencies and create a native development build because notifications and NetInfo require native modules:

```bash
npm install
npx expo prebuild
npx expo run:android
# or
npx expo run:ios
```

Push notifications require a physical device and an EAS project ID:

```env
EXPO_PUBLIC_EAS_PROJECT_ID=your-eas-project-id
```

The notification token must be stored server-side and sent through a trusted server or Expo Push Service. Never send push notifications using privileged credentials from the mobile app.

## Important integration note

The outbox processor is available at `src/services/offlineQueue.ts`. Text-send UI should enqueue a message when Firestore is unavailable and call `processTextMessageQueue` after connectivity returns. Media uploads should remain online-only until resumable upload support is added.

Deploy `firestore.rules` before testing. Review existing documents for required `uid`, `participantIds`, and `senderId` fields; invalid legacy documents may be rejected by the stricter rules.
