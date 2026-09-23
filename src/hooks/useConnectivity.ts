import { useCallback, useEffect } from 'react';
import { processTextMessageQueue, subscribeToConnectivity, type QueuedTextMessage } from '@/services/offlineQueue';
export function useOutboxProcessor(send: (item: QueuedTextMessage) => Promise<void>, enabled: boolean) { const run = useCallback(() => { if (enabled) processTextMessageQueue(send).catch(() => undefined); }, [enabled, send]); useEffect(() => { if (!enabled) return; run(); return subscribeToConnectivity(online => { if (online) run(); }); }, [enabled, run]); }
