import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 160;
const STROKE_WIDTH = 16;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface RiskScoreHeaderProps {
  score: number; // 0-100
}

export function RiskScoreHeader({ score }: RiskScoreHeaderProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(score / 100, { duration: 1200 });
  }, [score]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  const getGradientColors = (s: number): [string, string] => {
    if (s > 75) return [colors.success, colors.accentSecondary]; // Low Risk
    if (s > 40) return [colors.warning, '#FCD34D']; // Medium Risk
    return [colors.danger, '#F87171']; // High Risk
  };
  const [startColor, endColor] = getGradientColors(score);

  return (
    <View className="items-center my-6">
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Defs>
          <LinearGradient id="risk-gradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={startColor} />
            <Stop offset="100%" stopColor={endColor} />
          </LinearGradient>
        </Defs>
        <Circle cx={SIZE/2} cy={SIZE/2} r={RADIUS} stroke={colors.border} strokeWidth={STROKE_WIDTH} fill="none" />
        <AnimatedCircle
          cx={SIZE/2} cy={SIZE/2} r={RADIUS}
          stroke="url(#risk-gradient)"
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${SIZE/2} ${SIZE/2})`}
        />
      </Svg>
      <View className="absolute items-center justify-center inset-0">
        <Text className="text-4xl font-extrabold" style={{ color: colors.textPrimary }}>{Math.round(score)}</Text>
        <Text className="text-sm font-semibold tracking-widest uppercase" style={{ color: colors.textSecondary }}>Health Score</Text>
      </View>
    </View>
  );
}