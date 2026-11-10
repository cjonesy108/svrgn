import { View } from 'react-native';

import { T } from '@/components/ui';
import type { Domain } from '@/lib/data/domains';
import { colors } from '@/lib/theme';

export function DomainOverview({ rows }: { rows: { domain: Domain; score: number }[] }) {
  return (
    <View className="gap-3">
      {rows.map(({ domain, score }) => (
        <View key={domain.id}>
          <View className="mb-1 flex-row items-center justify-between">
            <T className="text-sm">
              {domain.name}
              <T tone="mute" className="text-sm">
                {domain.layer === 'civic' ? '  ·  Civic' : '  ·  Personal'}
              </T>
            </T>
            <T tone="mute" className="text-sm">
              {score}
            </T>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-panel2">
            <View
              style={{
                width: `${score}%`,
                height: 8,
                backgroundColor: domain.layer === 'civic' ? colors.pine : colors.brass,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
