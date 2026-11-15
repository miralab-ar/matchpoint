import React, { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type TextStyle } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { readableTextOnBackground } from '@/lib/theme/colors';
import { useTheme } from '@/lib/theme/useTheme';
import { fonts, motion, radius } from '@/lib/theme/tokens';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'dangerOutline' | 'muted';
  fullWidth?: boolean;
  size?: 'md' | 'sm';
  iconLeft?: keyof typeof Ionicons.glyphMap;
  /** When set, rendered instead of `iconLeft` (e.g. non-Ionicons medal). */
  iconLeftSlot?: ReactNode;
  disabled?: boolean;
  /** Shows a centered spinner without resizing the button. */
  loading?: boolean;
  /** Merged after variant text styles (e.g. `{ fontStyle: 'italic' }`). */
  titleStyle?: StyleProp<TextStyle>;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  fullWidth,
  size = 'md',
  iconLeft,
  iconLeftSlot,
  disabled,
  loading,
  titleStyle,
}: ButtonProps) {
  const { tokens } = useTheme();
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';
  const isDangerOutline = variant === 'dangerOutline';
  const isMuted = variant === 'muted';
  const isSmall = size === 'sm';
  const primaryTextTone = readableTextOnBackground(tokens.accent, tokens);
  const primaryTextColor = primaryTextTone === 'light' ? tokens.lightText : tokens.darkTextSecondary;
  const secondaryTextTone = readableTextOnBackground(tokens.accentHover, tokens);
  const secondaryTextColor = secondaryTextTone === 'light' ? tokens.lightText : tokens.darkTextSecondary;
  const baseTextColor =
    isPrimary ? primaryTextColor : isSecondary ? secondaryTextColor : isDanger ? '#fff' : isMuted ? '#fff' : undefined;
  const titleStyleFlat = titleStyle ? (StyleSheet.flatten(titleStyle) as TextStyle) : null;
  const resolvedTextColor =
    (titleStyleFlat && typeof titleStyleFlat.color === 'string' ? titleStyleFlat.color : null) ??
    baseTextColor ??
    Colors.text;

  const iconColor =
    variant === 'outline'
      ? Colors.text
      : isDangerOutline
        ? Colors.danger
        : isPrimary
          ? resolvedTextColor
          : isSecondary
            ? resolvedTextColor
            : isMuted
              ? resolvedTextColor
            : '#fff';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        isSmall && styles.buttonSm,
        fullWidth && styles.fullWidth,
        isPrimary && { backgroundColor: tokens.accent },
        isSecondary && { backgroundColor: tokens.accentHover },
        isMuted && styles.muted,
        variant === 'outline' && styles.outline,
        isDanger && styles.danger,
        isDangerOutline && styles.dangerOutline,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.content}>
        {iconLeftSlot ? (
          <View style={{ marginRight: 8 }}>{iconLeftSlot}</View>
        ) : iconLeft && !loading ? (
          <Ionicons
            name={iconLeft}
            size={isSmall ? 16 : 18}
            color={disabled ? Colors.textMuted : iconColor}
            style={{ marginRight: 8 }}
          />
        ) : null}
        <Text
          style={[
            styles.text,
            isSmall && styles.textSm,
            isPrimary && { color: resolvedTextColor },
            isSecondary && { color: resolvedTextColor },
            variant === 'outline' && styles.outlineText,
            isDanger && styles.dangerText,
            isDangerOutline && styles.dangerOutlineText,
            isMuted && styles.mutedText,
            loading ? styles.loadingTextHidden : null,
            titleStyle,
          ]}
        >
          {title}
        </Text>
        {loading ? (
          <View style={styles.spinnerOverlay} pointerEvents="none">
            <ActivityIndicator size="small" color={resolvedTextColor} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSm: {
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.sm + 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  muted: {
    backgroundColor: Colors.textMuted,
  },
  /** Same `Colors.danger` as profile delete account — transparent fill, border only. */
  dangerOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.danger,
  },
  elevated: {
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  /** Microinteraction: quick press-in (docs/marca.md → Movimiento). */
  pressed: {
    transform: [{ scale: motion.pressScale }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
  },
  /** Labels speak in the display face: condensed, uppercase, tracked. */
  text: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  textSm: {
    fontSize: 15,
    letterSpacing: 0.6,
  },
  loadingTextHidden: {
    opacity: 0,
  },
  outlineText: {
    color: Colors.text,
  },
  dangerText: {
    color: '#fff',
  },
  mutedText: {
    color: '#fff',
  },
  dangerOutlineText: {
    color: Colors.danger,
  },
});
