import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { sendTextMessage } from '@/services/chat';
import { useMessages } from '@/hooks/useChat';

export default function ChatScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ conversationId: string; otherUid?: string; otherName?: string }>();
  const conversationId = String(params.conversationId || '');
  const otherUid = String(params.otherUid || '');
  const otherName = String(params.otherName || 'Chat');
  const messages = useMessages(conversationId);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  if (!user) return null;

  async function send() {
    if (!text.trim() || !otherUid || sending) return;
    const outgoing = text;
    setText(''); setSending(true);
    try { await sendTextMessage(conversationId, user.uid, otherUid, outgoing); } finally { setSending(false); }
  }

  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
    <View style={styles.header}><Pressable onPress={() => router.back()}><Text style={styles.back}>‹</Text></Pressable><Text style={styles.title}>{otherName}</Text><View style={styles.spacer} /></View>
    <FlatList data={messages} keyExtractor={(item) => item.id} contentContainerStyle={styles.messages} ListEmptyComponent={<Text style={styles.empty}>No messages yet. Say hello!</Text>} renderItem={({ item }) => <View style={[styles.bubble, item.senderId === user.uid ? styles.mine : styles.theirs]}><Text style={styles.message}>{item.isDeleted ? 'Message deleted' : item.text}</Text>{item.createdAt && <Text style={styles.timestamp}>{item.createdAt.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>}</View>} />
    <View style={styles.composer}><TextInput style={styles.input} placeholder="Message" placeholderTextColor="#64748b" value={text} onChangeText={setText} multiline maxLength={4000} /><Pressable style={styles.send} onPress={send} disabled={sending}>{sending ? <ActivityIndicator color="#020817" size="small" /> : <Text style={styles.sendText}>Send</Text>}</Pressable></View>
  </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#020817' }, header: { paddingTop: 54, paddingHorizontal: 18, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#0f172a' }, back: { color: '#38bdf8', fontSize: 38, lineHeight: 34, width: 40 }, title: { color: '#f8fafc', fontSize: 20, fontWeight: '800', flex: 1, textAlign: 'center' }, spacer: { width: 40 }, messages: { padding: 16, gap: 10, flexGrow: 1, justifyContent: 'flex-end' }, empty: { color: '#64748b', textAlign: 'center', marginBottom: 30 }, bubble: { maxWidth: '82%', padding: 11, borderRadius: 16 }, mine: { alignSelf: 'flex-end', backgroundColor: '#0369a1', borderBottomRightRadius: 4 }, theirs: { alignSelf: 'flex-start', backgroundColor: '#1e293b', borderBottomLeftRadius: 4 }, message: { color: '#f8fafc', fontSize: 16, lineHeight: 21 }, timestamp: { color: '#bae6fd', fontSize: 10, marginTop: 4, alignSelf: 'flex-end' }, composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#0f172a' }, input: { flex: 1, maxHeight: 110, backgroundColor: '#0f172a', borderRadius: 18, paddingHorizontal: 15, paddingVertical: 11, color: '#f8fafc' }, send: { backgroundColor: '#38bdf8', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 12 }, sendText: { color: '#020817', fontWeight: '800' } });
