import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type TextProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth/provider';
import { colors } from '@/lib/theme';

const tones = {
  cream: 'text-cream',
  mute: 'text-mute',
  brass: 'text-brass',
  clay: 'text-clay',
  ink: 'text-brassink',
  pine: 'text-pine',
} as const;

export function T({
  tone = 'cream',
  className,
  ...props
}: TextProps & { tone?: keyof typeof tones; className?: string }) {
  return <Text className={`${tones[tone]} ${className ?? ''}`} {...props} />;
}

export function Screen({
  children,
  footer,
  tab = false,
  keyboard = false,
}: {
  children: ReactNode;
  footer?: ReactNode;
  tab?: boolean;
  keyboard?: boolean;
}) {
  const body = (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.ink }}
      edges={tab ? ['top'] : ['top', 'bottom']}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 }}
      >
        <View className="w-full max-w-xl self-center">{children}</View>
      </ScrollView>
      {footer ? (
        <View className="border-t border-line px-5 py-3">
          <View className="w-full max-w-xl self-center">{footer}</View>
        </View>
      ) : null}
    </SafeAreaView>
  );

  if (!keyboard) return body;
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.ink }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {body}
    </KeyboardAvoidingView>
  );
}

export function Wordmark() {
  return (
    <T tone="brass" className="text-xs uppercase tracking-[3px]">
      Sovereign Path
    </T>
  );
}

export function ModeNote() {
  const { mode, bootError } = useAuth();
  const copy =
    mode === 'local'
      ? 'Local session. Supabase is not configured, so this account stays on this device. It is not Supabase Auth.'
      : mode === 'supabase'
        ? 'Supabase Auth. Sign-in and progress use the project in your environment variables.'
        : 'Supabase is only partly configured. Set both EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY, or leave both empty for a local session.';
  return (
    <View className="mt-4 rounded-md border border-line bg-panel px-3 py-3">
      <T className="text-sm leading-5">{copy}</T>
      {bootError ? (
        <T tone="clay" className="mt-2 text-sm leading-5">
          {bootError}
        </T>
      ) : null}
    </View>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View>
      <T tone="mute" className="mb-2 text-xs uppercase tracking-widest">
        {label}
      </T>
      <TextInput
        placeholderTextColor={colors.mute}
        className="rounded-md border border-line bg-panel px-3 py-3 text-base text-cream"
        {...props}
      />
    </View>
  );
}

export function Button({
  label,
  onPress,
  disabled,
  tone = 'primary',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'primary' | 'ghost';
}) {
  const primary = tone === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={`items-center rounded-md px-4 py-3 ${disabled ? 'opacity-40' : 'active:opacity-80'} ${primary ? 'bg-brass' : 'border border-line bg-panel'}`}
    >
      <T tone={primary ? 'ink' : 'cream'} className="text-base font-semibold">
        {label}
      </T>
    </Pressable>
  );
}

export function Panel({ children }: { children: ReactNode }) {
  return <View className="rounded-md border border-line bg-panel p-4">{children}</View>;
}
