# Phase 2: Authentication

Implemented:

- Firebase Authentication initialization with AsyncStorage persistence
- Email/password registration
- Display name profile creation in Firestore
- Email verification email
- Email/password login
- Password reset
- Logout
- Auth state listener and protected Expo Router navigation
- Basic Android/iOS-ready authentication screens

## Firebase setup required

1. Create a Firebase project.
2. Enable Authentication > Sign-in method > Email/Password.
3. Create a Firestore database.
4. Copy `.env.example` to `.env`.
5. Add the Firebase Web App configuration values to `.env`.
6. Install dependencies with `npm install`.
7. Start the app with `npm start`.

The app intentionally does not import or use Firebase Storage.
