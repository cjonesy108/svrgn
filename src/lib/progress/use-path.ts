import { useMemo } from 'react';

import { useAuth } from '../auth/provider';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import { RANKS } from '../data/ranks';
import { evaluateRank } from '../progression/evaluate';
import { scoreAssessment } from '../scoring/engine';
import { earnedFromProgress, latestAssessment } from './selectors';
import { useUserProgress } from './store';

export function usePathData() {
  const { user } = useAuth();
  const progress = useUserProgress(user?.id);
  const assessment = latestAssessment(progress);
  const scores = useMemo(
    () => (assessment ? scoreAssessment(QUESTIONS, assessment.answers) : null),
    [assessment],
  );
  const earned = useMemo(() => earnedFromProgress(progress), [progress]);
  const rank = useMemo(
    () =>
      evaluateRank({
        assessmentCompleted: progress.assessments.length > 0,
        earned,
        ranks: RANKS,
        domains: DOMAINS,
      }),
    [earned, progress.assessments.length],
  );

  return { user, progress, assessment, scores, earned, rank };
}
