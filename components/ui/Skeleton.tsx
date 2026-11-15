import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { useReducedMotion } from '@/lib/theme/useReducedMotion';

type SkeletonProps = {
  width?: ViewStyle['width'];
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

/** Loading placeholder with a soft pulse (static when reduce-motion is on). */
export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  const reduced = useReducedMotion();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduced]);

  const opacity = reduced ? 0.6 : pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.85] });

  return <Animated.View style={[styles.skeleton, { width, height, borderRadius, opacity }, style]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.surfaceLight,
  },
});
