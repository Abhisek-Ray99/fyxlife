import { useTheme } from '@/hooks/useTheme';
import { Kpi } from '@/types';
import React from 'react';
import { Text, View } from 'react-native';

interface KpiCardProps {
  kpi: Kpi;
}

export function KpiCard({ kpi }: KpiCardProps) {

  const { colors } = useTheme();

  const displayValue = typeof kpi.value === 'object'
    ? `${kpi.value.systolic}/${kpi.value.diastolic}`
    : kpi.value.toString();

  return (
    <View className="p-4 rounded-lg shadow-sm flex-1" style={{ backgroundColor: colors.card }}>
      <Text className="text-sm mb-1" style={{ color: colors.textSecondary }}>{kpi.label}</Text>
      <View className="flex-row items-baseline">
        <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{displayValue}</Text>
        <Text className="text-base ml-1" style={{ color: colors.textSecondary }}>{kpi.unit}</Text>
      </View>
    </View>
  );
}