/**
 * Matchpoint color palette (see docs/marca.md → Color)
 * Dark only: "court at night" neutrals + yellow (Punto) and violet (Saque) highlights.
 */

const palette = {
  background: '#121214',
  surface: '#1c1c21',
  surfaceLight: '#2a2a31',
  text: '#f4f4f5',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  yellow: '#fbbf24',
  yellowHover: '#fcd34d',
  violet: '#8b5cf6',
  violetHover: '#a78bfa',
  /** Same RGB as `violet` (#8b5cf6) — translucent surfaces (e.g. organizer rows) */
  violetMuted: 'rgba(139, 92, 246, 0.22)',
  /** Same hue as `violet` — soft borders on violet-tinted UI */
  violetOutline: 'rgba(139, 92, 246, 0.45)',
  avatarMale: '#93c5fd',
  avatarFemale: '#f9a8d4',
  avatarOther: '#6b7280',
  /** Hairline borders / dividers */
  border: '#2e2e36',
  /** "En vivo" chip (broadcast red) */
  live: '#ef4444',
  success: '#22c55e',
  error: '#ef4444',
  /** Carmesí / crimson — danger actions, delete, destructive (opaco) */
  danger: '#e11d48',
  warning: '#f59e0b',
  tabIconDefault: '#71717a',
  tabIconSelected: '#fbbf24',
};

// Matchpoint uses dark theme only - both light/dark use same palette
const darkTheme = {
  ...palette,
  tint: palette.yellow,
  tabIconDefault: palette.tabIconDefault,
  tabIconSelected: palette.tabIconSelected,
};

export default {
  light: darkTheme,
  dark: darkTheme,
  ...palette,
} as const;
