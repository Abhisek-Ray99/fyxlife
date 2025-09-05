import { useTheme } from '@/hooks/useTheme';
import { useGoalStore } from '@/store/useGoalStore';
import React from 'react';
import { Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

export function ProgressSummaryChart() {

  const { colors } = useTheme();
  const { getTodayProgress, getWeekProgress, getMonthProgress } = useGoalStore();

  const data = [
    { value: getTodayProgress(), label: 'Today' },
    { value: getWeekProgress(), label: 'Week' },
    { value: getMonthProgress(), label: 'Month' },
  ];

  return (
    <View className="p-4 rounded-xl shadow-md my-4" style={{ backgroundColor: colors.card }}>
      <Text className="text-lg font-bold text-text mb-4" style={{ color: colors.textPrimary }}>Progress vs Plan</Text>
      <BarChart
        data={data}
        barWidth={40}
        barBorderRadius={4}
        frontColor={colors.accent}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={{ color: colors.textSecondary }}
        xAxisLabelTextStyle={{ color: colors.textSecondary }}
        maxValue={100}
        noOfSections={5}
        yAxisLabelSuffix="%"
        isAnimated
      />
    </View>
  );
}