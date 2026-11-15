import React from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';

/**
 * App background: flat "court at night" neutral (docs/marca.md → Color).
 * Kept as a component so screens don't change; color does the work, not decoration.
 */
export function AppBackgroundGradient() {
  return <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, styles.bg]} />;
}

const styles = StyleSheet.create({
  bg: { backgroundColor: Colors.background },
});
