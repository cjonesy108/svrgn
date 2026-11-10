import { Pressable, View } from 'react-native';

import { T } from '@/components/ui';
import type { Badge } from '@/lib/data/badges';
import { getDomain } from '@/lib/data/domains';
import type { UserBadgeRecord } from '@/lib/progress/store';

function difficultyLabel(value: Badge['difficulty']): string {
  if (value === 'foundation') return 'Foundation';
  if (value === 'practiced') return 'Practiced';
  return 'Demanding';
}

export function BadgeCard({
  badge,
  record,
  onPress,
}: {
  badge: Badge;
  record?: UserBadgeRecord;
  onPress: () => void;
}) {
  const domain = getDomain(badge.domainId);
  const status = record?.status === 'completed' ? 'Earned' : record?.status === 'in_progress' ? 'In progress' : 'Not started';
  return (
    <Pressable accessibilityRole="button" onPress={onPress} className="rounded-md border border-line bg-panel p-4 active:opacity-80">
      <View className="flex-row items-start justify-between gap-3">
        <T className="flex-1 text-base font-semibold">{badge.title}</T>
        <T tone={record?.status === 'completed' ? 'brass' : 'mute'} className="text-xs uppercase tracking-widest">
          {status}
        </T>
      </View>
      <T tone="mute" className="mt-2 text-sm">
        {domain?.name ?? badge.domainId} · {difficultyLabel(badge.difficulty)} · {badge.xp} xp
      </T>
    </Pressable>
  );
}
