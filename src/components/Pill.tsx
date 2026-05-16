import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radii, spacing } from '../theme/tokens';

type PillProps = {
  label: string;
  selected?: boolean;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Pill({ label, selected = false, color = colors.sky, onPress, style }: PillProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.pill,
        selected ? { backgroundColor: color, borderColor: color } : undefined,
        style,
      ]}
    >
      <Text style={[styles.label, selected ? styles.selectedLabel : undefined]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: radii.sm,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: spacing.md,
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
  },
  selectedLabel: {
    color: colors.surface,
  },
});
