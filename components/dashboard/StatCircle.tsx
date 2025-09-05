import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const SIZE = 80;
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;

// Convert polar to cartesian
function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (Math.PI / 180) * angle;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

// Describe arc with a gap at bottom
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

// Arc angles → start at ~220° and end at -40° → leaves bottom gap
const START_ANGLE = 260;
const END_ANGLE = 80;

const ARC_PATH = describeArc(SIZE / 2, SIZE / 2, RADIUS, START_ANGLE, END_ANGLE);
const ARC_SWEEP = 360 - (START_ANGLE - END_ANGLE); // arc length in degrees
const ARC_LENGTH = 2 * Math.PI * RADIUS * (ARC_SWEEP / 360);

interface StatCircleProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: string;
  label: string;
  progress: number; 
}

export function StatCircle({ icon, value, label, progress }: StatCircleProps) {

  const { colors } = useTheme();
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    const clamped = Math.max(0, Math.min(1, progress));
    animatedProgress.value = withTiming(clamped, { duration: 1200 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: ARC_LENGTH * (1 - animatedProgress.value),
  }));

  return (
    <View className="flex-1 items-center">
      {/* Circle with small bottom gap */}
      <View className="items-center justify-center mb-2">
        <Svg width={SIZE} height={SIZE}>
          {/* Background Arc */}
          <Path
            d={ARC_PATH}
            stroke={colors.border} // light green/gray like screenshot
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            fill="none"
          />

          {/* Progress Arc */}
          <AnimatedPath
            d={ARC_PATH}
            stroke={colors.accent}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={ARC_LENGTH}
            animatedProps={animatedProps}
          />
        </Svg>

        {/* Center Icon */}
        <View className="absolute">
          <Ionicons name={icon} size={28} color={colors.accent} />
        </View>
      </View>

      {/* Value */}
      <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{value}</Text>

      {/* Label */}
      <Text className="text-sm" style={{ color: colors.textSecondary }}>{label}</Text>
    </View>
  );
}
