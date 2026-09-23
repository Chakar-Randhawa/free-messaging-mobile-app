import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useCallback, useEffect } from 'react';
import { registerForPushNotificationsAsync } from '@/services/notifications';
import { sendTextMessage } from '@/services/chat';
import { useOutboxProcessor } from '@/hooks/useConnectivity';
import type { QueuedTextMessage } from '@/services/offlineQueue';

function RootNavigator() {
  const { user, loading } = useAuth();
  const resend = useCallback((item: QueuedTextMessage) => sendTextMessage(item.conversationId, item.senderId, item.receiverId, item.text).then(() => undefined), []);
  useOutboxProcessor(resend, Boolean(user));
  useEffect(() => { if (user) registerForPushNotificationsAsync(user.uid).catch(() => undefined); }, [user?.uid]);
  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color="#38bdf8" /></View>;
  if (!user) return <Redirect href="/auth/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
export default function RootLayout() { return <AuthProvider><RootNavigator /></AuthProvider>; }
const styles = StyleSheet.create({ loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#020817' } });
