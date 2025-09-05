import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { RiskData } from '@/types';
import { useTheme } from '@/hooks/useTheme'; // Import the theme hook

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 80;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface SystemRiskGaugeProps {
  data: RiskData;
}

export function SystemRiskGauge({ data }: SystemRiskGaugeProps) {
  const { colors } = useTheme(); // Use the theme hook to get dynamic colors
  const progress = useSharedValue(0);

  useEffect(() => {
    // Clamp the risk score to be between 0 and 100
    const clampedScore = Math.max(0, Math.min(100, data.riskScore));
    progress.value = withTiming(clampedScore / 100, { duration: 1000 });
  }, [data.riskScore]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  const gradientId = `gradient-${data.system}`;

  // THE REFACTOR:
  // This function now uses the semantic colors from our theme.
  const getGradientColors = (score: number): [string, string] => {
    if (score < 40) return [colors.success, colors.accentSecondary]; // Low risk = Success colors
    if (score < 70) return [colors.warning, '#FCD34D']; // Medium risk = Warning colors
    return [colors.danger, '#F87171']; // High risk = Danger colors
  };
  
  const [startColor, endColor] = getGradientColors(data.riskScore);

  return (
    <View className="items-center">
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={startColor} />
            <Stop offset="100%" stopColor={endColor} />
          </LinearGradient>
        </Defs>
        
        {/* Background Circle */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill='none'
          // THE REFACTOR: Use the theme's border color for the background.
          stroke={colors.border}
          strokeWidth={STROKE_WIDTH}
        />
        
        {/* Progress Circle */}
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill='none'
          stroke={`url(#${gradientId})`}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>
      
      {/* Center Text */}
      <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
        <Text 
          className="text-xl font-bold"
          // THE REFACTOR: Use the theme's primary text color.
          style={{ color: colors.textPrimary }}
        >
          {data.riskScore}%
        </Text>
      </View>
      
      {/* System Label */}
      <Text 
        className="text-base font-semibold mt-2"
        // THE REFACTOR: Use the theme's secondary text color.
        style={{ color: colors.textSecondary }}
      >
        {data.system}
      </Text>
    </View>
  );
}