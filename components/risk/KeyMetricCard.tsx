import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface KeyMetricCardProps {
  label: string;
  value: string;
  unit: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

export function KeyMetricCard({ label, value, unit, icon }: KeyMetricCardProps) {
  const { colors } = useTheme();
  return (
    <View className="flex-1 p-4 rounded-2xl" style={{ backgroundColor: colors.card }}>
        <View className="flex-row items-center gap-x-2">
            <Ionicons name={icon} size={16} color={colors.textSecondary} />
            <Text className="text-sm" style={{ color: colors.textSecondary }}>{label}</Text>
        </View>
        <Text className="text-3xl font-bold mt-2" style={{ color: colors.textPrimary }}>
            {value}
            <Text className="text-base font-medium"> {unit}</Text>
        </Text>
    </View>
  );
}