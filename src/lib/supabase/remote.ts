import type { Draft, UserProgress } from '../progress/store';
import { getSupabase } from './client';
import {
  assessmentRows,
  badgeRows,
  domainScoreRows,
  draftRow,
  isUuid,
  progressFromRows,
  rankUpdate,
  snapshotProgress,
  type AssessmentRow,
  type BadgeRow,
  type DraftRow,
} from './records';

function requireClient() {
  const client = getSupabase();
  if (!client) throw new Error('Supabase is not configured.');
  return client;
}

function fail(error: { message: string } | null, action: string): void {
  if (error) throw new Error(`Could not ${action}: ${error.message}`);
}

export async function pullProgress(userId: string): Promise<UserProgress> {
  const client = requireClient();
  const [assessments, badges, draft] = await Promise.all([
    client
      .from('assessments')
      .select('id, user_id, version, completed_at, responses, domain_scores, overall_score')
      .eq('user_id', userId)
      .order('completed_at', { ascending: true }),
    client
      .from('badge_progress')
      .select('user_id, badge_id, status, started_at, completed_at, reflection, attested, attested_at')
      .eq('user_id', userId),
    client.from('intake_drafts').select('user_id, step, answers, updated_at').eq('user_id', userId).maybeSingle(),
  ]);
  fail(assessments.error, 'load intake responses');
  fail(badges.error, 'load badge progress');
  fail(draft.error, 'load the intake draft');
  return progressFromRows({
    assessments: (assessments.data ?? []) as AssessmentRow[],
    badges: (badges.data ?? []) as BadgeRow[],
    draft: (draft.data as DraftRow | null) ?? null,
  });
}

export async function pushProgress(userId: string, progress: UserProgress, displayName: string): Promise<void> {
  const client = requireClient();
  const now = new Date().toISOString();
  const snapshot = snapshotProgress(progress);
  const assessments = assessmentRows(userId, progress).filter((row) => isUuid(row.id));
  if (assessments.length !== progress.assessments.length) {
    throw new Error('An intake record is missing a Supabase id.');
  }

  if (assessments.length > 0) {
    const saved = await client.from('assessments').upsert(assessments, { onConflict: 'id' });
    fail(saved.error, 'save intake responses');
    const scores = await client.from('domain_scores').upsert(domainScoreRows(userId, progress, now), {
      onConflict: 'user_id,domain_id',
    });
    fail(scores.error, 'save domain scores');
  }

  const badges = badgeRows(userId, progress);
  if (badges.length > 0) {
    const saved = await client.from('badge_progress').upsert(badges, { onConflict: 'user_id,badge_id' });
    fail(saved.error, 'save badge progress');
  }

  await saveDraft(userId, progress.draft, now);

  const profile = await client.from('profiles').upsert(rankUpdate(userId, displayName, snapshot.rankId, now), {
    onConflict: 'id',
  });
  fail(profile.error, 'save the current rank');
}

async function saveDraft(userId: string, draft: Draft | null, updatedAt: string): Promise<void> {
  const client = requireClient();
  if (!draft) {
    const removed = await client.from('intake_drafts').delete().eq('user_id', userId);
    fail(removed.error, 'clear the intake draft');
    return;
  }
  const saved = await client.from('intake_drafts').upsert(draftRow(userId, draft, updatedAt), { onConflict: 'user_id' });
  fail(saved.error, 'save the intake draft');
}
