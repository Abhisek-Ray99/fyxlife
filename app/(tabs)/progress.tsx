import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { Screen } from '@/components/common/Screen';
import { ProgressChartCard } from '@/components/charts/ProgressChartCard';
import { StreakTracker } from '@/components/progress/StreakTracker';
import { useTheme } from '@/hooks/useTheme';
import { useKpiStore } from '@/store/useKpiStore';
import { KpiCard, KpiStatus } from '@/components/cards/KpiCard';
import { Kpi } from '@/types';

// Business logic to determine the status of a KPI.
// In a real-world application, this might be moved to a separate `lib/health.ts` utility file.
const getKpiStatus = (kpi: Kpi): KpiStatus => {
    const { label, value } = kpi;
    const lowerLabel = label.toLowerCase();
    
    if (lowerLabel.includes('heart rate')) {
        if (typeof value === 'number') {
            if (value < 50 || value > 90) return 'poor';
            if (value < 60 || value > 80) return 'fair';
            return 'good';
        }
    }
    if (lowerLabel.includes('blood pressure')) {
        if (typeof value === 'object' && 'systolic' in value && 'diastolic' in value) {
            if (value.systolic > 130 || value.diastolic > 85) return 'poor';
            if (value.systolic > 120 || value.diastolic > 80) return 'fair';
            return 'good';
        }
    }
    if (lowerLabel.includes('sleep')) {
        if (typeof value === 'number') {
            if (value < 70) return 'poor';
            if (value < 85) return 'fair';
            return 'good';
        }
    }
    if (lowerLabel.includes('oxygen')) {
         if (typeof value === 'number') {
            if (value < 95) return 'poor';
            return 'good';
        }
    }
    // Default to 'good' for any KPIs without specific rules
    return 'good';
};

export default function ProgressScreen() {
    const { userKpis } = useKpiStore();
    const { colors } = useTheme();

    // Memoized selector to get the most recent data point for each KPI
    const kpiList = useMemo(() => {
        return Object.values(userKpis)
            // For each KPI type (e.g., restingHeartRate), take the first item in its array
            .map(kpiArray => (Array.isArray(kpiArray) ? kpiArray[0] : undefined))
            // Filter out any empty or undefined entries
            .filter((kpi): kpi is Kpi => kpi !== undefined);
    }, [userKpis]);

  return (
    <Screen scrollable>
      <Text className="text-3xl font-bold mb-6" style={{ color: colors.textPrimary }}>Your Progress</Text>

      <StreakTracker />
      
      <ProgressChartCard />

      <Text className="text-xl font-bold mt-8 mb-4" style={{ color: colors.textPrimary }}>Key Health Indicators</Text>
      
      <View className="flex-row flex-wrap -mx-2">
        {kpiList.map((kpi, index) => (
             // THE FIX: Adding a fixed height to this container view resolves the flexbox wrapping issue.
             <View key={kpi.label + index} className="w-1/2 px-2 mb-4" style={{ height: 150 }}>
                 <KpiCard 
                    kpi={kpi} 
                    status={getKpiStatus(kpi)} // Pass the calculated status
                    index={index} // Pass index for staggered animation
                 />
            </View>
        ))}
      </View>
    </Screen>
  );
}