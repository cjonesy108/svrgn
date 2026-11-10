import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Field, ModeNote, Screen, T, Wordmark } from '@/components/ui';
import { useAuth } from '@/lib/auth/provider';

export default function SignUpScreen() {
  const { mode, signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await signUp(name, email, password);
      router.replace('/');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not create the account.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen keyboard>
      <Wordmark />
      <T className="mt-6 text-3xl font-semibold">Create an account</T>
      <T tone="mute" className="mt-2 text-base leading-6">
        {mode === 'supabase'
          ? 'This creates a Supabase Auth user.'
          : 'This creates an account on this device only. Nothing is sent to Supabase.'}
      </T>
      <ModeNote />
      {mode === 'misconfigured' ? null : (
        <View className="mt-6 gap-4">
          <Field label="Name" value={name} onChangeText={setName} autoCorrect={false} />
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
          <Button label={busy ? 'Creating…' : 'Create account'} onPress={submit} disabled={busy} />
          <Link href="/sign-in">
            <T tone="brass" className="text-center text-base">
              I already have an account
            </T>
          </Link>
        </View>
      )}
    </Screen>
  );
}
