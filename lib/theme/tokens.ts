/**
 * Matchpoint design tokens (see docs/marca.md).
 * Spacing, radii, typography and motion. Colors live in `constants/Colors.ts`
 * (base) and `lib/theme/colors.ts` (accent presets).
 */
import { Easing } from 'react-native';

/** 4-pt spacing scale. Screen gutter = `space.screen`. */
export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  screen: 20,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/**
 * Font family names as registered with expo-font (from @expo-google-fonts).
 * Display = Barlow Condensed (scoreboard / broadcast voice).
 * Text = Inter (UI and reading).
 */
export const fonts = {
  textRegular: 'Inter_400Regular',
  textMedium: 'Inter_500Medium',
  textSemiBold: 'Inter_600SemiBold',
  textBold: 'Inter_700Bold',
  textExtraBold: 'Inter_800ExtraBold',
  displayBold: 'BarlowCondensed_700Bold',
  displayExtraBold: 'BarlowCondensed_800ExtraBold',
  displayMediumItalic: 'BarlowCondensed_500Medium_Italic',
  displaySemiBoldItalic: 'BarlowCondensed_600SemiBold_Italic',
  displayBoldItalic: 'BarlowCondensed_700Bold_Italic',
  displayExtraBoldItalic: 'BarlowCondensed_800ExtraBold_Italic',
} as const;

/** Type scale. Display styles are uppercase-friendly and condensed. */
export const type = {
  /** Scoreboard numbers. Always tabular. */
  score: { fontFamily: fonts.displayExtraBold, fontVariant: ['tabular-nums'] as const },
  displayXl: { fontFamily: fonts.displayExtraBoldItalic, fontSize: 40, lineHeight: 42, letterSpacing: 0.2 },
  displayLg: { fontFamily: fonts.displayExtraBoldItalic, fontSize: 30, lineHeight: 32, letterSpacing: 0.3 },
  displayMd: { fontFamily: fonts.displayBoldItalic, fontSize: 22, lineHeight: 26, letterSpacing: 0.4 },
  /** Section label: small caps feel, wide tracking. */
  label: { fontFamily: fonts.textBold, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' as const },
  title: { fontFamily: fonts.textBold, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fonts.textRegular, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fonts.textMedium, fontSize: 12, lineHeight: 16 },
  numeric: { fontVariant: ['tabular-nums'] as const },
} as const;

/** Motion: short and functional. Use `useReducedMotion` to skip. */
export const motion = {
  press: 120,
  fast: 160,
  base: 220,
  slow: 320,
  easeOut: Easing.out(Easing.cubic),
  pressScale: 0.97,
  enterOffset: 8,
} as const;
