import { Tabs } from 'expo-router/js-tabs';

import { colors } from '@/lib/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.panel,
          borderTopColor: colors.line,
        },
        tabBarActiveTintColor: colors.brass,
        tabBarInactiveTintColor: colors.mute,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Path' }} />
      <Tabs.Screen name="badges" options={{ title: 'Badges' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
