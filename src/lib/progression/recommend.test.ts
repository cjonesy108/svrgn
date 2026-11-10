import assert from 'node:assert/strict';
import { test } from 'node:test';

import { recommendBadges, type Recommendable } from './recommend';

const badges: Recommendable[] = [
  { id: 'fin-base', domainId: 'financial', difficulty: 'foundation', prerequisites: [] },
  { id: 'fin-hard', domainId: 'financial', difficulty: 'demanding', prerequisites: ['fin-base'] },
  { id: 'phy-base', domainId: 'physical', difficulty: 'foundation', prerequisites: [] },
  { id: 'loc-base', domainId: 'local', difficulty: 'foundation', prerequisites: [] },
];

test('starts with the weakest domain and skips locked badges', () => {
  const picked = recommendBadges({
    scores: [
      { domainId: 'financial', score: 10 },
      { domainId: 'local', score: 40 },
      { domainId: 'physical', score: 90 },
    ],
    badges,
    earnedIds: new Set(['fin-base']),
    limit: 3,
  });
  assert.deepEqual(
    picked.map((badge) => badge.id),
    ['fin-hard', 'loc-base', 'phy-base'],
  );
});

test('does not recommend an earned badge or a badge whose prerequisite is open', () => {
  const picked = recommendBadges({
    scores: [{ domainId: 'financial', score: 10 }],
    badges: badges.filter((badge) => badge.domainId === 'financial'),
    earnedIds: new Set(),
    limit: 5,
  });
  assert.deepEqual(
    picked.map((badge) => badge.id),
    ['fin-base'],
  );
});
