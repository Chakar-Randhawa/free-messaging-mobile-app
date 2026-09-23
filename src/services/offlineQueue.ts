import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const QUEUE_KEY = '@free-messaging/outbox-v1';
export type QueuedTextMessage = { id: string; conversationId: string; senderId: string; receiverId: string; text: string; createdAt: number; attempts: number };
async function readQueue(): Promise<QueuedTextMessage[]> { try { const raw = await AsyncStorage.getItem(QUEUE_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } }
async function writeQueue(items: QueuedTextMessage[]) { await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(items)); }
export async function enqueueTextMessage(item: Omit<QueuedTextMessage, 'attempts'>) { const queue = await readQueue(); if (!queue.some(existing => existing.id === item.id)) { queue.push({ ...item, attempts: 0 }); await writeQueue(queue); } }
export async function removeQueuedTextMessage(id: string) { await writeQueue((await readQueue()).filter(item => item.id !== id)); }
export function subscribeToConnectivity(callback: (online: boolean) => void) { return NetInfo.addEventListener(state => callback(state.isConnected === true && state.isInternetReachable !== false)); }
let processing = false;
export async function processTextMessageQueue(send: (item: QueuedTextMessage) => Promise<void>) { if (processing) return; processing = true; try { if (!(await NetInfo.fetch()).isConnected) return; for (const item of await readQueue()) { try { await send(item); await removeQueuedTextMessage(item.id); } catch { const queue = await readQueue(); const current = queue.find(q => q.id === item.id); if (current) { current.attempts += 1; if (current.attempts >= 5) await removeQueuedTextMessage(item.id); else await writeQueue(queue); } } } } finally { processing = false; } }
