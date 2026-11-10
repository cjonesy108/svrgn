import type { Question } from '../data/questions';

export interface RawAnswer {
  questionId: string;
  value: string | number;
}

export interface DomainScore {
  domainId: string;
  /** 0 to 100. Missing answers are left out of the average so a new question does not punish an older record. */
  score: number;
  answeredWeight: number;
  totalWeight: number;
}

export interface AssessmentScore {
  domains: DomainScore[];
  overall: number;
}

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function unitScore(question: Question, value: string | number | undefined): number | null {
  if (value === undefined) return null;
  if (question.kind === 'scale') {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric)) return null;
    const span = question.max - question.min;
    if (span <= 0) return null;
    return clamp01((numeric - question.min) / span);
  }
  const option = question.options.find((item) => item.id === String(value));
  if (!option) return null;
  return clamp01(option.score);
}

/**
 * Scores stored raw answers. Change a question weight and the same answers
 * produce a new result. This function does not read a saved score.
 */
export function scoreAssessment(questions: Question[], answers: RawAnswer[]): AssessmentScore {
  const byId = new Map(answers.map((answer) => [answer.questionId, answer.value]));
  const domainIds: string[] = [];
  for (const question of questions) {
    if (!domainIds.includes(question.domainId)) domainIds.push(question.domainId);
  }

  const domains = domainIds.map((domainId) => {
    const domainQuestions = questions.filter((question) => question.domainId === domainId);
    let weighted = 0;
    let answeredWeight = 0;
    let totalWeight = 0;
    for (const question of domainQuestions) {
      const weight = question.weight > 0 ? question.weight : 0;
      totalWeight += weight;
      const unit = unitScore(question, byId.get(question.id));
      if (unit === null || weight === 0) continue;
      answeredWeight += weight;
      weighted += unit * weight;
    }
    const score = answeredWeight === 0 ? 0 : Math.round((weighted / answeredWeight) * 100);
    return { domainId, score, answeredWeight, totalWeight };
  });

  const overall =
    domains.length === 0
      ? 0
      : Math.round(domains.reduce((sum, domain) => sum + domain.score, 0) / domains.length);

  return { domains, overall };
}
