import assert from 'node:assert/strict';
import test from 'node:test';

import { BADGES } from '../data/badges';
import { RANKS } from '../data/ranks';
import {
  CARD_TEXT_WIDTH,
  badgeCountLabel,
  cardFileName,
  estimateWidth,
  wrapText,
} from './layout';

test('badge and rank copy fits the share card', () => {
  for (const badge of BADGES) {
    const title = wrapText(badge.title, 56, CARD_TEXT_WIDTH, 3, 0, true);
    assert.ok(title.length >= 1 && title.length <= 3, badge.title);
    for (const line of title) {
      assert.ok(estimateWidth(line, 56, 0, true) <= CARD_TEXT_WIDTH, line);
    }
    const description = wrapText(badge.description, 28, CARD_TEXT_WIDTH, 4);
    assert.ok(description.length >= 1 && description.length <= 4, badge.description);
    for (const line of description) {
      assert.ok(estimateWidth(line, 28) <= CARD_TEXT_WIDTH, line);
    }
  }
  for (const rank of RANKS) {
    const name = wrapText(rank.name, 100, CARD_TEXT_WIDTH, 1, 0, true);
    assert.equal(name.length, 1, rank.name);
    const summary = wrapText(rank.summary, 30, CARD_TEXT_WIDTH, 4);
    assert.ok(summary.length >= 1 && summary.length <= 4, rank.summary);
  }
});

test('a clipped line keeps the ellipsis inside the width', () => {
  const lines = wrapText('Write the situations where you will hire a lawyer before you act.', 28, 280, 1);
  assert.equal(lines.length, 1);
  assert.match(lines[0] ?? '', /…$/);
  assert.ok(estimateWidth(lines[0] ?? '', 28) <= 280);
});

test('file names stay plain and kind-specific', () => {
  assert.equal(cardFileName('badge', 'Recovery Protocol Established'), 'sovereign-path-badge-recovery-protocol-established.png');
  assert.equal(cardFileName('rank', 'Initiate'), 'sovereign-path-rank-initiate.png');
  assert.equal(badgeCountLabel(1), '1 badge earned');
  assert.equal(badgeCountLabel(0), '0 badges earned');
});
