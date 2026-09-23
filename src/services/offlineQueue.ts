import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const QUEUE_KEY = '@free-messaging/outbox-v1';
export type QueuedTextMessage = { id: string; conversationId: string; senderId: string; receiverId: string; text: string; createdAt: number; attempts: number };

async function readQueue(): Promise<QueuedTextMessage[]> { const raw = await AsyncStorage.getItem(QUEUE_KEY); if (!raw) return []; try { return JSON.parse(raw) as QueuedTextMessage[]; } catch { return []; } }
async function writeQueue(items: QueuedTextMessage[]) { await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(items)); }
export async function enqueueTextMessage(item: Omit<QueuedTextMessage, 'attempts'>) { const queue = await readQueue(); queue.push({ ...item, attempts: 0 }); await writeQueue(queue); }
export async function getQueuedTextMessages() { return readQueue(); }
export async function removeQueuedTextMessage(id: string) { await writeQueue((await readQueue()).filter(item => item.id !== id)); }
export function subscribeToConnectivity(callback: (online: boolean) => void) { return NetInfo.addEventListener(state => callback(Boolean(state.isConnected && state.isInternetReachable !== false))); }

let processing = false;
export async function processTextMessageQueue(send: (item: QueuedTextMessage) => Promise<void>) {
  if (processing) return; processing = true;
  try {
    const state = await NetInfo.fetch(); if (!state.isConnected) return;
    for (const item of await readQueue()) {
      try { await send(item); await removeQueuedTextMessage(item.id); }
      catch { const queue = await readQueue(); const current = queue.find(q => q.id === item.id); if (current) { current.attempts += 1; if (current.attempts >= 5) await removeQueuedTextMessage(item.id); else await writeQueue(queue); } }
    }
  } finally { processing = false; }
}
