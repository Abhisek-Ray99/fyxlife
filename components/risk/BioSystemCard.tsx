import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface BioSystemCardProps {
  system: 'Cardio' | 'Neuro' | 'Respiratory';
  riskLevel: 'Low' | 'Medium' | 'High';
  metrics: { label: string; value: string }[];
  icon: React.ComponentProps<typeof Ionicons>['name'];
  index: number;
}

export function BioSystemCard({ system, riskLevel, metrics, icon, index }: BioSystemCardProps) {
  const { colors } = useTheme();

  const riskColor = riskLevel === 'Low' ? colors.success : riskLevel === 'Medium' ? colors.warning : colors.danger;
  
  return (
    <Animated.View 
      entering={FadeInUp.duration(500).delay(index * 150)}
      className="p-4 rounded-2xl mb-4" 
      style={{ backgroundColor: colors.card }}
    >
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>{system} System</Text>
          <Text className="text-sm font-semibold" style={{ color: riskColor }}>{riskLevel} Risk</Text>
        </View>
        <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: riskColor + '20' }}>
            <Ionicons name={icon} size={22} color={riskColor} />
        </View>
      </View>
      <View className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
        {metrics.map(metric => (
            <View key={metric.label} className="flex-row justify-between items-center mb-1">
                <Text className="text-base" style={{ color: colors.textSecondary }}>{metric.label}</Text>
                <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>{metric.value}</Text>
            </View>
        ))}
      </View>
    </Animated.View>
  );
}