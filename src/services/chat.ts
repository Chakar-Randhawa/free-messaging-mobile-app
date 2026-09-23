import { addDoc, collection, deleteDoc, doc, endAt, getDoc, getDocs, increment, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, startAfter, startAt, updateDoc, where, type QueryDocumentSnapshot, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Conversation, Message, UserProfile } from '@/types/chat';

const PAGE_SIZE = 30;
export function conversationIdFor(a: string, b: string) { return [a, b].sort().join('_'); }
export async function ensureDirectConversation(currentUid: string, otherUid: string) {
  const id = conversationIdFor(currentUid, otherUid); const ref = doc(db, 'conversations', id);
  if (!(await getDoc(ref)).exists()) await setDoc(ref, { type: 'direct', participantIds: [currentUid, otherUid], createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
  await Promise.all([currentUid, otherUid].map(uid => setDoc(doc(db, 'conversations', id, 'members', uid), { uid, unreadCount: 0, joinedAt: serverTimestamp() }, { merge: true })));
  return id;
}
export function getUserProfile(uid: string) { return getDoc(doc(db, 'users', uid)).then(s => s.exists() ? ({ uid: s.id, ...s.data() } as UserProfile) : null); }
export function subscribeToConversations(uid: string, callback: (items: Conversation[]) => void): Unsubscribe {
  return onSnapshot(query(collection(db, 'conversations'), where('participantIds', 'array-contains', uid), orderBy('updatedAt', 'desc'), limit(50)), s => callback(s.docs.map(d => ({ id: d.id, ...d.data() } as Conversation))));
}
export function subscribeToMessages(conversationId: string, callback: (items: Message[]) => void): Unsubscribe {
  return onSnapshot(query(collection(db, 'conversations', conversationId, 'messages'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE)), s => callback(s.docs.map(d => ({ id: d.id, ...d.data() } as Message)).reverse()));
}
export async function loadOlderMessages(conversationId: string, cursor: QueryDocumentSnapshot) {
  const s = await getDocs(query(collection(db, 'conversations', conversationId, 'messages'), orderBy('createdAt', 'desc'), startAfter(cursor), limit(PAGE_SIZE)));
  return { messages: s.docs.map(d => ({ id: d.id, ...d.data() } as Message)).reverse(), cursor: s.docs.at(-1) ?? null, hasMore: s.size === PAGE_SIZE };
}
export async function sendTextMessage(conversationId: string, senderId: string, receiverId: string, text: string) {
  const cleanText = text.trim(); if (!cleanText) return;
  const message = await addDoc(collection(db, 'conversations', conversationId, 'messages'), { senderId, receiverId, type: 'text', text: cleanText, isDeleted: false, readBy: [senderId], createdAt: serverTimestamp() });
  await updateDoc(doc(db, 'conversations', conversationId), { lastMessageText: cleanText, lastMessageType: 'text', lastMessageSenderId: senderId, lastMessageAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await setDoc(doc(db, 'conversations', conversationId, 'members', receiverId), { uid: receiverId, unreadCount: increment(1) }, { merge: true });
  return message.id;
}
export async function markConversationRead(conversationId: string, uid: string) { await setDoc(doc(db, 'conversations', conversationId, 'members', uid), { uid, unreadCount: 0, lastReadAt: serverTimestamp() }, { merge: true }); }
export function searchUsers(prefix: string, callback: (items: UserProfile[]) => void): Unsubscribe { const p = prefix.trim().toLowerCase(); if (!p) { callback([]); return () => undefined; } return onSnapshot(query(collection(db, 'users'), orderBy('displayNameLowercase'), startAt(p), endAt(`${p}\uf8ff`), limit(20)), s => callback(s.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile)))); }
export async function setPresence(uid: string, online: boolean) { await setDoc(doc(db, 'users', uid), { isOnline: online, lastSeen: serverTimestamp() }, { merge: true }); }
export async function setTypingState(conversationId: string, uid: string, typing: boolean) { const ref = doc(db, 'conversations', conversationId, 'typing', uid); if (typing) await setDoc(ref, { uid, updatedAt: serverTimestamp() }); else await deleteDoc(ref).catch(() => undefined); }
export function subscribeToTyping(conversationId: string, callback: (ids: string[]) => void) { return onSnapshot(collection(db, 'conversations', conversationId, 'typing'), s => callback(s.docs.map(d => d.id))); }
export function subscribeToUser(uid: string, callback: (profile: UserProfile | null) => void) { return onSnapshot(doc(db, 'users', uid), s => callback(s.exists() ? ({ uid: s.id, ...s.data() } as UserProfile) : null)); }
