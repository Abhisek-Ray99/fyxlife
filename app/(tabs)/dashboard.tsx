import { FamilyMemberCard } from '@/components/cards/FamilyMemberCard';
import { MetricCard } from '@/components/cards/MetricCard';
import { WeeklyProgressCard } from '@/components/cards/WeeklyProgressCard';
import { Screen } from '@/components/common/Screen';
import { MainGoalProgress } from '@/components/dashboard/MainGoalProgress';
import { StatCircle } from '@/components/dashboard/StatCircle';
import { ThemeSettingsModal } from '@/components/settings/ThemeSettingsModal';
import { useStreak } from '@/hooks/useStreak';
import { useTheme } from '@/hooks/useTheme';
import { useFamilyStore } from '@/store/useFamilyStore';
import { useGoalStore } from '@/store/useGoalStore';
import { useKpiStore } from '@/store/useKpiStore';
import { useUserStore } from '@/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

// Header component for cleaner code
const DashboardHeader = ({ name, onOpenSettings }: { name: string; onOpenSettings: () => void }) => {
  const { colors } = useTheme();
  return (
    <View className="flex-row justify-between items-center mb-6">
      <View>
        <Text className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
          Activity
        </Text>
        <Text className="text-lg" style={{ color: colors.textSecondary }}>
          Hello, {name}
        </Text>
      </View>
      <Pressable onPress={onOpenSettings} className="p-2">
        <Ionicons name="color-palette-outline" size={28} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
};

export default function DashboardScreen() {
  const profile = useUserStore((state) => state.profile);
  const { goals } = useGoalStore();
  const { currentStreak } = useStreak();
  const { familyMembers } = useFamilyStore();
  const { colors } = useTheme();

  const [settingsVisible, setSettingsVisible] = useState(false);

  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;
  const overallProgress = totalGoals > 0 ? completedGoals / totalGoals : 0;

  const moveGoal = goals.find(g => g.category === 'Move');
  const eatGoal = goals.find(g => g.category === 'Eat');
  const calmGoal = goals.find(g => g.category === 'Calm');

  const { userKpis } = useKpiStore();

  const dashboardData = useMemo(() => {
    // 1. Weekly Progress Data
    const moveGoal = goals.find(g => g.category === 'Move');
    const weeklyTarget = 5; // Example: 5 exercise days a week
    // In a real app, this would come from historical goal data. For now, we'll mock it.
    const weekData = [true, false, true, true, false, false, false]; // M, T, W, Th, F, S, S
    const completedDays = weekData.filter(Boolean).length;

    // 2. Steps Data
    const stepsGoal = 10000;
    const currentSteps = moveGoal?.current ?? 0;

    // 3. Resting Heart Rate Data
    const restingHeartRate = userKpis.restingHeartRate?.[0]?.value ?? 0;

    // 4. Sleep Data
    const sleepGoal = 8 * 60; // 8 hours in minutes
    const rawSleepValue = userKpis.sleepQuality?.[0]?.value;
    const sleepQualityPercent = typeof rawSleepValue === 'number' ? rawSleepValue : 0;
    const currentSleep = (sleepQualityPercent / 100) * sleepGoal; // Example calculation

    return {
      weeklyTarget,
      completedDays,
      weekData,
      stepsGoal,
      currentSteps,
      restingHeartRate,
      sleepGoal,
      currentSleep,
    };
  }, [goals, userKpis]);

  return (
    <Screen scrollable>
      <ThemeSettingsModal isVisible={settingsVisible} onClose={() => setSettingsVisible(false)} />

      <DashboardHeader name={profile?.name ?? 'User'} onOpenSettings={() => setSettingsVisible(true)} />

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

      <View className="flex-row justify-around pb-20">
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

      <WeeklyProgressCard
        title="Exercise days"
        completed={dashboardData.completedDays}
        total={dashboardData.weeklyTarget}
        weekData={dashboardData.weekData}
      />

      <MetricCard
        title="Steps"
        value={dashboardData.currentSteps.toLocaleString()}
        unit="Today"
        icon="walk"
        progress={dashboardData.currentSteps / dashboardData.stepsGoal}
      />

      <MetricCard
        title="Resting Heart Rate"
        value={String(dashboardData.restingHeartRate)}
        unit="bpm"
        icon="heart"
        progress={0.65} // Example static progress
      />

      <MetricCard
        title="Sleep Duration"
        value={`${Math.floor(dashboardData.currentSleep / 60)}h ${Math.round(dashboardData.currentSleep % 60)}m`}
        unit="Last night"
        icon="moon"
        progress={dashboardData.currentSleep / dashboardData.sleepGoal}
      />

      <View className="flex-row justify-between items-center mb-4 mt-6">
        <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          Family Circle
        </Text>
        {/* THE CTA */}
        <Pressable
          onPress={() => console.log('Manage Family pressed')}
          className="flex-row items-center gap-x-1"
        >
          <Text className="font-semibold" style={{ color: colors.accent }}>Manage</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.accent} />
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {familyMembers.map(member => (
          <FamilyMemberCard key={member.id} member={member} />
        ))}
      </ScrollView>

    </Screen>
  );
}