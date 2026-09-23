# Phase 3: Firestore data model and real-time direct messaging

Implemented:

- Typed user, conversation, and message models
- Deterministic direct-conversation IDs to prevent duplicates
- Real-time conversation-list listener
- Real-time message listener
- Display-name prefix search
- One-to-one conversation creation
- Text message sending with conversation previews
- Mobile chat screen with message bubbles
- Firestore security rules for users, conversations, and messages

## Required Firebase setup

Deploy `firestore.rules` to the Firebase project before testing. Firestore may also ask for a composite index for the conversation-list query; create the index using the link shown in the Firebase error, with `participantIds` as an array field and `updatedAt` descending.

The app listens to the latest 50 conversations and latest 100 messages per conversation to control free-tier reads. Older-message pagination will be added in a later phase.
