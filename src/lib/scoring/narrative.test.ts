import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildNarrative } from './narrative';

test('names strengths at 70 and the three widest gaps', () => {
  const narrative = buildNarrative([
    { name: 'Physical', score: 84 },
    { name: 'Financial', score: 20 },
    { name: 'Practical', score: 55 },
    { name: 'Local', score: 22 },
    { name: 'Digital', score: 71 },
  ]);
  assert.deepEqual(narrative.strengthNames, ['Physical', 'Digital']);
  assert.deepEqual(narrative.gapNames, ['Financial', 'Local', 'Practical']);
  assert.match(narrative.paragraphs[0] ?? '', /Physical and Digital/);
});

test('a flat low baseline does not invent a strength', () => {
  const narrative = buildNarrative([
    { name: 'Physical', score: 40 },
    { name: 'Financial', score: 30 },
  ]);
  assert.deepEqual(narrative.strengthNames, []);
  assert.match(narrative.paragraphs[0] ?? '', /No domain is strong yet/);
});
