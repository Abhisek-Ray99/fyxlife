import { RiskData } from '@/types';
import React from 'react';
import { Text, View } from 'react-native';
import { SystemRiskGauge } from './SystemRiskGauge';
import { useTheme } from '@/hooks/useTheme';

const MOCK_RISK_DATA: RiskData[] = [
  { system: 'Neuro', riskScore: 35, factors: ['Stress', 'Lack of Sleep'] },
  { system: 'Cardio', riskScore: 68, factors: ['High BP', 'Cholesterol'] },
  { system: 'Respiratory', riskScore: 22, factors: ['Sedentary Lifestyle'] },
];

export function RiskOMeter() {

  const { colors } = useTheme();

  return (
    <View className="p-4 rounded-xl shadow-md my-4 items-center" style={{ backgroundColor: colors.card }}>
      <Text className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>Risk-o-meter</Text>
      <Text className="mb-6 text-center" style={{ color: colors.textSecondary }}>
        Point-in-time view of health risks based on your profile and KPIs.
      </Text>
      <View className="flex-row justify-around w-full">
        {MOCK_RISK_DATA.map((data) => (
          <SystemRiskGauge key={data.system} data={data} />
        ))}
      </View>
    </View>
  );
}