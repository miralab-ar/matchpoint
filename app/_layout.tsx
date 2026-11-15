import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DarkTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import { Platform, View, StyleSheet } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import {
  BarlowCondensed_500Medium_Italic,
  BarlowCondensed_600SemiBold_Italic,
  BarlowCondensed_700Bold,
  BarlowCondensed_700Bold_Italic,
  BarlowCondensed_800ExtraBold,
  BarlowCondensed_800ExtraBold_Italic,
} from '@expo-google-fonts/barlow-condensed';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import 'react-native-reanimated';

import Colors from '@/constants/Colors';
import { fonts } from '@/lib/theme/tokens';
import { queryClient } from '@/lib/queryClient';
import { I18nProvider, i18n, useTranslation } from '@/lib/i18n';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useUserStore } from '@/store/useUserStore';
import { OfflineBanner } from '@/components/OfflineBanner';
import { initAppObservability } from '@/lib/observability/app';
import { useThemeStore } from '@/store/useThemeStore';
import { DEFAULT_THEME_PRESET_ID, THEME_PRESETS, type ThemePresetId } from '@/lib/theme/colors';

// Dev-only: prevent a known noisy unhandled rejection from crashing the app
// when Android's Activity is restarting (dev-client / reload race).
declare const __DEV__: boolean;
if (__DEV__ && typeof process !== 'undefined' && typeof process.on === 'function') {
  const key = '__matchpoint_keepawake_unhandled_rejection_handler__';
  const g = globalThis as unknown as Record<string, unknown>;
  if (!g[key]) {
    g[key] = true;
    process.on('unhandledRejection', (reason: unknown) => {
      const msg = reason instanceof Error ? reason.message : String(reason ?? '');
      if (
        msg.includes("ExpoKeepAwake.activate") &&
        (msg.includes('current activity is no longer available') || msg.includes('The current activity is no longer available'))
      ) {
        return;
      }
      // Keep default behavior: surface other unhandled rejections.
      // eslint-disable-next-line no-console
      console.error('Unhandled promise rejection', reason);
    });
  }
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

initAppObservability();

/** Matchpoint is dark-only: navigation chrome always uses the brand neutrals. */
const NAV_THEME: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.yellow,
    background: Colors.background,
    card: Colors.background,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.live,
  },
};

/** Shared stack header look (brand fonts, no hairline). */
const HEADER_OPTIONS = {
  headerTintColor: Colors.text,
  headerStyle: { backgroundColor: Colors.background },
  headerShadowVisible: false,
  headerTitleStyle: { fontFamily: fonts.displayBoldItalic, fontSize: 22 },
} as const;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    BarlowCondensed_500Medium_Italic,
    BarlowCondensed_600SemiBold_Italic,
    BarlowCondensed_700Bold,
    BarlowCondensed_700Bold_Italic,
    BarlowCondensed_800ExtraBold,
    BarlowCondensed_800ExtraBold_Italic,
  });
  const ready = fontsLoaded || !!fontError;

  // Required for OAuth: closes auth browser when redirect returns to app
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);
  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const hasHydrated = useLanguageStore((s) => s._hasHydrated);
  const themeHydrated = useThemeStore((s) => s._hasHydrated);

  useEffect(() => {
    if (!hasHydrated || !language) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        if (window.location.pathname.startsWith('/t/')) {
          const l = new URLSearchParams(window.location.search).get('lang');
          if (l === 'en' || l === 'es' || l === 'it') return;
        }
      } catch {
        /* ignore */
      }
    }
    i18n.locale = language;
  }, [hasHydrated, language]);

  // Keep theme in sync with the signed-in user (server persisted).
  useEffect(() => {
    if (!themeHydrated) return;
    const u = useUserStore.getState().user as unknown as { themePresetId?: unknown } | null;
    const raw = u?.themePresetId;
    const presetId = (typeof raw === 'string' ? raw : null) as ThemePresetId | null;
    if (presetId && presetId in THEME_PRESETS) {
      useThemeStore.getState().setPresetId(presetId);
    } else {
      // Ensure we always have a valid preset when store is empty.
      const cur = useThemeStore.getState().presetId;
      if (!cur) useThemeStore.getState().setPresetId(DEFAULT_THEME_PRESET_ID);
    }
  }, [themeHydrated]);

  const Wrapper = Platform.OS === 'web' ? View : GestureHandlerRootView;

  return (
    <Wrapper style={{ flex: 1 }}>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <View style={styles.rootFill}>
            <OfflineBanner />
            <ThemeProvider value={NAV_THEME}>
              <View style={styles.rootFill}>
          <Stack screenOptions={{ headerShown: false, ...HEADER_OPTIONS, contentStyle: { backgroundColor: Colors.background }, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="language" options={{ headerShown: false }} />
        <Stack.Screen
          name="tournament/[id]"
          options={{
            headerShown: true,
            title: t('common.tournament'),
            ...HEADER_OPTIONS,
          }}
        />
        <Stack.Screen name="tournament/create" />
        <Stack.Screen name="tournament/[id]/team/create" />
        <Stack.Screen name="tournament/[id]/team/create-organizer" />
        <Stack.Screen name="tournament/[id]/team/[teamId]" />
        <Stack.Screen name="tournament/[id]/guest-players" />
        <Stack.Screen name="t/[token]" />
        <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile/my-entries"
          options={{
            headerShown: true,
            title: t('tabs.myEntries'),
            ...HEADER_OPTIONS,
          }}
        />
        <Stack.Screen
          name="profile/my-data"
          options={{
            headerShown: true,
            title: t('profile.myData'),
            ...HEADER_OPTIONS,
          }}
        />
        <Stack.Screen
          name="profile/[userId]"
          options={{
            headerShown: true,
            title: t('profile.publicProfileTitle'),
            ...HEADER_OPTIONS,
          }}
        />
        <Stack.Screen name="profile/change-password" options={{ headerShown: true, title: t('profile.changePassword'), ...HEADER_OPTIONS }} />
          </Stack>
              </View>
        </ThemeProvider>
          </View>
      </QueryClientProvider>
      </I18nProvider>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  rootFill: { flex: 1 },
});
