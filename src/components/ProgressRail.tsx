import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '../theme/tokens';

type ProgressRailProps = {
  ratio: number;
  label: string;
};

export function ProgressRail({ ratio, label }: ProgressRailProps) {
  const width = useRef(new Animated.Value(0)).current;
  const percent = Math.round(ratio * 100);

  useEffect(() => {
    Animated.spring(width, {
      toValue: ratio,
      useNativeDriver: false,
      friction: 9,
      tension: 72,
    }).start();
  }, [ratio, width]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percent}>{percent}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: width.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    backgroundColor: colors.mint,
    borderRadius: radii.sm,
    height: '100%',
  },
  label: {
    color: colors.mutedInk,
    fontSize: 13,
    fontWeight: '700',
  },
  percent: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  track: {
    backgroundColor: '#E9E5DA',
    borderRadius: radii.sm,
    height: 10,
    overflow: 'hidden',
  },
  wrapper: {
    marginTop: spacing.md,
  },
});
