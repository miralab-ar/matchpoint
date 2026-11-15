import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import Colors from '@/constants/Colors';
import { MPMark } from '@/components/ui/MPMark';
import { space, type } from '@/lib/theme/tokens';

type TabScreenHeaderProps = {
  title: string;
  /** e.g. notifications bell — aligned top-right */
  rightAccessory?: React.ReactNode;
};

/**
 * Broadcast-style screen header: brand mark + big condensed title, left aligned.
 * (docs/marca.md → Principios: jerarquía clara, el título dice dónde estás.)
 */
export function TabScreenHeader({ title, rightAccessory }: TabScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.logo} pointerEvents="none">
        <MPMark size={34} accessibilityLabel="Matchpoint" />
      </View>
      <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
        {title}
      </Text>
      {rightAccessory ? <View style={styles.rightAccessory}>{rightAccessory}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    minHeight: 48,
    marginBottom: space.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  logo: {
    height: 34,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...type.displayLg,
    flex: 1,
    color: Colors.text,
    textTransform: 'uppercase',
  },
  rightAccessory: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
