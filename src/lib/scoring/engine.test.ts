import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { Question } from '../data/questions';
import { scoreAssessment } from './engine';

const scale = (id: string, domainId: string, weight = 1): Question => ({
  id,
  domainId,
  kind: 'scale',
  prompt: id,
  weight,
  min: 1,
  max: 10,
});

test('scale endpoints map to 0 and 100', () => {
  const questions = [scale('a', 'physical')];
  assert.equal(scoreAssessment(questions, [{ questionId: 'a', value: 1 }]).domains[0]?.score, 0);
  assert.equal(scoreAssessment(questions, [{ questionId: 'a', value: 10 }]).domains[0]?.score, 100);
  assert.equal(scoreAssessment(questions, [{ questionId: 'a', value: '10' }]).domains[0]?.score, 100);
});

test('the same raw answers change when weights change', () => {
  const answers = [
    { questionId: 'a', value: 10 },
    { questionId: 'b', value: 1 },
  ];
  const even = [scale('a', 'financial', 1), scale('b', 'financial', 1)];
  const heavyLow = [scale('a', 'financial', 1), scale('b', 'financial', 3)];
  assert.equal(scoreAssessment(even, answers).domains[0]?.score, 50);
  assert.equal(scoreAssessment(heavyLow, answers).domains[0]?.score, 25);
});

test('choice and frequency scores use option weights', () => {
  const questions: Question[] = [
    {
      id: 'habit',
      domainId: 'mental',
      kind: 'frequency',
      prompt: 'habit',
      weight: 1,
      options: [
        { id: 'never', label: 'never', score: 0 },
        { id: 'steady', label: 'steady', score: 1 },
      ],
    },
    {
      id: 'case',
      domainId: 'mental',
      kind: 'choice',
      prompt: 'case',
      weight: 1,
      options: [
        { id: 'wrong', label: 'wrong', score: 0 },
        { id: 'right', label: 'right', score: 1 },
      ],
    },
  ];
  const score = scoreAssessment(questions, [
    { questionId: 'habit', value: 'steady' },
    { questionId: 'case', value: 'wrong' },
  ]);
  assert.equal(score.domains[0]?.score, 50);
});

test('unknown or missing answers are left out of the average', () => {
  const questions = [scale('a', 'digital'), scale('b', 'digital')];
  const score = scoreAssessment(questions, [{ questionId: 'a', value: 10 }, { questionId: 'b', value: 'nope' }]);
  assert.equal(score.domains[0]?.score, 100);
  assert.equal(score.domains[0]?.answeredWeight, 1);
  assert.equal(score.domains[0]?.totalWeight, 2);
});

test('overall is the unweighted mean of domain scores', () => {
  const questions = [scale('a', 'physical'), scale('b', 'financial')];
  const score = scoreAssessment(questions, [
    { questionId: 'a', value: 10 },
    { questionId: 'b', value: 1 },
  ]);
  assert.equal(score.overall, 50);
});
