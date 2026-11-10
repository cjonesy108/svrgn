import 'react-native-gesture-handler';
import '../global.css';

import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/lib/auth/provider';
import { useRemoteProgressReady } from '@/lib/progress/sync';
import { useProgressHydrated } from '@/lib/progress/store';
import { colors } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.ink,
    card: colors.panel,
    text: colors.cream,
    border: colors.line,
    primary: colors.brass,
  },
};

export default function RootLayout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.ink).catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider value={theme}>
        <StatusBar style="light" />
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}

function useAppReady(): boolean {
  const { ready, mode, user } = useAuth();
  const hydrated = useProgressHydrated();
  const remoteReady = useRemoteProgressReady(user?.id, user?.name ?? '', mode === 'supabase' && hydrated);
  return ready && hydrated && remoteReady;
}

function RootNavigator() {
  const { user } = useAuth();
  const appReady = useAppReady();
  useEffect(() => {
    if (appReady) SplashScreen.hideAsync().catch(() => {});
  }, [appReady]);
  if (!appReady) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ink } }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack.Protected>
    </Stack>
  );
}
