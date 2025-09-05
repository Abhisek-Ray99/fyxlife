import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface WeeklyProgressCardProps {
  title: string;
  completed: number;
  total: number;
  // An array of 7 booleans representing completion for Mon-Sun
  weekData: boolean[];
}

export function WeeklyProgressCard({ title, completed, total, weekData }: WeeklyProgressCardProps) {
  const { colors } = useTheme();

  return (
    <View className="p-4 rounded-2xl mb-4" style={{ backgroundColor: colors.card }}>
      <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>{title}</Text>
      <View className="flex-row justify-between items-center mt-1">
        <Text className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
          {completed} <Text className="text-xl">of</Text> {total}
        </Text>
        <View className="flex-row gap-x-1.5">
          {WEEK_DAYS.map((day, index) => (
            <View key={index} className="items-center">
              <View
                className="w-4 h-8 rounded-full"
                style={{ backgroundColor: weekData[index] ? colors.accent : colors.border }}
              />
              <Text className="text-xs font-bold mt-1" style={{ color: colors.textSecondary }}>
                {day}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}