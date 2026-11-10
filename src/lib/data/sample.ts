import type { Question } from './questions';

/** Targets are 0 to 1. The dev preview uses them so the radar is not flat. */
export const SAMPLE_TARGETS: Record<string, number> = {
  physical: 0.84,
  financial: 0.22,
  practical: 0.55,
  mental: 0.48,
  relational: 0.3,
  purpose: 0.62,
  systems: 0.58,
  local: 0.25,
  rights: 0.5,
  community: 0.33,
  voting: 0.44,
  digital: 0.8,
};

export function buildSampleAnswers(questions: Question[]): Record<string, string | number> {
  const answers: Record<string, string | number> = {};
  for (const question of questions) {
    const target = SAMPLE_TARGETS[question.domainId] ?? 0.5;
    if (question.kind === 'scale') {
      const raw = question.min + target * (question.max - question.min);
      const rounded = Math.round(raw);
      answers[question.id] = Math.min(question.max, Math.max(question.min, rounded));
      continue;
    }
    const best = question.options.reduce<typeof question.options[number] | undefined>((closest, option) => {
      if (!closest) return option;
      return Math.abs(option.score - target) < Math.abs(closest.score - target) ? option : closest;
    }, undefined);
    if (!best) {
      throw new Error(`Question ${question.id} has no options.`);
    }
    answers[question.id] = best.id;
  }
  return answers;
}
