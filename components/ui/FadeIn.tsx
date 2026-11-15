import React, { useEffect, useRef } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';
import { motion } from '@/lib/theme/tokens';
import { useReducedMotion } from '@/lib/theme/useReducedMotion';

type FadeInProps = {
  children: React.ReactNode;
  /** Stagger for lists (ms). Keep small: index * 40, capped. */
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

/** Short enter transition: fade + 8px rise (docs/marca.md → Movimiento). */
export function FadeIn({ children, delay = 0, style }: FadeInProps) {
  const reduced = useReducedMotion();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: motion.base,
      delay: Math.min(delay, 240),
      easing: motion.easeOut,
      useNativeDriver: true,
    }).start();
  }, [v, delay]);
  if (reduced) return <Animated.View style={style}>{children}</Animated.View>;
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: v,
          transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [motion.enterOffset, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
