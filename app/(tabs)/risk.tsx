import React from 'react';
import { Text } from 'react-native';
import { Screen } from '@/components/common/Screen';
import { RiskOMeter } from '@/components/risk/RiskOMeter';
import { useTheme } from '@/hooks/useTheme';

export default function RiskScreen() {

  const { colors } = useTheme();

  return (
    <Screen scrollable>
      <Text className="text-3xl font-bold text-text mb-4" style={{ color: colors.textPrimary }}>Health Risk Overview</Text>
      
      <RiskOMeter />
      
      {/* Additional content can go here, like detailed risk factor breakdowns */}
    </Screen>
  );
}