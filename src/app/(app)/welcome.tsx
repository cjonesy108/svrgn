import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button, Panel, Screen, T, Wordmark } from '@/components/ui';
import { useAuth } from '@/lib/auth/provider';
import { useUserProgress } from '@/lib/progress/store';

export default function WelcomeScreen() {
  const { user } = useAuth();
  const progress = useUserProgress(user?.id);
  const router = useRouter();
  const hasDraft = Boolean(
    progress.draft && (progress.draft.step > 0 || Object.keys(progress.draft.answers).length > 0),
  );

  return (
    <Screen
      footer={
        <Button
          label={hasDraft ? 'Resume the intake' : 'Begin the intake'}
          onPress={() => router.push('/intake')}
        />
      }
    >
      <Wordmark />
      <T className="mt-6 text-3xl font-semibold">A baseline, then proof.</T>
      <T tone="mute" className="mt-3 text-base leading-6">
        Sovereign Path is a rank and badge program for men who want the skills to govern themselves
        and take part in governing their communities. Personal capability comes first. Civic skill is
        the next layer.
      </T>
      <View className="mt-6 gap-3">
        <Panel>
          <T className="text-base font-semibold">1. Take the intake</T>
          <T tone="mute" className="mt-1 text-sm leading-5">
            About 20 minutes. Twelve domains, three questions each. The scores come from the answers
            you store.
          </T>
        </Panel>
        <Panel>
          <T className="text-base font-semibold">2. Earn badges</T>
          <T tone="mute" className="mt-1 text-sm leading-5">
            Each badge has observable criteria. You attest and write what changed. Nobody else reviews
            it in this version.
          </T>
        </Panel>
        <Panel>
          <T className="text-base font-semibold">3. Ranks follow the proofs</T>
          <T tone="mute" className="mt-1 text-sm leading-5">
            Initiate is the intake. Later ranks require a count and a spread of badges, not a mood.
          </T>
        </Panel>
      </View>
    </Screen>
  );
}
