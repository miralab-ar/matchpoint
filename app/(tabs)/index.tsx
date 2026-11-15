import React, { useCallback, useEffect, useRef } from 'react';
import i18n, { useTranslation } from '@/lib/i18n';
import { View, StyleSheet, ScrollView, Pressable, Share, Alert, RefreshControl, Animated, Easing, Platform } from 'react-native';
import { Text } from '@/components/ui/Text';
import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { FadeIn } from '@/components/ui/FadeIn';
import { radius, space, type } from '@/lib/theme/tokens';
import { readableTextOnBackground } from '@/lib/theme/colors';
import { TabScreenHeader } from '@/components/ui/TabScreenHeader';
import { NotificationsInboxButton } from '@/components/notifications/NotificationsInboxButton';
import { TournamentListRow } from '@/components/tournament/TournamentListRow';
import { AppBackgroundGradient } from '@/components/ui/AppBackgroundGradient';
import { useTheme } from '@/lib/theme/useTheme';
import { useTournaments } from '@/lib/hooks/useTournaments';
import { config } from '@/lib/config';
import { useLanguageStore } from '@/store/useLanguageStore';
import type { Tournament } from '@/types';
import { prefetchTournament } from '@/lib/prefetchTournament';

export default function TournamentsScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const storedLanguage = useLanguageStore((s) => s.language);
  const insets = useSafeAreaInsets();
  const { data: tournaments = [], isLoading, isError, error, refetch, isFetching } = useTournaments();

  const shineX = useRef(new Animated.Value(-1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(8000),
        Animated.timing(shineX, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(shineX, {
          toValue: -1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shineX]);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch])
  );

  const shareTournament = useCallback(
    (tournament: Tournament) => {
      if (!tournament.inviteLink) return;
      const lang: 'en' | 'es' | 'it' =
        storedLanguage === 'en' || storedLanguage === 'es' || storedLanguage === 'it'
          ? storedLanguage
          : i18n.locale === 'es' || i18n.locale === 'it'
            ? i18n.locale
            : 'en';
      const url = config.invite.getUrl(tournament.inviteLink, lang);
      const androidIntentUrl = config.invite.getAndroidIntentUrl(tournament.inviteLink, lang);
      const shareUrl = Platform.OS === 'android' ? androidIntentUrl : url;
      const message =
        Platform.OS === 'android'
          ? `${t('tournamentDetail.inviteMessage', { name: tournament.name, url })}\n\n${androidIntentUrl}`
          : t('tournamentDetail.inviteMessage', { name: tournament.name, url });
      Share.share({
        message,
        url: shareUrl,
        title: t('tournamentDetail.inviteTitle'),
      }).catch(() => Alert.alert(t('common.error'), t('tournamentDetail.couldNotShare')));
    },
    [storedLanguage, t],
  );

  const renderTournamentItem = useCallback(
    ({ item: tournament, index }: { item: Tournament; index: number }) => (
      <FadeIn delay={index * 40}>
        <TournamentListRow
          variant="home"
          tournament={tournament}
          onPressIn={() => prefetchTournament(queryClient, tournament._id)}
          onPress={() => router.push(`/tournament/${tournament._id}`)}
          onSharePress={shareTournament}
        />
      </FadeIn>
    ),
    [queryClient, router, shareTournament],
  );

  const listEmpty = useCallback(
    () => (
      <EmptyState
        icon="trophy-outline"
        title={t('admin.noTournaments')}
        actionLabel={t('tournaments.create')}
        onAction={() => router.push('/tournament/create')}
      />
    ),
    [t, router],
  );

  const topPad = Math.max(insets.top, 12) + 8;
  const fabTextColor = readableTextOnBackground(tokens.accent, tokens) === 'light' ? tokens.lightText : tokens.darkText;
  const scrollContentStyle = [styles.scrollContent, { paddingTop: 12 }];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <AppBackgroundGradient />
        <View style={[styles.stickyScreenHeader, { paddingTop: topPad }]}>
          <TabScreenHeader title={t('tournaments.screenTitle')} rightAccessory={<NotificationsInboxButton />} />
        </View>
        <ScrollView style={styles.scroll} contentContainerStyle={scrollContentStyle}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.cardOuter}>
              <View style={styles.cardPressable}>
                <Skeleton height={22} width="70%" style={{ marginBottom: 8 }} />
                <Skeleton height={16} width="40%" style={{ marginBottom: 4 }} />
                <Skeleton height={16} width="50%" style={{ marginBottom: 8 }} />
                <Skeleton height={14} width="30%" />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, styles.errorOuter]}>
        <AppBackgroundGradient />
        <View style={[styles.stickyScreenHeader, { paddingTop: topPad }]}>
          <TabScreenHeader title={t('tournaments.screenTitle')} rightAccessory={<NotificationsInboxButton />} />
        </View>
        <View style={styles.errorInner}>
          <EmptyState
            tone="error"
            icon="cloud-offline-outline"
            title={t('tournaments.failedToLoad')}
            message={error?.message}
            actionLabel={t('common.retry')}
            onAction={() => void refetch()}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBackgroundGradient />
      <View style={[styles.stickyScreenHeader, { paddingTop: topPad }]}>
        <TabScreenHeader title={t('tournaments.screenTitle')} rightAccessory={<NotificationsInboxButton />} />
      </View>
      <FlashList
        data={tournaments as Tournament[]}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={listEmpty}
        renderItem={renderTournamentItem}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => void refetch()} tintColor={tokens.accent} />}
        contentContainerStyle={scrollContentStyle}
        style={styles.scroll}
      />
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: tokens.accent, bottom: 24 + Math.max(insets.bottom - 8, 0) },
          pressed && styles.fabPressed,
        ]}
        onPress={() => router.push('/tournament/create')}
        accessibilityRole="button"
        accessibilityLabel={t('tournaments.create')}
      >
        <Ionicons name="add" size={22} color={fabTextColor} />
        <Text style={[styles.fabText, { color: fabTextColor }]}>{t('tournaments.createButton').replace(/^\+\s*/, '')}</Text>
        <View style={styles.fabShineClip} pointerEvents="none">
          <Animated.View
            style={[
              styles.fabShine,
              {
                transform: [
                  {
                    translateX: shineX.interpolate({
                      inputRange: [-1, 1],
                      outputRange: [-140, 140],
                    }),
                  },
                  {
                    translateY: shineX.interpolate({
                      inputRange: [-1, 1],
                      outputRange: [18, -18],
                    }),
                  },
                  { rotate: '-18deg' },
                ],
              },
            ]}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  /** Logo + title + notifications — fixed above scroll so they stay visible. */
  stickyScreenHeader: {
    paddingHorizontal: space.screen,
    backgroundColor: Colors.background,
    zIndex: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: space.screen,
    paddingTop: 0,
    paddingBottom: 112,
  },
  cardOuter: {
    position: 'relative',
    marginBottom: space.sm,
    borderRadius: radius.lg,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  cardPressable: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: space.screen,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
    paddingVertical: 14,
    paddingLeft: 18,
    paddingRight: 22,
    borderRadius: radius.pill,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  fabPressed: {
    transform: [{ scale: 0.96 }],
  },
  fabText: {
    ...type.displayMd,
    fontSize: 20,
    lineHeight: 22,
    color: Colors.text,
    textTransform: 'uppercase',
  },
  fabShineClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: radius.pill,
  },
  fabShine: {
    position: 'absolute',
    top: -12,
    bottom: -12,
    width: 46,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  errorOuter: {
    flex: 1,
  },
  errorInner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyState: {
    marginTop: 28,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  emptyFab: {
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
  },
});
