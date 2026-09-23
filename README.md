# Free Messaging Mobile App

This repository is the starting point for a free, cross-platform messaging app for Android and iOS using Expo + React Native + Firebase.

## Current phase

This is Phase 1: project foundation and repository setup.

## Planned stack

- Expo + React Native
- TypeScript
- Firebase Authentication
- Cloud Firestore
- No Firebase Storage for media uploads
- Local device storage for temporary file handling
- Optional free-tier media service such as Supabase Storage or Cloudinary for shared images/videos/documents

## Features planned

- Email/password signup and login
- Display name support
- Real-time one-to-one messaging
- Conversation list
- Unread counts
- User profiles
- Offline-ready architecture
- Media upload abstraction without Firebase Storage

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Fill in Firebase configuration values.

4. Start the app:
   ```bash
   npm start
   ```

## App entry

The project is set up as a native Expo app and is ready for Phase 2 implementation.

## Important note

This is a starter implementation intended for a free-tier mobile app. A fully production-ready chat app with unlimited scale, push notifications, and media delivery usually requires a combination of paid or quota-limited services.
