import { useState } from 'react';
import { View } from 'react-native';

import { ShareSheet } from '@/components/share-sheet';
import { Button, Panel, T } from '@/components/ui';
import type { RankSnapshot } from '@/lib/progression/evaluate';
import { rankShareModel } from '@/lib/share/model';

export function RankCard({ snapshot, holderName }: { snapshot: RankSnapshot; holderName?: string }) {
  const rank = snapshot.current;
  const [open, setOpen] = useState(false);
  const share = holderName ? rankShareModel(snapshot, holderName) : null;
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
      {share ? (
        <View className="mt-4">
          <Button label="Share rank card" tone="ghost" onPress={() => setOpen(true)} />
        </View>
      ) : null}
      <ShareSheet model={open ? share : null} onClose={() => setOpen(false)} />
    </Panel>
  );
}
