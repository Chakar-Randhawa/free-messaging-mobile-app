import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true }) });

export async function registerForPushNotificationsAsync(uid?: string): Promise<string | null> {
  if (!uid || !Device.isDevice) return null;
  const existing = await Notifications.getPermissionsAsync();
  const status = existing.status === 'granted' ? existing.status : (await Notifications.requestPermissionsAsync()).status;
  if (status !== 'granted') return null;
  if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync('messages', { name: 'Messages', importance: Notifications.AndroidImportance.HIGH, sound: 'default' });
  const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
  if (!projectId) return null;
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  await setDoc(doc(db, 'users', uid, 'pushTokens', encodeURIComponent(token)), { token, platform: Platform.OS, updatedAt: serverTimestamp() }, { merge: true });
  return token;
}
export function subscribeToNotificationResponse(callback: (response: Notifications.NotificationResponse) => void) { return Notifications.addNotificationResponseReceivedListener(callback); }
