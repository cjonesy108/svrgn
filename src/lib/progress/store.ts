import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { supabaseConfigState } from '../auth/mode';
import { getBadge } from '../data/badges';
import { ASSESSMENT_VERSION, QUESTIONS } from '../data/questions';
import type { RawAnswer } from '../scoring/engine';
import { isUuid } from '../supabase/records';
import { validateCompletion } from './rules';

export interface UserBadgeRecord {
  badgeId: string;
  status: 'in_progress' | 'completed';
  startedAt: string;
  completedAt?: string;
  reflection?: string;
  proof?: {
    method: 'self_attestation';
    attested: true;
    attestedAt: string;
  };
}

export interface AssessmentRecord {
  id: string;
  version: string;
  completedAt: string;
  answers: RawAnswer[];
}

export interface Draft {
  step: number;
  answers: Record<string, string | number>;
}

export interface UserProgress {
  draft: Draft | null;
  assessments: AssessmentRecord[];
  badges: Record<string, UserBadgeRecord>;
}

interface ProgressState {
  byUser: Record<string, UserProgress>;
  /** User ids with edits that have not been confirmed by Supabase. */
  dirty: Record<string, true>;
  syncError: string | null;
  setDraft: (userId: string, draft: Draft) => void;
  completeAssessment: (userId: string, answers: RawAnswer[]) => { ok: true } | { ok: false; reason: string };
  startBadge: (userId: string, badgeId: string) => { ok: true } | { ok: false; reason: string };
  completeBadge: (
    userId: string,
    badgeId: string,
    reflection: string,
    attested: boolean,
  ) => { ok: true } | { ok: false; reason: string };
}

const EMPTY_PROGRESS: UserProgress = { draft: null, assessments: [], badges: {} };

function blankProgress(): UserProgress {
  return { draft: null, assessments: [], badges: {} };
}

function createId(): string {
  return Crypto.randomUUID();
}

function current(byUser: Record<string, UserProgress>, userId: string): UserProgress {
  return byUser[userId] ?? blankProgress();
}

function writeProgress(
  set: (partial: Partial<ProgressState> | ((state: ProgressState) => Partial<ProgressState>)) => void,
  userId: string,
  progress: UserProgress,
) {
  const track = isUuid(userId) && supabaseConfigState() === 'ready';
  set((state) => ({
    byUser: { ...state.byUser, [userId]: progress },
    dirty: track ? { ...state.dirty, [userId]: true } : state.dirty,
  }));
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      byUser: {},
      dirty: {},
      syncError: null,
      setDraft: (userId, draft) => {
        const progress = current(get().byUser, userId);
        writeProgress(set, userId, { ...progress, draft });
      },
      completeAssessment: (userId, answers) => {
        const missing = QUESTIONS.some((question) => {
          const answer = answers.find((item) => item.questionId === question.id);
          return !answer || answer.value === '' || answer.value === undefined;
        });
        if (missing) return { ok: false, reason: 'Answer every question before you submit.' };
        const progress = current(get().byUser, userId);
        const record: AssessmentRecord = {
          id: createId(),
          version: ASSESSMENT_VERSION,
          completedAt: new Date().toISOString(),
          answers,
        };
        writeProgress(set, userId, {
          ...progress,
          draft: null,
          assessments: [...progress.assessments, record],
        });
        return { ok: true };
      },
      startBadge: (userId, badgeId) => {
        const badge = getBadge(badgeId);
        if (!badge) return { ok: false, reason: 'That badge is not in the catalog.' };
        const progress = current(get().byUser, userId);
        const existing = progress.badges[badgeId];
        if (existing?.status === 'completed') return { ok: false, reason: 'This badge is already complete.' };
        const earnedIds = new Set(
          Object.values(progress.badges)
            .filter((item) => item.status === 'completed')
            .map((item) => item.badgeId),
        );
        if (badge.prerequisites.some((id) => !earnedIds.has(id))) {
          return { ok: false, reason: 'Finish the prerequisite badges first.' };
        }
        if (existing?.status === 'in_progress') return { ok: true };
        writeProgress(set, userId, {
          ...progress,
          badges: {
            ...progress.badges,
            [badgeId]: {
              badgeId,
              status: 'in_progress',
              startedAt: new Date().toISOString(),
            },
          },
        });
        return { ok: true };
      },
      completeBadge: (userId, badgeId, reflection, attested) => {
        const badge = getBadge(badgeId);
        const progress = current(get().byUser, userId);
        const earnedIds = new Set(
          Object.values(progress.badges)
            .filter((item) => item.status === 'completed')
            .map((item) => item.badgeId),
        );
        const verdict = validateCompletion({
          badge,
          earnedIds,
          alreadyCompleted: progress.badges[badgeId]?.status === 'completed',
          attested,
          reflection,
        });
        if (!verdict.ok) return verdict;
        const existing = progress.badges[badgeId];
        const completedAt = new Date().toISOString();
        writeProgress(set, userId, {
          ...progress,
          badges: {
            ...progress.badges,
            [badgeId]: {
              badgeId,
              status: 'completed',
              startedAt: existing?.startedAt ?? completedAt,
              completedAt,
              reflection: reflection.trim(),
              proof: { method: 'self_attestation', attested: true, attestedAt: completedAt },
            },
          },
        });
        return { ok: true };
      },
    }),
    {
      name: 'sovereign-path.progress.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ byUser: state.byUser, dirty: state.dirty }),
    },
  ),
);

export function useUserProgress(userId: string | undefined): UserProgress {
  return useProgressStore((state) => (userId ? (state.byUser[userId] ?? EMPTY_PROGRESS) : EMPTY_PROGRESS));
}

export function useProgressHydrated(): boolean {
  const [hydrated, setHydrated] = useState(useProgressStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = useProgressStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useProgressStore.persist.hasHydrated());
    return unsub;
  }, []);
  return hydrated;
}
