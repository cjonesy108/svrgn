import assert from 'node:assert/strict';
import { test } from 'node:test';

import { validateCompletion } from './rules';

const badge = { prerequisites: ['recovery-protocol'] };

test('completion requires attestation, prerequisites, and a real reflection', () => {
  assert.equal(
    validateCompletion({
      badge,
      earnedIds: new Set(),
      alreadyCompleted: false,
      attested: true,
      reflection: 'x'.repeat(40),
    }).ok,
    false,
  );
  assert.equal(
    validateCompletion({
      badge,
      earnedIds: new Set(['recovery-protocol']),
      alreadyCompleted: false,
      attested: false,
      reflection: 'x'.repeat(40),
    }).ok,
    false,
  );
  assert.equal(
    validateCompletion({
      badge,
      earnedIds: new Set(['recovery-protocol']),
      alreadyCompleted: false,
      attested: true,
      reflection: 'too short',
    }).ok,
    false,
  );
  assert.deepEqual(
    validateCompletion({
      badge,
      earnedIds: new Set(['recovery-protocol']),
      alreadyCompleted: false,
      attested: true,
      reflection: 'I kept the sleep window for fourteen nights and wrote down the two I missed.',
    }),
    { ok: true },
  );
});
