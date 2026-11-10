import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Button, Screen, T, Wordmark } from '@/components/ui';
import { useAuth } from '@/lib/auth/provider';
import { getBadge } from '@/lib/data/badges';
import { getDomain } from '@/lib/data/domains';
import { recordsByStatus } from '@/lib/progress/selectors';
import { usePathData } from '@/lib/progress/use-path';
import { useProgressStore } from '@/lib/progress/store';

export default function ProfileScreen() {
  const router = useRouter();
  const { mode, signOut } = useAuth();
  const { user, progress, rank } = usePathData();
  const setDraft = useProgressStore((state) => state.setDraft);
  if (!user) return null;

  const earned = recordsByStatus(progress, 'completed');
  const xp = earned.reduce((sum, record) => sum + (getBadge(record.badgeId)?.xp ?? 0), 0);

  return (
    <Screen tab>
      <Wordmark />
      <T className="mt-4 text-3xl font-semibold">{user.name}</T>
      <T tone="mute" className="mt-1 text-base">
        {user.email}
      </T>
      <T className="mt-4 text-sm leading-5">
        {mode === 'supabase'
          ? 'Sign-in uses Supabase. Badges, intake answers, and rank progress stay on this device.'
          : 'This session and your progress stay on this device. Supabase is not configured.'}
      </T>

      <View className="mt-5 flex-row gap-3">
        <Stat label="Rank" value={rank.current?.name ?? 'None'} />
        <Stat label="Badges" value={String(earned.length)} />
        <Stat label="XP" value={String(xp)} />
      </View>

      <T tone="brass" className="mb-3 mt-8 text-xs uppercase tracking-[2px]">
        Badge showcase
      </T>
      {earned.length === 0 ? (
        <T tone="mute" className="text-sm leading-5">
          Completed badges show up here. The catalog is where you start one.
        </T>
      ) : (
        <View className="flex-row flex-wrap gap-3">
          {earned.map((record) => {
            const badge = getBadge(record.badgeId);
            if (!badge) return null;
            const domain = getDomain(badge.domainId);
            return (
              <Pressable
                key={badge.id}
                onPress={() => router.push(`/badge/${badge.id}`)}
                className="w-[47%] rounded-md border border-line bg-panel p-3"
              >
                <T tone="brass" className="text-xs uppercase tracking-widest">
                  {domain?.short}
                </T>
                <T className="mt-2 text-sm font-semibold">{badge.title}</T>
              </Pressable>
            );
          })}
        </View>
      )}

      <View className="mt-8 gap-3">
        <Button
          label="Retake the intake"
          tone="ghost"
          onPress={() => {
            setDraft(user.id, { step: 0, answers: {} });
            router.push('/intake');
          }}
        />
        <Button label="Sign out" tone="ghost" onPress={() => signOut()} />
      </View>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-md border border-line bg-panel p-3">
      <T tone="mute" className="text-xs uppercase tracking-widest">
        {label}
      </T>
      <T className="mt-1 text-base font-semibold">{value}</T>
    </View>
  );
}
