import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

// --- SVG Arc Helpers (from MainGoalProgress) ---
const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
};
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return { x: centerX + radius * Math.cos(angleInRadians), y: centerY + radius * Math.sin(angleInRadians) };
};

const SIZE = 56;
const STROKE_WIDTH = 5;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const ARC_PATH_DATA = describeArc(SIZE / 2, SIZE / 2, RADIUS, 225, -45);

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  progress: number; // 0 to 1
}

export function MetricCard({ title, value, unit, icon, progress }: MetricCardProps) {
  const { colors } = useTheme();

  return (
    <View className="p-4 rounded-2xl mb-4" style={{ backgroundColor: colors.card }}>
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>{title}</Text>
          <Text className="text-3xl font-bold mt-1" style={{ color: colors.textPrimary }}>
            {value} <Text className="text-xl font-medium">{unit}</Text>
          </Text>
        </View>
        <View className="relative w-14 h-14 items-center justify-center">
            <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                {/* Background Arc */}
                <Path d={ARC_PATH_DATA} fill="none" stroke={colors.border} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
                {/* Progress Arc */}
                <Path 
                    d={ARC_PATH_DATA} 
                    fill="none" 
                    stroke={colors.accent} 
                    strokeWidth={STROKE_WIDTH} 
                    strokeLinecap="round" 
                    strokeDasharray={300} // A large number to represent the full length
                    strokeDashoffset={300 * (1 - progress)} // Animate the offset
                />
            </Svg>
            <View className="absolute">
                <Ionicons name={icon} size={24} color={colors.accent} />
            </View>
        </View>
      </View>
    </View>
  );
}