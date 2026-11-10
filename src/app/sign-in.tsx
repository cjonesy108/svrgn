import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Field, ModeNote, Screen, T, Wordmark } from '@/components/ui';
import { useAuth } from '@/lib/auth/provider';

export default function SignInScreen() {
  const { mode, signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const blocked = mode === 'misconfigured';

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
      router.replace('/');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen keyboard>
      <Wordmark />
      <T className="mt-6 text-3xl font-semibold">Sign in</T>
      <T tone="mute" className="mt-2 text-base leading-6">
        {mode === 'supabase'
          ? 'Use the email and password on your Supabase project.'
          : 'Use the email and passphrase saved on this device.'}
      </T>
      <ModeNote />
      {blocked ? null : (
        <View className="mt-6 gap-4">
          <Field
            label="Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Field
            label={mode === 'local' ? 'Passphrase' : 'Password'}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error ? (
            <T tone="clay" accessibilityLiveRegion="polite" className="text-sm leading-5">
              {error}
            </T>
          ) : null}
          <Button label={busy ? 'Signing in…' : 'Sign in'} onPress={submit} disabled={busy} />
          <Link href="/sign-up">
            <T tone="brass" className="text-center text-base">
              Create an account
            </T>
          </Link>
        </View>
      )}
    </Screen>
  );
}
