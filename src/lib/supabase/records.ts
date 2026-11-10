import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import { RANKS } from '../data/ranks';
import { earnedFromProgress } from '../progress/selectors';
import type { AssessmentRecord, Draft, UserBadgeRecord, UserProgress } from '../progress/store';
import { evaluateRank } from '../progression/evaluate';
import { scoreAssessment, type RawAnswer } from '../scoring/engine';

export interface StoredDomainScore {
  domainId: string;
  score: number;
}

export interface ProgressSnapshot {
  rankId: string | null;
  overall: number | null;
  domainScores: StoredDomainScore[];
}

export interface AssessmentRow {
  id: string;
  user_id: string;
  version: string;
  completed_at: string;
  responses: RawAnswer[];
  domain_scores: StoredDomainScore[];
  overall_score: number;
}

export interface DomainScoreRow {
  user_id: string;
  domain_id: string;
  score: number;
  assessment_id: string;
  updated_at: string;
}

export interface BadgeRow {
  user_id: string;
  badge_id: string;
  status: 'in_progress' | 'completed';
  started_at: string;
  completed_at: string | null;
  reflection: string | null;
  attested: boolean;
  attested_at: string | null;
}

export interface DraftRow {
  user_id: string;
  step: number;
  answers: Record<string, string | number>;
  updated_at: string;
}

export interface ProfileRankRow {
  id: string;
  display_name: string;
  current_rank_id: string | null;
  updated_at: string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID.test(value);
}

/** Scores and rank written to Postgres. The UI still scores from raw answers. */
export function snapshotProgress(progress: UserProgress): ProgressSnapshot {
  const latest = progress.assessments[progress.assessments.length - 1];
  if (!latest) {
    return { rankId: null, overall: null, domainScores: [] };
  }
  const scored = scoreAssessment(QUESTIONS, latest.answers);
  const rank = evaluateRank({
    assessmentCompleted: true,
    earned: earnedFromProgress(progress),
    ranks: RANKS,
    domains: DOMAINS,
  });
  return {
    rankId: rank.current?.id ?? null,
    overall: scored.overall,
    domainScores: scored.domains.map((domain) => ({ domainId: domain.domainId, score: domain.score })),
  };
}

export function assessmentRows(userId: string, progress: UserProgress): AssessmentRow[] {
  return progress.assessments.map((record) => {
    const scored = scoreAssessment(QUESTIONS, record.answers);
    return {
      id: record.id,
      user_id: userId,
      version: record.version,
      completed_at: record.completedAt,
      responses: record.answers,
      domain_scores: scored.domains.map((domain) => ({ domainId: domain.domainId, score: domain.score })),
      overall_score: scored.overall,
    };
  });
}

export function domainScoreRows(userId: string, progress: UserProgress, updatedAt: string): DomainScoreRow[] {
  const latest = progress.assessments[progress.assessments.length - 1];
  if (!latest) return [];
  const scored = scoreAssessment(QUESTIONS, latest.answers);
  return scored.domains.map((domain) => ({
    user_id: userId,
    domain_id: domain.domainId,
    score: domain.score,
    assessment_id: latest.id,
    updated_at: updatedAt,
  }));
}

export function badgeRows(userId: string, progress: UserProgress): BadgeRow[] {
  return Object.values(progress.badges).map((record) => ({
    user_id: userId,
    badge_id: record.badgeId,
    status: record.status,
    started_at: record.startedAt,
    completed_at: record.completedAt ?? null,
    reflection: record.reflection ?? null,
    attested: record.proof?.attested ?? false,
    attested_at: record.proof?.attestedAt ?? null,
  }));
}

export function draftRow(userId: string, draft: Draft, updatedAt: string): DraftRow {
  return {
    user_id: userId,
    step: draft.step,
    answers: draft.answers,
    updated_at: updatedAt,
  };
}

export function progressFromRows(input: {
  assessments: AssessmentRow[];
  badges: BadgeRow[];
  draft: DraftRow | null;
}): UserProgress {
  const assessments = [...input.assessments]
    .filter((row) => isUuid(row.id) && Array.isArray(row.responses))
    .sort((a, b) => a.completed_at.localeCompare(b.completed_at))
    .map(assessmentFromRow);
  const badges: Record<string, UserBadgeRecord> = {};
  for (const row of input.badges) {
    const record = badgeFromRow(row);
    if (record) badges[record.badgeId] = record;
  }
  return {
    draft: input.draft ? { step: input.draft.step, answers: input.draft.answers ?? {} } : null,
    assessments,
    badges,
  };
}

function assessmentFromRow(row: AssessmentRow): AssessmentRecord {
  return {
    id: row.id,
    version: row.version,
    completedAt: row.completed_at,
    answers: row.responses.map((answer) => ({
      questionId: String(answer.questionId),
      value: answer.value,
    })),
  };
}

function badgeFromRow(row: BadgeRow): UserBadgeRecord | null {
  if (row.status !== 'in_progress' && row.status !== 'completed') return null;
  if (!row.badge_id || !row.started_at) return null;
  const record: UserBadgeRecord = {
    badgeId: row.badge_id,
    status: row.status,
    startedAt: row.started_at,
  };
  if (row.completed_at) record.completedAt = row.completed_at;
  if (row.reflection) record.reflection = row.reflection;
  if (row.attested && row.attested_at) {
    record.proof = { method: 'self_attestation', attested: true, attestedAt: row.attested_at };
  }
  return record;
}

export function rankUpdate(userId: string, displayName: string, rankId: string | null, updatedAt: string): ProfileRankRow {
  return {
    id: userId,
    display_name: displayName,
    current_rank_id: rankId,
    updated_at: updatedAt,
  };
}
