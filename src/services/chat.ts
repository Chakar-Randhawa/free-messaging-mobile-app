import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  limit,
  startAt,
  endAt,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Conversation, Message, UserProfile } from '@/types/chat';

export function conversationIdFor(firstUid: string, secondUid: string) {
  return [firstUid, secondUid].sort().join('_');
}

export async function ensureDirectConversation(currentUid: string, otherUid: string) {
  const id = conversationIdFor(currentUid, otherUid);
  const ref = doc(db, 'conversations', id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    await setDoc(ref, {
      type: 'direct',
      participantIds: [currentUid, otherUid],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  return id;
}

export function subscribeToConversations(uid: string, callback: (items: Conversation[]) => void): Unsubscribe {
  const conversationsQuery = query(
    collection(db, 'conversations'),
    where('participantIds', 'array-contains', uid),
    orderBy('updatedAt', 'desc'),
    limit(50),
  );
  return onSnapshot(conversationsQuery, (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Conversation))));
}

export function subscribeToMessages(conversationId: string, callback: (items: Message[]) => void): Unsubscribe {
  const messagesQuery = query(collection(db, 'conversations', conversationId, 'messages'), orderBy('createdAt', 'asc'), limit(100));
  return onSnapshot(messagesQuery, (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Message))));
}

export async function sendTextMessage(conversationId: string, senderId: string, receiverId: string, text: string) {
  const cleanText = text.trim();
  if (!cleanText) return;
  await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
    senderId,
    receiverId,
    type: 'text',
    text: cleanText,
    isDeleted: false,
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, 'conversations', conversationId), {
    lastMessageText: cleanText,
    lastMessageType: 'text',
    lastMessageSenderId: senderId,
    lastMessageAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export function searchUsers(prefix: string, callback: (items: UserProfile[]) => void): Unsubscribe {
  const normalized = prefix.trim().toLowerCase();
  if (!normalized) { callback([]); return () => undefined; }
  const usersQuery = query(
    collection(db, 'users'),
    orderBy('displayNameLowercase'),
    startAt(normalized),
    endAt(`${normalized}\uf8ff`),
    limit(20),
  );
  return onSnapshot(usersQuery, (snapshot) => callback(snapshot.docs.map((item) => item.data() as UserProfile)));
}
