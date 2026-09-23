import type { Timestamp } from 'firebase/firestore';

export type UserProfile = { uid: string; email: string | null; displayName: string; displayNameLowercase: string; photoUrl: string | null; isOnline?: boolean; lastSeen?: Timestamp; createdAt?: Timestamp; updatedAt?: Timestamp };
export type MemberState = { uid: string; unreadCount?: number; lastReadAt?: Timestamp; joinedAt?: Timestamp };
export type Conversation = { id: string; participantIds: string[]; type?: 'direct'; lastMessageText?: string; lastMessageType?: 'text' | 'image' | 'video' | 'document'; lastMessageAt?: Timestamp; lastMessageSenderId?: string; updatedAt?: Timestamp };
export type Message = { id: string; senderId: string; receiverId: string; type: 'text' | 'image' | 'video' | 'document'; text?: string; createdAt?: Timestamp; readBy?: string[]; isDeleted?: boolean };
