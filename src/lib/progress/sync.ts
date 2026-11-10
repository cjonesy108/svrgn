import { useEffect, useState } from 'react';

import { supabaseConfigState } from '../auth/mode';
import { pullProgress, pushProgress } from '../supabase/remote';
import { isUuid } from '../supabase/records';
import { useProgressStore } from './store';

/**
 * When Supabase is configured, Postgres is the record of progress.
 * Edits update the in-memory store first, then this module writes them.
 * The local session never calls it: that path stays in AsyncStorage.
 */

let acceptEdits = false;
let applyingRemote = false;
let pushToken = 0;
let accountName = '';
const timers = new Map<string, ReturnType<typeof setTimeout>>();
let bound = false;

export function bindProgressSync(): void {
  if (bound) return;
  bound = true;
  useProgressStore.subscribe((state, previous) => {
    if (applyingRemote || !acceptEdits || supabaseConfigState() !== 'ready') return;
    for (const userId of Object.keys(state.byUser)) {
      if (!isUuid(userId) || !state.dirty?.[userId] || state.byUser[userId] === previous.byUser[userId]) continue;
      schedulePush(userId, accountName);
    }
  });
}

export async function reconcileProgress(userId: string, displayName: string): Promise<void> {
  acceptEdits = false;
  accountName = displayName;
  if (!isUuid(userId) || supabaseConfigState() !== 'ready') return;
  if (useProgressStore.getState().dirty[userId]) {
    await pushNow(userId, displayName);
  }
  applyingRemote = true;
  try {
    const remote = await pullProgress(userId);
    useProgressStore.setState((state) => ({
      byUser: { ...state.byUser, [userId]: remote },
      syncError: null,
    }));
  } finally {
    applyingRemote = false;
    acceptEdits = true;
  }
}

export function useRemoteProgressReady(userId: string | undefined, displayName: string, enabled: boolean): boolean {
  const key = enabled && userId ? userId : '';
  const [seen, setSeen] = useState(key);
  const [settled, setSettled] = useState(key === '');
  if (seen !== key) {
    setSeen(key);
    setSettled(key === '');
  }
  useEffect(() => {
    bindProgressSync();
    if (!key) {
      acceptEdits = false;
      return;
    }
    let cancel = false;
    reconcileProgress(key, displayName)
      .catch((error: unknown) => {
        acceptEdits = true;
        const message = error instanceof Error ? error.message : 'Could not reach Supabase.';
        useProgressStore.setState({ syncError: message });
      })
      .finally(() => {
        if (!cancel) setSettled(true);
      });
    return () => {
      cancel = true;
    };
  }, [displayName, key]);
  return settled;
}

function schedulePush(userId: string, displayName: string): void {
  const existing = timers.get(userId);
  if (existing) clearTimeout(existing);
  timers.set(
    userId,
    setTimeout(() => {
      timers.delete(userId);
      void pushNow(userId, displayName).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Could not save progress to Supabase.';
        useProgressStore.setState({ syncError: message });
      });
    }, 250),
  );
}

async function pushNow(userId: string, displayName: string): Promise<void> {
  const token = ++pushToken;
  const progress = useProgressStore.getState().byUser[userId];
  if (!progress) return;
  await pushProgress(userId, progress, displayName);
  if (token !== pushToken) return;
  useProgressStore.setState((state) => {
    const dirty = { ...(state.dirty ?? {}) };
    delete dirty[userId];
    return { dirty, syncError: null };
  });
}
