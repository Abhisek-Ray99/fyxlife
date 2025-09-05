import { KpiCard } from '@/components/cards/KpiCard';
import { ProgressSummaryChart } from '@/components/charts/ProgressSummaryChart';
import { Screen } from '@/components/common/Screen';
import { useTheme } from '@/hooks/useTheme';
import { useKpiStore } from '@/store/useKpiStore';
import React from 'react';
import { Text, View } from 'react-native';

export default function ProgressScreen() {
    const { userKpis } = useKpiStore();
    const { colors } = useTheme();

    // Flatten KPIs for display
    const kpiList = [
        userKpis.restingHeartRate?.[0],
        userKpis.bloodPressure?.[0],
        userKpis.sleepQuality?.[0],
    ].filter(Boolean); // Filter out undefined values

  return (
    <Screen scrollable>
      <Text className="text-3xl font-bold text-text mb-4" style={{ color: colors.textPrimary }}>Your Progress</Text>
      
      <ProgressSummaryChart />

      <Text className="text-xl font-bold text-text mt-6 mb-4" style={{ color: colors.textSecondary }}>Key Health Indicators</Text>
       <View className="flex-row flex-wrap justify-between">
            {kpiList.map((kpi, index) => kpi && (
                 <View key={index} className="w-[48%] mb-4">
                     <KpiCard kpi={kpi} />
                </View>
            ))}
       </View>
    </Screen>
  );
}