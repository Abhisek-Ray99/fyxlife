import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// --- SVG Arc Calculation ---
// This function generates the SVG path data for a circular arc.
const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  return d;
};

// Converts polar coordinates (angle, radius) to Cartesian coordinates (x, y).
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

// --- Component Configuration ---
const SIZE = 220;
const STROKE_WIDTH = 16;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const ARC_PATH_DATA = `
  M ${SIZE / 2},${SIZE / 2}
  m -${RADIUS}, 0
  a ${RADIUS},${RADIUS} 0 1,1 ${RADIUS * 2},0
  a ${RADIUS},${RADIUS} 0 1,1 -${RADIUS * 2},0
`;
const ARC_LENGTH = 2 * Math.PI * RADIUS;


interface MainGoalProgressProps {
  progress: number; // 0 to 1
  value: string;
  unit: string;
}

export function MainGoalProgress({ progress, value, unit }: MainGoalProgressProps) {
  const { colors } = useTheme();
  const animatedProgress = useSharedValue(0);

  React.useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    animatedProgress.value = withTiming(clampedProgress, { duration: 1200 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    return {
      // Animate the strokeDashoffset to "draw" the arc
      strokeDashoffset: ARC_LENGTH * (1 - animatedProgress.value),
    };
  });

  const gradientId = 'mainGoalGradient';

  return (
    <View className="items-center justify-center my-8">
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={colors.accentSecondary} />
            <Stop offset="100%" stopColor={colors.accent} />
          </LinearGradient>
        </Defs>

        {/* Background Arc */}
        <Path
          d={ARC_PATH_DATA}
          fill="none"
          stroke={colors.border}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round" // Creates the rounded ends
        />

        {/* Progress Arc */}
        <AnimatedPath
          d={ARC_PATH_DATA}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round" // Creates the rounded ends
          strokeDasharray={ARC_LENGTH}
          animatedProps={animatedProps}
        />
      </Svg>

      {/* Center Content */}
      <View className="absolute items-center justify-center">
        <Ionicons name="flame" size={48} color={colors.accent} />
        <Text
          className="text-5xl font-extrabold text-primary mt-2"
          style={{ color: colors.textPrimary }}
        >
          {value}
        </Text>
        <Text
          className="text-lg text-secondary"
          style={{ color: colors.textSecondary }}
        >
          {unit}
        </Text>
      </View>
    </View>
  );
}