import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { BadgeCard } from '@/components/badge-card';
import { DomainOverview } from '@/components/domain-overview';
import { RadarChart } from '@/components/radar-chart';
import { RankCard } from '@/components/rank-card';
import { Button, Screen, T, Wordmark } from '@/components/ui';
import { BADGES } from '@/lib/data/badges';
import { DOMAINS } from '@/lib/data/domains';
import { recommendBadges } from '@/lib/progression/recommend';
import { usePathData } from '@/lib/progress/use-path';
import { useProgressStore } from '@/lib/progress/store';
import { buildNarrative } from '@/lib/scoring/narrative';

export default function ResultsScreen() {
  const router = useRouter();
  const { user, progress, assessment, scores, earned, rank } = usePathData();
  const setDraft = useProgressStore((state) => state.setDraft);
  if (!user || !assessment || !scores) return null;

  const rows = DOMAINS.map((domain) => ({
    domain,
    score: scores.domains.find((item) => item.domainId === domain.id)?.score ?? 0,
  }));
  const narrative = buildNarrative(rows.map((row) => ({ name: row.domain.name, score: row.score })));
  const recommended = recommendBadges({
    scores: rows.map((row) => ({ domainId: row.domain.id, score: row.score })),
    badges: BADGES,
    earnedIds: new Set(earned.map((item) => item.id)),
    limit: 5,
  });
  const taken = new Date(assessment.completedAt).toLocaleDateString();

  return (
    <Screen
      footer={<Button label="Go to the path" onPress={() => router.replace('/')} />}
    >
      <Wordmark />
      <T className="mt-4 text-3xl font-semibold">Baseline {scores.overall}</T>
      <T tone="mute" className="mt-1 text-sm">
        Taken {taken}. {progress.assessments.length === 1 ? 'First intake.' : `${progress.assessments.length} intakes on file. The chart uses the latest.`}
      </T>
      <View className="mt-4">
        <RadarChart
          points={rows.map((row) => ({
            id: row.domain.id,
            short: row.domain.short,
            score: row.score,
            layer: row.domain.layer,
          }))}
        />
      </View>
      <View className="mt-4 gap-3">
        {narrative.paragraphs.map((paragraph) => (
          <T key={paragraph} className="text-base leading-6">
            {paragraph}
          </T>
        ))}
      </View>
      <View className="mt-6">
        <RankCard snapshot={rank} holderName={user.name} />
      </View>
      <T tone="brass" className="mb-3 mt-8 text-xs uppercase tracking-[2px]">
        Highest-leverage badges
      </T>
      <View className="gap-3">
        {recommended.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            record={progress.badges[badge.id]}
            onPress={() => router.push(`/badge/${badge.id}`)}
          />
        ))}
      </View>
      <T tone="brass" className="mb-3 mt-8 text-xs uppercase tracking-[2px]">
        Domain scores
      </T>
      <DomainOverview rows={rows} />
      <View className="mt-6">
        <Button
          label="Retake the intake"
          tone="ghost"
          onPress={() => {
            setDraft(user.id, { step: 0, answers: {} });
            router.push('/intake');
          }}
        />
      </View>
    </Screen>
  );
}
