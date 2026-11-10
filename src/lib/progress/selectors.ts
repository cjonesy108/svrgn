import { getBadge } from '../data/badges';
import type { EarnedBadge } from '../progression/evaluate';
import type { UserBadgeRecord, UserProgress } from './store';

export function latestAssessment(progress: UserProgress) {
  return progress.assessments[progress.assessments.length - 1] ?? null;
}

export function earnedFromProgress(progress: UserProgress): EarnedBadge[] {
  const earned: EarnedBadge[] = [];
  for (const record of Object.values(progress.badges)) {
    if (record.status !== 'completed') continue;
    const badge = getBadge(record.badgeId);
    if (badge) earned.push({ id: badge.id, domainId: badge.domainId });
  }
  return earned;
}

export function recordsByStatus(progress: UserProgress, status: UserBadgeRecord['status']): UserBadgeRecord[] {
  return Object.values(progress.badges)
    .filter((record) => record.status === status)
    .sort((a, b) => (b.completedAt ?? b.startedAt).localeCompare(a.completedAt ?? a.startedAt));
}
