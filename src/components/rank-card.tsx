import { View } from 'react-native';

import { Panel, T } from '@/components/ui';
import type { RankSnapshot } from '@/lib/progression/evaluate';

export function RankCard({ snapshot }: { snapshot: RankSnapshot }) {
  const rank = snapshot.current;
  return (
    <Panel>
      <T tone="brass" className="text-xs uppercase tracking-[2px]">
        {rank ? `Rank ${rank.order} · ${rank.theme}` : 'Not yet initiated'}
      </T>
      <T className="mt-2 text-3xl font-semibold">{rank?.name ?? 'Baseline open'}</T>
      <T tone="mute" className="mt-2 text-sm leading-5">
        {snapshot.next ? snapshot.next.summary : rank?.summary}
      </T>
      <View className="mt-4 gap-3">
        {snapshot.checks.map((check) => (
          <View key={check.label} className="flex-row gap-3">
            <T tone={check.met ? 'pine' : 'clay'} className="text-sm">
              {check.met ? 'Met' : 'Open'}
            </T>
            <View className="flex-1">
              <T className="text-sm font-semibold">{check.label}</T>
              <T tone="mute" className="text-sm leading-5">
                {check.detail}
              </T>
            </View>
          </View>
        ))}
      </View>
    </Panel>
  );
}
