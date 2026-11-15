/**
 * Brand-aware Text / TextInput (see docs/marca.md → Tipografía).
 *
 * Drop-in replacements for the React Native components. They map the existing
 * `fontWeight` / `fontStyle` styles to the loaded brand fonts so every screen gets
 * the new typography without rewriting each StyleSheet:
 * - italic (the app's "sport" voice) → Barlow Condensed italic, slightly larger.
 * - everything else → Inter at the matching weight.
 * An explicit `fontFamily` always wins. Nested texts without their own weight or
 * style inherit the parent font (no family override).
 */
import React, { createContext, forwardRef, useContext } from 'react';
import {
  StyleSheet,
  Text as RNText,
  TextInput as RNTextInput,
  type TextInputProps,
  type TextProps,
  type TextStyle,
} from 'react-native';
import { fonts } from '@/lib/theme/tokens';

type Inherited = { weight: number; italic: boolean; custom: boolean };

const InheritedFont = createContext<Inherited | null>(null);

/** Condensed faces read smaller at the same size; compensate a little. */
const DISPLAY_SCALE = 1.1;

function weightNumber(w: TextStyle['fontWeight'] | undefined): number | null {
  if (w == null) return null;
  if (w === 'normal') return 400;
  if (w === 'bold') return 700;
  const n = typeof w === 'number' ? w : Number.parseInt(String(w), 10);
  return Number.isFinite(n) ? n : null;
}

function textFamily(weight: number): string {
  if (weight >= 800) return fonts.textExtraBold;
  if (weight >= 700) return fonts.textBold;
  if (weight >= 600) return fonts.textSemiBold;
  if (weight >= 500) return fonts.textMedium;
  return fonts.textRegular;
}

function displayItalicFamily(weight: number): string {
  if (weight >= 800) return fonts.displayExtraBoldItalic;
  if (weight >= 700) return fonts.displayBoldItalic;
  if (weight >= 600) return fonts.displaySemiBoldItalic;
  return fonts.displayMediumItalic;
}

export function resolveBrandFont(
  flat: TextStyle,
  parent: Inherited | null
): { override: TextStyle | null; inherited: Inherited } {
  if (flat.fontFamily) {
    return { override: null, inherited: { weight: 400, italic: false, custom: true } };
  }
  const ownWeight = weightNumber(flat.fontWeight);
  const ownItalic = flat.fontStyle == null ? null : flat.fontStyle === 'italic';
  if (parent && ownWeight == null && ownItalic == null) {
    return { override: null, inherited: parent };
  }
  if (parent?.custom && ownWeight == null && ownItalic == null) {
    return { override: null, inherited: parent };
  }
  const weight = ownWeight ?? parent?.weight ?? 400;
  const italic = ownItalic ?? parent?.italic ?? false;
  const inherited: Inherited = { weight, italic, custom: false };
  if (italic) {
    const override: TextStyle = {
      fontFamily: displayItalicFamily(weight),
      fontWeight: 'normal',
      fontStyle: 'normal',
    };
    if (typeof flat.fontSize === 'number') override.fontSize = Math.round(flat.fontSize * DISPLAY_SCALE);
    if (typeof flat.lineHeight === 'number') override.lineHeight = Math.round(flat.lineHeight * DISPLAY_SCALE);
    return { override, inherited };
  }
  return { override: { fontFamily: textFamily(weight), fontWeight: 'normal' }, inherited };
}

export const Text = forwardRef<RNText, TextProps>(function BrandText({ style, children, ...rest }, ref) {
  const parent = useContext(InheritedFont);
  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  const { override, inherited } = resolveBrandFont(flat, parent);
  return (
    <InheritedFont.Provider value={inherited}>
      <RNText ref={ref} style={override ? [style, override] : style} {...rest}>
        {children}
      </RNText>
    </InheritedFont.Provider>
  );
});
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Text = RNText;

export const TextInput = forwardRef<RNTextInput, TextInputProps>(function BrandTextInput({ style, ...rest }, ref) {
  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  const { override } = resolveBrandFont(flat, null);
  return <RNTextInput ref={ref} style={override ? [style, override] : style} {...rest} />;
});
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TextInput = RNTextInput;
