import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Screen } from '@/components/common/Screen';
import { useUserStore } from '@/store/useUserStore';
import { useGoalStore } from '@/store/useGoalStore';
import { useStreak } from '@/hooks/useStreak';
import { MainGoalProgress } from '@/components/dashboard/MainGoalProgress';
import { StatCircle } from '@/components/dashboard/StatCircle';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { ThemeSettingsModal } from '@/components/settings/ThemeSettingsModal';

export default function DashboardScreen() {
  const profile = useUserStore((state) => state.profile);
  const { goals } = useGoalStore();
  const { currentStreak } = useStreak();
  const { colors } = useTheme();

  const [settingsVisible, setSettingsVisible] = useState(false);

  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;
  const overallProgress = totalGoals > 0 ? completedGoals / totalGoals : 0;

  const moveGoal = goals.find(g => g.category === 'Move');
  const eatGoal = goals.find(g => g.category === 'Eat');
  const calmGoal = goals.find(g => g.category === 'Calm');

  return (
    <Screen scrollable>
      <ThemeSettingsModal isVisible={settingsVisible} onClose={() => setSettingsVisible(false)} />

      <View className="flex-row justify-between items-start">
        <View>
          <Text className={`text-lg`} style={{ color: colors.textPrimary }}>Hello, {profile?.name}</Text>
          <Text className={`text-3xl font-bold`} style={{ color: colors.textSecondary }}>Today's Summary</Text>
        </View>
        <Pressable onPress={() => setSettingsVisible(true)} className="p-2">
            <Ionicons name="color-palette-outline" size={28} color={colors.textSecondary} />
        </Pressable>
      </View>
       
      {currentStreak > 0 && (
         <View className="flex-row items-center justify-center my-4 p-2 rounded-full bg-card">
            <Text className="text-accent font-bold text-lg">{currentStreak} DAY STREAK</Text>
            <Text className="text-accent text-lg"> 🔥</Text>
         </View>
      )}

      <MainGoalProgress
        progress={overallProgress}
        value={completedGoals.toString()}
        unit={`of ${totalGoals} goals`}
      />

      <View className="flex-row justify-around">
        {moveGoal && (
          <StatCircle
            icon="walk"
            value={moveGoal.current.toString()}
            label={moveGoal.unit}
            progress={moveGoal.target > 0 ? moveGoal.current / moveGoal.target : 0}
          />
        )}
        {eatGoal && (
          <StatCircle
            icon="restaurant"
            value={eatGoal.current.toString()}
            label={eatGoal.unit}
            progress={eatGoal.target > 0 ? eatGoal.current / eatGoal.target : 0}
          />
        )}
        {calmGoal && (
          <StatCircle
            icon="leaf"
            value={calmGoal.current.toString()}
            label={calmGoal.unit}
            progress={calmGoal.target > 0 ? calmGoal.current / calmGoal.target : 0}
          />
        )}
      </View>
      
    </Screen>
  );
}