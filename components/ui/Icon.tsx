/**
 * Matchpoint icon set (see docs/marca.md → Iconografía).
 *
 * One family: Ionicons (same set the web uses via react-icons/io5).
 * Rules: outline by default, filled only for the active/selected state.
 * Two sport glyphs Ionicons lacks (`volleyball`, `wind`) are drawn here with the
 * same rounded outline style (paths adapted from Lucide, ISC license).
 */
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';

type IoniconName = keyof typeof Ionicons.glyphMap;
export type IconName = IoniconName | 'volleyball' | 'wind';

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessible?: boolean;
};

const CUSTOM: Record<'volleyball' | 'wind', React.ReactNode> = {
  volleyball: (
    <>
      <Path d="M11.1 7.1a16.55 16.55 0 0 1 10.9 4" />
      <Path d="M12 12a12.6 12.6 0 0 1-8.7 5" />
      <Path d="M16.8 13.6a16.55 16.55 0 0 1-9 7.5" />
      <Path d="M20.7 17a12.8 12.8 0 0 0-8.7-5 13.3 13.3 0 0 1 0-10" />
      <Path d="M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5" />
      <Circle cx={12} cy={12} r={10} />
    </>
  ),
  wind: (
    <>
      <Path d="M12.8 19.6A2 2 0 1 0 14 16H2" />
      <Path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" />
      <Path d="M9.8 4.4A2 2 0 1 1 11 8H2" />
    </>
  ),
};

export function Icon({ name, size = 20, color = '#f4f4f5', style, accessibilityLabel, accessible }: IconProps) {
  if (name === 'volleyball' || name === 'wind') {
    return (
      <View
        style={style}
        accessible={accessible ?? !!accessibilityLabel}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityLabel ? 'image' : undefined}
      >
        <Svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {CUSTOM[name]}
        </Svg>
      </View>
    );
  }
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      style={style as never}
      accessibilityLabel={accessibilityLabel}
      accessible={accessible}
    />
  );
}
