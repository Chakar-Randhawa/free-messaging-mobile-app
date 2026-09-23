import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { Expo } from 'expo-server-sdk';

initializeApp();
const expo = new Expo();

export const notifyNewMessage = onDocumentCreated('conversations/{conversationId}/messages/{messageId}', async event => {
  const message = event.data?.data();
  if (!message || message.type !== 'text' || !message.receiverId) return;
  const tokens = await getFirestore().collection('users').doc(message.receiverId).collection('pushTokens').get();
  const messages = tokens.docs.map(doc => doc.data().token).filter((token): token is string => Expo.isExpoPushToken(token)).map(to => ({ to, sound: 'default' as const, title: 'New message', body: String(message.text || 'New message').slice(0, 120), data: { conversationId: event.params.conversationId } }));
  for (const chunk of expo.chunkPushNotifications(messages)) { try { await expo.sendPushNotificationsAsync(chunk); } catch (error) { console.error('Push delivery failed', error); } }
});
