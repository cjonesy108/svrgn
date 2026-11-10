import assert from 'node:assert/strict';
import { test } from 'node:test';

import { DOMAINS } from '../data/domains';
import { RANKS } from '../data/ranks';
import type { EarnedBadge } from './evaluate';
import { evaluateRank } from './evaluate';

function mint(domainId: string, count: number, start = 0): EarnedBadge[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${domainId}-${start + index}`,
    domainId,
  }));
}

function personal(countEach: number): EarnedBadge[] {
  return DOMAINS.filter((domain) => domain.layer === 'personal').flatMap((domain) =>
    mint(domain.id, countEach),
  );
}

function civic(countEach: number): EarnedBadge[] {
  return DOMAINS.filter((domain) => domain.layer === 'civic').flatMap((domain) =>
    mint(domain.id, countEach),
  );
}

function rankFor(earned: EarnedBadge[], assessmentCompleted: boolean) {
  return evaluateRank({ assessmentCompleted, earned, ranks: RANKS, domains: DOMAINS });
}

test('badges without an intake do not grant a rank', () => {
  const snapshot = rankFor([...personal(3), ...civic(2), ...mint('physical', 20, 10)], false);
  assert.equal(snapshot.current, null);
  assert.equal(snapshot.next?.id, 'initiate');
});

test('the intake alone is Initiate', () => {
  const snapshot = rankFor([], true);
  assert.equal(snapshot.current?.id, 'initiate');
  assert.equal(snapshot.next?.id, 'apprentice');
});

test('eight badges in one domain stay at Initiate', () => {
  const snapshot = rankFor(mint('physical', 8), true);
  assert.equal(snapshot.current?.id, 'initiate');
  assert.equal(snapshot.checks.some((check) => check.met === false), true);
});

test('eight badges covering every personal domain reach Apprentice', () => {
  const earned = [...personal(1), ...mint('physical', 2, 5)];
  assert.equal(earned.length, 8);
  const snapshot = rankFor(earned, true);
  assert.equal(snapshot.current?.id, 'apprentice');
  assert.equal(snapshot.next?.id, 'journeyman');
});

test('Journeyman needs 20 badges, personal coverage, and 3 civic badges', () => {
  const shortCivic = [...personal(3), ...civic(0), ...mint('systems', 2)];
  assert.equal(shortCivic.length >= 20, true);
  assert.equal(rankFor(shortCivic, true).current?.id, 'apprentice');

  const ready = [
    ...personal(2),
    ...mint('physical', 5, 10),
    ...mint('systems', 1),
    ...mint('local', 1),
    ...mint('rights', 1),
  ];
  assert.equal(ready.length, 20);
  assert.equal(rankFor(ready, true).current?.id, 'journeyman');
});

test('Adept fails when a civic domain is empty', () => {
  const civicDomains = DOMAINS.filter((domain) => domain.layer === 'civic');
  const skipped = civicDomains[0]?.id ?? 'systems';
  const earned = [
    ...personal(2),
    ...civicDomains.filter((domain) => domain.id !== skipped).flatMap((domain) => mint(domain.id, 1)),
    ...mint('physical', 18, 10),
  ];
  assert.equal(earned.length, 35);
  const snapshot = rankFor(earned, true);
  assert.equal(snapshot.current?.id, 'journeyman');
  assert.equal(snapshot.next?.id, 'adept');
});

test('Sovereign is the last rank when the example thresholds are met', () => {
  const earned = [...personal(3), ...civic(2), ...mint('physical', 20, 10)];
  assert.equal(earned.length, 50);
  const snapshot = rankFor(earned, true);
  assert.equal(snapshot.current?.id, 'sovereign');
  assert.equal(snapshot.next, null);
  assert.equal(snapshot.checks.every((check) => check.met), true);
});
