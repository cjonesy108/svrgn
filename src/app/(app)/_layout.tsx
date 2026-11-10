import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/lib/auth/provider';
import { useProgressHydrated, useUserProgress } from '@/lib/progress/store';
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

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ink } }} />
  );
}
