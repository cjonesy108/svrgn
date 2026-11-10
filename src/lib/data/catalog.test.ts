import assert from 'node:assert/strict';
import { test } from 'node:test';

import { BADGES } from './badges';
import { DOMAINS } from './domains';
import { PROTOCOLS } from './protocols';
import { QUESTIONS } from './questions';
import { RANKS } from './ranks';
import { buildSampleAnswers } from './sample';
import { scoreAssessment } from '../scoring/engine';

const STARTER_TITLES = [
  '30-Day Strength Consistency',
  'Basic Self-Defense Competency',
  'Recovery Protocol Established',
  '3-Month Emergency Fund',
  'Zero Consumer Debt',
  'Net Worth Tracking System',
  'Home Repair Basics',
  '30-Day Cooking Independence',
  'Wilderness/Urban Survival Kit Built',
  '90-Day Daily Discipline Practice',
  'Emotional Regulation Framework',
  'Deep Work Capacity',
  'Family / Household Leadership Standard',
  'Difficult Conversation Competence',
  'Brotherhood Circle Formed',
  'Personal Mission Statement',
  'Decision-Making Framework',
  'Values Hierarchy Documented',
  'Local Government Structure Mapped',
  'Attended City Council or School Board',
  'Constitutional Rights Primer Completed',
  'Organized or Joined Local Mutual Aid',
  'Ballot Measure Analysis & Vote',
  'Personal Data Audit & Privacy Hardening',
];

test('the catalog covers every domain and the starter set', () => {
  assert.equal(DOMAINS.length, 12);
  assert.equal(RANKS.length, 5);
  assert.deepEqual(
    RANKS.map((rank) => rank.name),
    ['Initiate', 'Apprentice', 'Journeyman', 'Adept', 'Sovereign'],
  );
  assert.equal(BADGES.length, 48);
  assert.equal(PROTOCOLS.length, 12);

  const titles = new Set(BADGES.map((item) => item.title));
  for (const title of STARTER_TITLES) {
    assert.equal(titles.has(title), true, title);
  }

  for (const domain of DOMAINS) {
    const inDomain = BADGES.filter((item) => item.domainId === domain.id);
    assert.equal(inDomain.length >= 4, true, domain.id);
    assert.equal(PROTOCOLS.some((protocol) => protocol.domainId === domain.id), true);
    assert.equal(QUESTIONS.filter((question) => question.domainId === domain.id).length, 3);
  }
});

test('badge ids, prerequisites, and criteria are usable', () => {
  const ids = BADGES.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const item of BADGES) {
    assert.equal(item.proofMethod, 'self_attestation');
    assert.equal(item.criteria.length >= 3, true, item.id);
    assert.equal(item.lesson.steps.length >= 3, true, item.id);
    for (const prerequisite of item.prerequisites) {
      assert.equal(ids.includes(prerequisite), true, `${item.id} -> ${prerequisite}`);
    }
  }
  const questionIds = QUESTIONS.map((question) => question.id);
  assert.equal(new Set(questionIds).size, questionIds.length);
});

test('sample answers score into a spread baseline', () => {
  const sample = buildSampleAnswers(QUESTIONS);
  assert.equal(Object.keys(sample).length, QUESTIONS.length);
  const score = scoreAssessment(
    QUESTIONS,
    QUESTIONS.map((question) => ({ questionId: question.id, value: sample[question.id] ?? '' })),
  );
  const values = score.domains.map((domain) => domain.score);
  const spread = Math.max(...values) - Math.min(...values);
  assert.equal(spread >= 40, true, `spread ${spread}`);
});
