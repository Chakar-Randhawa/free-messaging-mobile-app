import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string;
  displayNameLowercase: string;
  photoUrl: string | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type Conversation = {
  id: string;
  participantIds: string[];
  lastMessageText?: string;
  lastMessageType?: 'text' | 'image' | 'video' | 'document';
  lastMessageAt?: Timestamp;
  lastMessageSenderId?: string;
  updatedAt?: Timestamp;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  type: 'text' | 'image' | 'video' | 'document';
  text?: string;
  createdAt?: Timestamp;
  isDeleted?: boolean;
};
