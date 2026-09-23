import { Redirect, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { ensureDirectConversation } from '@/services/chat';
import { useConversations, useUserSearch } from '@/hooks/useChat';
import type { UserProfile } from '@/types/chat';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [term, setTerm] = useState('');
  const { items, loading } = useConversations(user?.uid);
  const users = useUserSearch(term, user?.uid);
  const searching = term.trim().length > 0;

  if (!user) return <Redirect href="/auth/login" />;

  async function openUser(profile: UserProfile) {
    const conversationId = await ensureDirectConversation(user.uid, profile.uid);
    setTerm('');
    router.push({ pathname: '/chat/[conversationId]', params: { conversationId, otherUid: profile.uid, otherName: profile.displayName } });
  }

  return <View style={styles.screen}>
    <View style={styles.header}><View><Text style={styles.eyebrow}>MESSAGES</Text><Text style={styles.title}>Chats</Text></View><Pressable onPress={logout}><Text style={styles.logout}>Sign out</Text></Pressable></View>
    <TextInput style={styles.search} placeholder="Search people by display name" placeholderTextColor="#64748b" value={term} onChangeText={setTerm} />
    {searching ? <FlatList data={users} keyExtractor={(item) => item.uid} ListEmptyComponent={<Text style={styles.empty}>No users found.</Text>} renderItem={({ item }) => <Pressable style={styles.row} onPress={() => openUser(item)}><View style={styles.avatar}><Text style={styles.avatarText}>{item.displayName.charAt(0).toUpperCase()}</Text></View><View><Text style={styles.name}>{item.displayName}</Text><Text style={styles.email}>{item.email}</Text></View></Pressable>} /> : loading ? <ActivityIndicator color="#38bdf8" style={styles.loader} /> : <FlatList data={items} keyExtractor={(item) => item.id} ListEmptyComponent={<Text style={styles.empty}>Search for someone to start chatting.</Text>} renderItem={({ item }) => { const otherUid = item.participantIds.find((id) => id !== user.uid); return <Pressable style={styles.row} onPress={() => otherUid && router.push({ pathname: '/chat/[conversationId]', params: { conversationId: item.id, otherUid } })}><View style={styles.avatar}><Text style={styles.avatarText}>?</Text></View><View style={styles.conversation}><Text style={styles.name}>Conversation</Text><Text style={styles.preview} numberOfLines={1}>{item.lastMessageText || 'No messages yet'}</Text></View><Text style={styles.time}>{formatTime(item.lastMessageAt?.toDate())}</Text></Pressable>; }} />}
  </View>;
}
function formatTime(value?: Date) { return value ? value.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''; }
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#020817', padding: 20, paddingTop: 64 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }, eyebrow: { color: '#38bdf8', letterSpacing: 2, fontWeight: '700' }, title: { color: '#f8fafc', fontSize: 34, fontWeight: '800', marginTop: 6 }, logout: { color: '#94a3b8', fontWeight: '700' }, search: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, padding: 15, color: '#f8fafc', marginBottom: 12 }, row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#0f172a', gap: 12 }, avatar: { height: 48, width: 48, borderRadius: 24, backgroundColor: '#164e63', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#e0f2fe', fontSize: 19, fontWeight: '800' }, name: { color: '#f8fafc', fontSize: 16, fontWeight: '700' }, email: { color: '#64748b', marginTop: 4 }, conversation: { flex: 1 }, preview: { color: '#94a3b8', marginTop: 4 }, time: { color: '#64748b', fontSize: 12 }, empty: { color: '#64748b', textAlign: 'center', marginTop: 70, lineHeight: 22 }, loader: { marginTop: 60 } });
