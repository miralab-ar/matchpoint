import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import Colors from '@/constants/Colors';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/ui/FadeIn';
import { useTheme } from '@/lib/theme/useTheme';
import { radius, space, type } from '@/lib/theme/tokens';

type EmptyStateProps = {
  icon: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** `error` tints the badge red and is announced as an alert. */
  tone?: 'neutral' | 'error';
  compact?: boolean;
};

/**
 * Empty / error state: never a dead end (docs/marca.md → Principios).
 * Icon badge + short title + one line + at most one action.
 */
export function EmptyState({ icon, title, message, actionLabel, onAction, tone = 'neutral', compact }: EmptyStateProps) {
  const { tokens } = useTheme();
  const isError = tone === 'error';
  return (
    <FadeIn>
      <View
        style={[styles.wrap, compact && styles.wrapCompact]}
        accessibilityRole={isError ? 'alert' : undefined}
      >
        <View
          style={[
            styles.badge,
            compact && styles.badgeCompact,
            { backgroundColor: isError ? 'rgba(239, 68, 68, 0.14)' : tokens.accentMuted },
          ]}
        >
          <Icon name={icon} size={compact ? 22 : 28} color={isError ? Colors.live : tokens.accent} />
        </View>
        <Text style={styles.title}>{title}</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        {actionLabel && onAction ? (
          <View style={styles.action}>
            <Button title={actionLabel} onPress={onAction} size="sm" variant={isError ? 'outline' : 'primary'} />
          </View>
        ) : null}
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: space.xl,
    paddingHorizontal: space.lg,
  },
  wrapCompact: {
    paddingVertical: space.md,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.md,
  },
  badgeCompact: {
    width: 48,
    height: 48,
    marginBottom: space.sm,
  },
  title: {
    ...type.title,
    color: Colors.text,
    textAlign: 'center',
  },
  message: {
    ...type.body,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: space.xxs,
    maxWidth: 300,
  },
  action: {
    marginTop: space.md,
  },
});
