export type BadgeDifficulty = 'foundation' | 'practiced' | 'demanding';

export interface Recommendable {
  id: string;
  domainId: string;
  difficulty: BadgeDifficulty;
  prerequisites: string[];
}

const DIFFICULTY_ORDER: Record<BadgeDifficulty, number> = {
  foundation: 0,
  practiced: 1,
  demanding: 2,
};

export function recommendBadges<T extends Recommendable>(input: {
  scores: { domainId: string; score: number }[];
  badges: T[];
  earnedIds: ReadonlySet<string>;
  limit?: number;
}): T[] {
  const limit = input.limit ?? 5;
  const indexed = input.scores.map((score, index) => ({ ...score, index }));
  indexed.sort((a, b) => a.score - b.score || a.index - b.index);

  const chosen: T[] = [];
  const chosenIds = new Set<string>();

  while (chosen.length < limit) {
    let added = false;
    for (const row of indexed) {
      if (chosen.length >= limit) break;
      const available = input.badges
        .filter(
          (badge) =>
            badge.domainId === row.domainId &&
            !input.earnedIds.has(badge.id) &&
            !chosenIds.has(badge.id) &&
            badge.prerequisites.every((id) => input.earnedIds.has(id)),
        )
        .sort(
          (a, b) =>
            DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] ||
            a.id.localeCompare(b.id),
        )[0];
      if (!available) continue;
      chosen.push(available);
      chosenIds.add(available.id);
      added = true;
    }
    if (!added) break;
  }

  return chosen;
}
