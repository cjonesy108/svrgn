import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

import { BadgeCard } from '@/components/badge-card';
import { Screen, T, Wordmark } from '@/components/ui';
import { BADGES } from '@/lib/data/badges';
import { DOMAINS, getDomain } from '@/lib/data/domains';
import { usePathData } from '@/lib/progress/use-path';
import { colors } from '@/lib/theme';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'personal', label: 'Personal' },
  { id: 'civic', label: 'Civic' },
  ...DOMAINS.map((domain) => ({ id: domain.id, label: domain.short })),
];

export default function BadgeCatalogScreen() {
  const router = useRouter();
  const { progress } = usePathData();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return BADGES.filter((badge) => {
      const domain = getDomain(badge.domainId);
      if (filter === 'personal' && domain?.layer !== 'personal') return false;
      if (filter === 'civic' && domain?.layer !== 'civic') return false;
      if (filter !== 'all' && filter !== 'personal' && filter !== 'civic' && badge.domainId !== filter) {
        return false;
      }
      if (!needle) return true;
      return (
        badge.title.toLowerCase().includes(needle) || badge.description.toLowerCase().includes(needle)
      );
    });
  }, [filter, query]);

  return (
    <Screen tab>
      <Wordmark />
      <T className="mt-4 text-2xl font-semibold">Badge catalog</T>
      <T tone="mute" className="mt-1 text-sm leading-5">
        {BADGES.length} badges. Self-attestation and a reflection. No outside review in this version.
      </T>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search badges"
        placeholderTextColor={colors.mute}
        className="mt-4 rounded-md border border-line bg-panel px-3 py-3 text-base text-cream"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3" contentContainerStyle={{ gap: 8 }}>
        {FILTERS.map((item) => {
          const selected = filter === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setFilter(item.id)}
              className={`rounded-full px-3 py-2 ${selected ? 'bg-brass' : 'border border-line bg-panel'}`}
            >
              <T tone={selected ? 'ink' : 'cream'} className="text-xs uppercase tracking-widest">
                {item.label}
              </T>
            </Pressable>
          );
        })}
      </ScrollView>
      <View className="mt-4 gap-3">
        {visible.length === 0 ? (
          <T tone="mute">No badges match that filter.</T>
        ) : (
          visible.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              record={progress.badges[badge.id]}
              onPress={() => router.push(`/badge/${badge.id}`)}
            />
          ))
        )}
      </View>
    </Screen>
  );
}
