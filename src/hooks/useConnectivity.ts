import { useEffect, useState } from 'react';
import { processTextMessageQueue, subscribeToConnectivity } from '@/services/offlineQueue';

export function useConnectivity() {
  const [online, setOnline] = useState(true);
  useEffect(() => { const unsubscribe = subscribeToConnectivity(setOnline); return unsubscribe; }, []);
  return online;
}

export function useOutboxProcessor(send: Parameters<typeof processTextMessageQueue>[0]) {
  useEffect(() => { processTextMessageQueue(send).catch(() => undefined); const unsubscribe = subscribeToConnectivity(online => { if (online) processTextMessageQueue(send).catch(() => undefined); }); return unsubscribe; }, [send]);
}
