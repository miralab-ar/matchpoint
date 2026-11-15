import React, { useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { authApi } from '@/lib/api';
import { useUserStore } from '@/store/useUserStore';
import type { User } from '@/types';
import { useTheme } from '@/lib/theme/useTheme';
import { fonts } from '@/lib/theme/tokens';

export default function TabLayout() {
  const { t } = useTranslation();
  const { tokens } = useTheme();

  useEffect(() => {
    let cancelled = false;
    const { accessToken, user } = useUserStore.getState();
    if (!accessToken || !user) return;
    void (async () => {
      try {
        const u = (await authApi.me()) as User;
        if (!cancelled) useUserStore.getState().setUser(u);
      } catch {
        /* keep cached user on network errors */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Tabs
      initialRouteName="feed"
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: tokens.tabIconSelected,
        tabBarInactiveTintColor: Colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          elevation: 0,
          // Web: the default 48px bar clips the label (Inter needs a taller line box).
          ...(Platform.OS === 'web' ? { height: 62, paddingTop: 2, paddingBottom: 4 } : null),
        },
        tabBarLabelStyle: { fontFamily: fonts.textSemiBold, fontSize: 11, lineHeight: 14, letterSpacing: 0.2 },
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: t('tabs.feed'),
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.tournaments'),
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
