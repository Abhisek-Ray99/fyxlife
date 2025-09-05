import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Kpi } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

// Define a type for the health status of a KPI
export type KpiStatus = 'good' | 'fair' | 'poor';

interface KpiCardProps {
  kpi: Kpi;
  status: KpiStatus;
  index: number;
}

export function KpiCard({ kpi, status, index }: KpiCardProps) {
  const { colors } = useTheme();

  const getStatusStyle = () => {
    switch (status) {
      case 'good':
        return { icon: 'checkmark-circle' as const, color: colors.success };
      case 'fair':
        return { icon: 'alert-circle' as const, color: colors.warning };
      case 'poor':
        return { icon: 'close-circle' as const, color: colors.danger };
      default:
        return { icon: 'help-circle' as const, color: colors.textSecondary };
    }
  };

  const { icon: statusIcon, color: statusColor } = getStatusStyle();

  // Handle both simple and complex (blood pressure) KPI values
  const displayValue = typeof kpi.value === 'object'
    ? `${kpi.value.systolic}/${kpi.value.diastolic}`
    : kpi.value.toString();

  return (
    <Animated.View entering={FadeInUp.duration(500).delay(index * 100)}>
      <Pressable 
        className="p-4 rounded-2xl h-full" 
        style={{ backgroundColor: colors.card }}
        onPress={() => console.log(`Viewing details for ${kpi.label}`)} // Implicit CTA
      >
        <View className="flex-row items-center justify-between">
          <Text 
            className="text-sm font-medium" 
            style={{ color: colors.textSecondary }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {kpi.label}
          </Text>
          <Ionicons name={statusIcon} size={22} color={statusColor} />
        </View>

        <View className="flex-1 justify-center">
            <Text className="text-4xl font-bold mt-2" style={{ color: colors.textPrimary }}>
                {displayValue}
                <Text className="text-base font-medium" style={{ color: colors.textSecondary }}> {kpi.unit}</Text>
            </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}