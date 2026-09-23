import { useEffect, useState } from 'react';
import { searchUsers, subscribeToConversations, subscribeToMessages } from '@/services/chat';
import type { Conversation, Message, UserProfile } from '@/types/chat';

export function useConversations(uid: string | undefined) {
  const [items, setItems] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(Boolean(uid));
  useEffect(() => {
    if (!uid) { setItems([]); setLoading(false); return; }
    setLoading(true);
    return subscribeToConversations(uid, (next) => { setItems(next); setLoading(false); });
  }, [uid]);
  return { items, loading };
}

export function useMessages(conversationId: string | undefined) {
  const [items, setItems] = useState<Message[]>([]);
  useEffect(() => {
    if (!conversationId) { setItems([]); return; }
    return subscribeToMessages(conversationId, setItems);
  }, [conversationId]);
  return items;
}

export function useUserSearch(term: string, currentUid?: string) {
  const [items, setItems] = useState<UserProfile[]>([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      const unsubscribe = searchUsers(term, (users) => setItems(users.filter((item) => item.uid !== currentUid)));
      return unsubscribe;
    }, 250);
    return () => clearTimeout(timer);
  }, [term, currentUid]);
  return items;
}
