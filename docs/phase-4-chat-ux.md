# Phase 4: Chat reliability and presence

Implemented read-state storage, unread-count increments, online/last-seen fields, typing indicators, participant profile subscriptions, and a paged latest-message query. The message service exposes `loadOlderMessages` using a Firestore cursor for the next page.

Deploy the updated Firestore rules before testing. A production presence system should eventually use a server-side heartbeat or Realtime Database presence; this phase uses controlled Firestore writes to remain simple and free-tier friendly.
