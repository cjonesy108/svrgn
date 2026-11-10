import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { BadgeCard } from '@/components/badge-card';
import { DomainOverview } from '@/components/domain-overview';
import { ProtocolCard } from '@/components/protocol-card';
import { RankCard } from '@/components/rank-card';
import { Button, Screen, T, Wordmark } from '@/components/ui';
import { BADGES, getBadge } from '@/lib/data/badges';
import { DOMAINS } from '@/lib/data/domains';
import { recommendBadges } from '@/lib/progression/recommend';
import { recordsByStatus } from '@/lib/progress/selectors';
import { usePathData } from '@/lib/progress/use-path';
import { buildNarrative } from '@/lib/scoring/narrative';
import { colors } from '@/lib/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, progress, scores, earned, rank } = usePathData();
  if (!user || progress.assessments.length === 0 || !scores) {
    return <View style={{ flex: 1, backgroundColor: colors.ink }} />;
  }

  const rows = DOMAINS.map((domain) => ({
    domain,
    score: scores.domains.find((item) => item.domainId === domain.id)?.score ?? 0,
  }));
  const weakest = [...rows].sort((a, b) => a.score - b.score)[0];
  const active = recordsByStatus(progress, 'in_progress').flatMap((record) => {
    const badge = getBadge(record.badgeId);
    return badge ? [badge] : [];
  });
  const recommended = recommendBadges({
    scores: rows.map((row) => ({ domainId: row.domain.id, score: row.score })),
    badges: BADGES,
    earnedIds: new Set(earned.map((item) => item.id)),
    limit: 3,
  });
  const narrative = buildNarrative(rows.map((row) => ({ name: row.domain.name, score: row.score })));

  return (
    <Screen tab>
      <Wordmark />
      <T className="mt-4 text-2xl font-semibold">{user.name}</T>
      <T tone="mute" className="mt-1 text-sm leading-5">
        {narrative.paragraphs[1]}
      </T>
      <View className="mt-5">
        <RankCard snapshot={rank} />
      </View>

      <T tone="brass" className="mb-3 mt-8 text-xs uppercase tracking-[2px]">
        Active badges
      </T>
      {active.length === 0 ? (
        <T tone="mute" className="text-sm leading-5">
          Nothing is in progress. Start one of the next proofs, or open the catalog.
        </T>
      ) : (
        <View className="gap-3">
          {active.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              record={progress.badges[badge.id]}
              onPress={() => router.push(`/badge/${badge.id}`)}
            />
          ))}
        </View>
      )}

      <T tone="brass" className="mb-3 mt-8 text-xs uppercase tracking-[2px]">
        Next proofs
      </T>
      {recommended.length === 0 ? (
        <T tone="mute" className="text-sm leading-5">
          Every available badge in the open domains is already earned.
        </T>
      ) : (
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
      )}
      <View className="mt-3">
        <Button label="Open the catalog" tone="ghost" onPress={() => router.push('/badges')} />
      </View>

      <T tone="brass" className="mb-3 mt-8 text-xs uppercase tracking-[2px]">
        Domains
      </T>
      <DomainOverview rows={rows} />
      <View className="mt-4">
        <Button label="View the baseline radar" tone="ghost" onPress={() => router.push('/results')} />
      </View>
      {weakest ? (
        <View className="mt-6">
          <ProtocolCard domainId={weakest.domain.id} />
        </View>
      ) : null}
    </Screen>
  );
}
