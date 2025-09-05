import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTheme } from '@/hooks/useTheme';
import { useGoalStore } from '@/store/useGoalStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

export function ProgressChartCard() {
  const { colors } = useTheme();
  const router = useRouter();
  const { getTodayProgress, getWeekProgress, getMonthProgress } = useGoalStore();

  // Get the factual data from the store
  const today = getTodayProgress();
  const week = getWeekProgress();
  const month = getMonthProgress();

  // Format the data for a Stacked Bar Chart
  const chartData = [
    { 
      stacks: [
        { value: today.completed, color: colors.accent }, 
        // Show the remaining "planned" part in a subtle color
        { value: Math.max(0, today.planned - today.completed), color: colors.border }
      ], 
      label: 'Today' 
    },
    { 
      stacks: [
        { value: week.completed, color: colors.accent },
        { value: Math.max(0, week.planned - week.completed), color: colors.border }
      ], 
      label: 'Week' 
    },
    { 
      stacks: [
        { value: month.completed, color: colors.accent },
        { value: Math.max(0, month.planned - month.completed), color: colors.border }
      ], 
      label: 'Month' 
    },
  ];

  // Create a dynamic, motivational title based on weekly performance
  const weeklyPerformance = week.planned > 0 ? (week.completed / week.planned) * 100 : 0;
  const chartTitle = weeklyPerformance > 75 ? "Excellent Consistency! 🔥" 
                   : weeklyPerformance > 40 ? "Great Progress This Week!" 
                   : "Building a Healthy Habit!";

  return (
    <Animated.View 
        entering={FadeInUp.duration(500).delay(200)}
        className="p-5 rounded-2xl mb-4 my-6" 
        style={{ backgroundColor: colors.card }}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View>
            <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>{chartTitle}</Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>Completed vs. Planned Goals</Text>
        </View>
        {/* THE CTA */}
        <Pressable 
            onPress={() => console.log('Navigate to detailed report screen')}
            className="flex-row items-center gap-x-1 bg-border px-3 py-1.5 rounded-full"
        >
            <Text className="text-xs font-bold" style={{ color: colors.textPrimary }}>Report</Text>
            <Ionicons name="analytics-outline" size={14} color={colors.textPrimary} />
        </Pressable>
      </View>
      
      <BarChart
        stackData={chartData}
        barWidth={50}
        spacing={25}
        stackBorderRadius={5}
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor={colors.border}
        yAxisTextStyle={{ color: colors.textSecondary }}
        xAxisLabelTextStyle={{ color: colors.textSecondary }}
        noOfSections={4}
        isAnimated
        // For a cleaner look, let's calculate the max value dynamically
        maxValue={Math.max(today.planned, week.planned, month.planned, 1) * 1.2}
      />
      
      {/* Legend */}
       <View className="flex-row items-center justify-center mt-4 gap-x-4">
          <View className="flex-row items-center gap-x-2">
              <View className="w-3 h-3 rounded-full" style={{backgroundColor: colors.accent}} />
              <Text className="text-xs font-semibold" style={{color: colors.textSecondary}}>Completed</Text>
          </View>
           <View className="flex-row items-center gap-x-2">
              <View className="w-3 h-3 rounded-full" style={{backgroundColor: colors.border}} />
              <Text className="text-xs font-semibold" style={{color: colors.textSecondary}}>Planned</Text>
          </View>
      </View>
    </Animated.View>
  );
}