import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { QUESTIONS } from '../data/questions';
import { buildSampleAnswers } from '../data/sample';
import type { UserProgress } from '../progress/store';
import {
  assessmentRows,
  badgeRows,
  isUuid,
  progressFromRows,
  snapshotProgress,
  type AssessmentRow,
  type BadgeRow,
} from './records';

const userId = '11111111-1111-4111-8111-111111111111';

function sampleProgress(): UserProgress {
  const answers = buildSampleAnswers(QUESTIONS);
  return {
    draft: { step: 2, answers: { 'physical-scale': 8 } },
    assessments: [
      {
        id: '22222222-2222-4222-8222-222222222222',
        version: '1',
        completedAt: '2026-11-10T12:00:00.000Z',
        answers: Object.entries(answers).map(([questionId, value]) => ({ questionId, value })),
      },
    ],
    badges: {
      'recovery-protocol': {
        badgeId: 'recovery-protocol',
        status: 'completed',
        startedAt: '2026-11-01T00:00:00.000Z',
        completedAt: '2026-11-09T00:00:00.000Z',
        reflection: 'I set a 10:30 bedtime and a 6:00 wake time, and I kept both for fourteen nights.',
        proof: { method: 'self_attestation', attested: true, attestedAt: '2026-11-09T00:00:00.000Z' },
      },
    },
  };
}

test('a finished intake is Initiate and keeps raw answers through a row roundtrip', () => {
  const progress = sampleProgress();
  const snapshot = snapshotProgress(progress);
  assert.equal(snapshot.rankId, 'initiate');
  assert.equal(snapshot.domainScores.length, 12);
  assert.ok(snapshot.overall !== null && snapshot.overall > 0 && snapshot.overall <= 100);

  const restored = progressFromRows({
    assessments: assessmentRows(userId, progress),
    badges: badgeRows(userId, progress),
    draft: {
      user_id: userId,
      step: 2,
      answers: { 'physical-scale': 8 },
      updated_at: '2026-11-10T12:00:00.000Z',
    },
  });
  assert.equal(restored.assessments[0]?.id, progress.assessments[0]?.id);
  assert.equal(restored.assessments[0]?.answers.length, progress.assessments[0]?.answers.length);
  assert.equal(restored.badges['recovery-protocol']?.reflection, progress.badges['recovery-protocol']?.reflection);
  assert.equal(restored.badges['recovery-protocol']?.proof?.attested, true);
  assert.deepEqual(restored.draft, progress.draft);
  assert.equal(snapshotProgress(restored).rankId, 'initiate');
});

test('badges without an intake do not invent a stored rank', () => {
  const progress: UserProgress = {
    draft: null,
    assessments: [],
    badges: sampleProgress().badges,
  };
  assert.equal(snapshotProgress(progress).rankId, null);
  assert.deepEqual(snapshotProgress(progress).domainScores, []);
});

test('progress rows reject ids that are not uuids', () => {
  const row = assessmentRows(userId, sampleProgress())[0] as AssessmentRow;
  const restored = progressFromRows({
    assessments: [{ ...row, id: 'assessment_local' }],
    badges: [{ ...badgeRows(userId, sampleProgress())[0], status: 'nope' } as unknown as BadgeRow],
    draft: null,
  });
  assert.equal(restored.assessments.length, 0);
  assert.deepEqual(restored.badges, {});
  assert.equal(isUuid(userId), true);
  assert.equal(isUuid('local_123'), false);
});

test('the migration locks every progress table to the signed-in user', () => {
  const sql = fs.readFileSync('supabase/migrations/20261110164000_progress.sql', 'utf8');
  const tables = ['profiles', 'assessments', 'domain_scores', 'badge_progress', 'intake_drafts'];
  for (const table of tables) {
    assert.match(sql, new RegExp(`create table public\\.${table}\\b`));
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`));
    assert.match(sql, new RegExp(`alter table public\\.${table} force row level security`));
    assert.match(sql, new RegExp(`revoke all on public\\.${table} from anon`));
  }
  const policies = sql.match(/create policy [\w"]+ on public\.\w+[\s\S]*?;/g) ?? [];
  assert.ok(policies.length >= tables.length);
  for (const policy of policies) {
    assert.match(policy, /auth\.uid\(\)/);
    assert.match(policy, /to authenticated/);
  }
  assert.match(sql, /revoke all on function public\.handle_new_user\(\) from anon/);
  assert.match(sql, /revoke all on function public\.handle_new_user\(\) from authenticated/);
});
