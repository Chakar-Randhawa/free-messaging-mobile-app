import { useCallback, useEffect, useState } from 'react';
import { searchUsers, subscribeToConversations, subscribeToMessages, subscribeToTyping, loadOlderMessages, type OlderMessagesResult } from '@/services/chat';
import type { Conversation, Message, UserProfile } from '@/types/chat';

export function useConversations(uid?: string) { const [items, setItems] = useState<Conversation[]>([]); const [loading, setLoading] = useState(!!uid); useEffect(() => { if (!uid) { setItems([]); setLoading(false); return; } setLoading(true); return subscribeToConversations(uid, v => { setItems(v); setLoading(false); }); }, [uid]); return { items, loading }; }

export function useMessages(id?: string) {
  const [items, setItems] = useState<Message[]>([]); const [loading, setLoading] = useState(!!id); const [loadingOlder, setLoadingOlder] = useState(false); const [hasMore, setHasMore] = useState(true);
  useEffect(() => { if (!id) { setItems([]); setHasMore(false); return; } setLoading(true); setHasMore(true); return subscribeToMessages(id, v => { setItems(v); setLoading(false); setHasMore(v.length >= 30); }); }, [id]);
  const loadOlder = useCallback(async (): Promise<OlderMessagesResult | null> => { const oldest = items[0]?.createdAt; if (!id || !oldest || loadingOlder || !hasMore) return null; setLoadingOlder(true); try { const result = await loadOlderMessages(id, oldest); setItems(current => [...result.messages, ...current.filter(message => !result.messages.some(old => old.id === message.id))]); setHasMore(result.hasMore); return result; } finally { setLoadingOlder(false); } }, [id, items, loadingOlder, hasMore]);
  return { items, loading, loadingOlder, hasMore, loadOlder };
}

export function useUserSearch(term: string, currentUid?: string) { const [items, setItems] = useState<UserProfile[]>([]); useEffect(() => { const timer = setTimeout(() => { const unsubscribe = searchUsers(term, users => setItems(users.filter(u => u.uid !== currentUid))); return unsubscribe; }, 250); return () => clearTimeout(timer); }, [term, currentUid]); return items; }
export function useTypingState(id?: string) { const [ids, setIds] = useState<string[]>([]); useEffect(() => { if (!id) { setIds([]); return; } return subscribeToTyping(id, setIds); }, [id]); return ids; }
