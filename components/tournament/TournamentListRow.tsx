import React, { memo, useMemo } from 'react';
import { View, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/lib/i18n';
import Colors from '@/constants/Colors';
import { IconButton } from '@/components/ui/IconButton';
import { TournamentStatsBlock } from '@/components/ui/TournamentStatsBlock';
import { formatTournamentDate } from '@/lib/utils/dateFormat';
import { useTheme } from '@/lib/theme/useTheme';
import {
  maxPlayerSlotsForTournament,
  normalizeGroupCount,
  splitAcrossDivisions,
} from '@/lib/tournamentGroups';
import type { Tournament, TournamentDivision } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { fonts, radius, space, type } from '@/lib/theme/tokens';

const BRONZE = '#cd7f32';

/** Matches `cardConfigText` so row icons align with label color on the card image. */
const CARD_CONFIG_ICON_COLOR = 'rgba(255, 255, 255, 0.78)';

const DEFAULT_TOURNAMENT_CARD_BG = require('@/assets/images/tournament-card-bg-bw.png');

export type TournamentListRowProps = {
  tournament: Tournament;
  variant: 'home' | 'feed';
  onPress: () => void;
  onPressIn?: () => void;
  /** Shown on home tab when the tournament has an invite link */
  onSharePress?: (tournament: Tournament) => void;
};

function TournamentListRowInner({
  tournament,
  variant,
  onPress,
  onPressIn,
  onSharePress,
}: TournamentListRowProps) {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const dateLabel = tournament.date || tournament.startDate;
  const totalGroups = normalizeGroupCount(tournament.groupCount);
  const hasInvite = !!tournament.inviteLink;
  const isCancelled = tournament.status === 'cancelled';
  const divisions = (tournament.divisions?.length ? tournament.divisions : ['mixed']) as TournamentDivision[];
  const divisionCount = Math.max(1, divisions.length);
  const totalTeams = tournament.maxTeams ?? 16;
  const totalPlayers = maxPlayerSlotsForTournament(totalTeams);
  const currentPlayers = tournament.entriesCount ?? 0;
  const currentTeams = tournament.teamsCount ?? 0;
  const currentGroups = tournament.groupsWithTeamsCount ?? 0;
  const waitlistCount = tournament.waitlistCount ?? 0;
  const waitlistByDivision = tournament.waitlistCountByDivision;
  const playersByDivision = tournament.entriesCountByDivision;
  const teamsByDivision = tournament.teamsCountByDivision;
  const groupsByDivision = tournament.groupsWithTeamsCountByDivision;

  const formattedDate = formatTournamentDate(dateLabel) || '—';
  const pointsConfigText = `${t('tournaments.pointsToWin')}: ${tournament.pointsToWin ?? 21}`;
  const setsConfigText = `${t('tournaments.setsPerMatch')}: ${tournament.setsPerMatch ?? 1}`;
  const rulesText = `${pointsConfigText}  ·  ${setsConfigText}`;

  const cardImageSource = useMemo(() => {
    const url = tournament.coverImageUrl?.trim();
    if (url) return { uri: url };
    return DEFAULT_TOURNAMENT_CARD_BG;
  }, [tournament.coverImageUrl]);

  const accessibilityLabel =
    variant === 'home'
      ? `${tournament.name}. ${formatTournamentDate(dateLabel) || ''}`
      : `${tournament.name}. ${t('common.tournament')}`;

  const body = (
    <>
      <View style={[styles.kickerRow, variant === 'home' && hasInvite && onSharePress ? styles.homeTitleRowWithShare : undefined]}>
        <View style={[styles.dateChip, { backgroundColor: tokens.accent }]}>
          <Ionicons name="calendar-clear-outline" size={13} color={Colors.background} />
          <Text style={styles.dateChipText} numberOfLines={1}>
            {formattedDate}
          </Text>
        </View>
        {(tournament.visibility ?? 'public') === 'private' ? (
          <View style={styles.privateBadge}>
            <Ionicons name="lock-closed-outline" size={11} color={Colors.text} />
            <Text style={styles.privateBadgeText}>{t('tournaments.privateBadge')}</Text>
          </View>
        ) : null}
      </View>
      <View style={variant === 'home' ? styles.homeTitleRow : styles.feedTitleRow}>
        <Text style={variant === 'home' ? styles.homeTitle : styles.feedTitle} numberOfLines={2}>
          {tournament.name}
        </Text>
      </View>
      {isCancelled ? (
        <View style={styles.cancelledRow} accessibilityRole="text">
          <Ionicons name="close-circle-outline" size={16} color={Colors.error} />
          <Text style={styles.cancelledBadge}>{t('tournaments.cancelledBadge')}</Text>
        </View>
      ) : null}
      <View style={styles.cardConfigBlock}>
        <View style={styles.cardConfigRow}>
          <Ionicons name="location-outline" size={16} color={CARD_CONFIG_ICON_COLOR} />
          <Text style={styles.cardConfigText} numberOfLines={1}>
            {tournament.location?.trim() || '—'}
          </Text>
        </View>
        <View style={styles.cardConfigRow}>
          <Ionicons name="trophy-outline" size={16} color={CARD_CONFIG_ICON_COLOR} />
          <Text style={styles.cardConfigText} numberOfLines={1}>
            {rulesText}
          </Text>
          <View style={styles.categoryMedals}>
            {tournament.categories?.includes('Gold') ? (
              <Icon name="medal-outline" size={16} color={Colors.yellow} />
            ) : null}
            {tournament.categories?.includes('Silver') ? (
              <Icon name="medal-outline" size={16} color={Colors.textSecondary} />
            ) : null}
            {tournament.categories?.includes('Bronze') ? (
              <Icon name="medal-outline" size={16} color={BRONZE} />
            ) : null}
            {!tournament.categories?.length ? (
              <Icon name="medal-outline" size={16} color={Colors.yellow} />
            ) : null}
          </View>
        </View>
      </View>
      <View style={styles.divisionStatsContainer}>
        <View style={variant === 'home' ? styles.homeStats : styles.feedStats}>
          {divisions.map((division, idx) => {
            const divisionLabel =
              division === 'men'
                ? t('tournaments.divisionMen')
                : division === 'women'
                  ? t('tournaments.divisionWomen')
                  : t('tournaments.divisionMixed');
            return (
              <View key={`${tournament._id}-${division}`} style={styles.divisionStatsSection}>
                <Text
                  style={[
                    styles.divisionStatsTitle,
                    !isCancelled ? ({ color: tokens.accentSecondary } as never) : null,
                    isCancelled && styles.divisionStatsTitleMuted,
                  ]}
                >
                  {divisionLabel}
                </Text>
                <TournamentStatsBlock
                  compact
                  horizontal
                  showLabels={variant === 'home'}
                  textColor={variant === 'home' ? Colors.text : undefined}
                  muted={isCancelled}
                  currentPlayers={
                    playersByDivision?.[division] ?? splitAcrossDivisions(currentPlayers, divisionCount, idx)
                  }
                  totalPlayers={splitAcrossDivisions(totalPlayers, divisionCount, idx)}
                  currentTeams={
                    teamsByDivision?.[division] ?? splitAcrossDivisions(currentTeams, divisionCount, idx)
                  }
                  totalTeams={splitAcrossDivisions(totalTeams, divisionCount, idx)}
                  currentGroups={
                    groupsByDivision?.[division] ?? splitAcrossDivisions(currentGroups, divisionCount, idx)
                  }
                  totalGroups={splitAcrossDivisions(totalGroups, divisionCount, idx)}
                  waitlistCount={
                    waitlistByDivision?.[division] ??
                    // Back-compat for older cached tournaments; avoid showing nonsense splits once server provides per-division counts.
                    splitAcrossDivisions(waitlistCount, divisionCount, idx)
                  }
                />
              </View>
            );
          })}
        </View>
      </View>
      {isCancelled ? (
        <Text style={styles.cancelledHint}>{t('tournaments.cancelledListHint')}</Text>
      ) : null}
    </>
  );

  if (variant === 'home') {
    return (
      <View style={[styles.homeOuter, isCancelled && styles.homeOuterCancelled]}>
        <ImageBackground
          source={cardImageSource}
          style={styles.homeImageBg}
          imageStyle={styles.homeImage}
          resizeMode="cover"
        >
          <View style={styles.cardBgScrim} pointerEvents="none" />
          <Pressable
            style={styles.homePressable}
            onPressIn={onPressIn}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
          >
            {body}
          </Pressable>
        </ImageBackground>
        {hasInvite && onSharePress ? (
          <View style={styles.shareCorner} pointerEvents="box-none">
            <IconButton
              icon="share-outline"
              onPress={() => onSharePress(tournament)}
              accessibilityLabel={t('tournamentDetail.shareInvite')}
              color={tokens.accent}
              compact
            />
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.feedRow}>
      <ImageBackground
        source={cardImageSource}
        style={styles.feedImageBg}
        imageStyle={styles.feedImage}
        resizeMode="cover"
      >
        <View style={styles.cardBgScrim} pointerEvents="none" />
        <Pressable
          style={[styles.feedPressable, isCancelled && styles.feedCardCancelled]}
          onPressIn={onPressIn}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
        >
          {body}
        </Pressable>
      </ImageBackground>
    </View>
  );
}

export const TournamentListRow = memo(TournamentListRowInner);

const styles = StyleSheet.create({
  homeOuter: {
    position: 'relative',
    marginBottom: space.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  homeImageBg: {
    width: '100%',
  },
  homeImage: {
    borderRadius: radius.lg,
    opacity: 1,
  },
  /** Dark, slightly warm scrim so the photo reads as texture, not content. */
  cardBgScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14, 14, 18, 0.72)',
  },
  homeOuterCancelled: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  homePressable: {
    padding: space.md + 2,
    position: 'relative',
    zIndex: 1,
  },
  /** Clears the top-right share control only; keeps horizontal padding symmetric for the rest of the card */
  homeTitleRowWithShare: {
    paddingRight: 36,
  },
  shareCorner: {
    position: 'absolute',
    top: 10,
    right: 8,
    zIndex: 2,
  },
  feedRow: {
    marginBottom: space.sm,
  },
  feedImageBg: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  feedImage: {
    borderRadius: radius.lg,
    opacity: 1,
  },
  feedPressable: {
    padding: space.md,
    position: 'relative',
    zIndex: 1,
  },
  feedCardCancelled: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginBottom: space.xs,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm - 2,
  },
  dateChipText: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Colors.background,
    fontVariant: ['tabular-nums'],
  },
  homeTitleRow: {
    marginBottom: space.xs,
  },
  feedTitleRow: {
    marginBottom: space.xs,
  },
  homeTitle: {
    ...type.displayLg,
    fontSize: 28,
    lineHeight: 30,
    color: Colors.text,
    textTransform: 'uppercase',
  },
  feedTitle: {
    ...type.displayMd,
    fontSize: 24,
    lineHeight: 26,
    color: Colors.text,
    textTransform: 'uppercase',
  },
  privateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm - 2,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },
  privateBadgeText: {
    ...type.label,
    fontSize: 10,
    color: Colors.text,
  },
  cancelledRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  cancelledBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.error,
    letterSpacing: 0.3,
  },
  cardConfigBlock: {
    marginBottom: space.sm,
    gap: 2,
  },
  cardConfigRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingVertical: 3,
  },
  cardConfigText: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    lineHeight: 19,
    color: CARD_CONFIG_ICON_COLOR,
    fontWeight: '500',
  },
  categoryMedals: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  divisionStatsContainer: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: radius.md,
    paddingVertical: space.sm,
    paddingHorizontal: space.sm,
    overflow: 'hidden',
  },
  homeStats: {
    gap: space.sm,
  },
  feedStats: {
    gap: space.sm,
  },
  divisionStatsSection: {
    gap: 6,
  },
  divisionStatsTitle: {
    ...type.label,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  divisionStatsTitleMuted: {
    color: Colors.textSecondary,
  },
  cancelledHint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: space.xs,
  },
});
