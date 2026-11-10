import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { T } from '@/components/ui';
import { useAuth } from '@/lib/auth/provider';
import { useProgressHydrated, useProgressStore, useUserProgress } from '@/lib/progress/store';
import { colors } from '@/lib/theme';

export default function AppLayout() {
  const { user } = useAuth();
  const hydrated = useProgressHydrated();
  const progress = useUserProgress(user?.id);
  const hasAssessment = progress.assessments.length > 0;
  const pathname = usePathname();
  const router = useRouter();
  const onboarding = pathname === '/welcome' || pathname === '/intake';

  useEffect(() => {
    if (!hydrated || !user) return;
    if (!hasAssessment && !onboarding) router.replace('/welcome');
    else if (hasAssessment && pathname === '/welcome') router.replace('/');
  }, [hasAssessment, hydrated, onboarding, pathname, router, user]);

  const syncError = useProgressStore((state) => state.syncError);

  return (
    <View style={{ flex: 1, backgroundColor: colors.ink }}>
      {syncError ? (
        <View style={{ backgroundColor: colors.panel, paddingHorizontal: 16, paddingVertical: 8 }}>
          <T tone="clay" className="text-sm leading-5">
            {syncError} Progress is still on this device.
          </T>
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ink } }} />
      </View>
    </View>
  );
}
