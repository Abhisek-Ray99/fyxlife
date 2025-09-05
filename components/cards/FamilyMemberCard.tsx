import { useTheme } from '@/hooks/useTheme';
import { FamilyMember, Kpi } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

// A small, reusable component to display a single KPI with an icon.
const KpiIndicator = ({ kpi }: { kpi?: Kpi }) => {
    const { colors } = useTheme();

    if (!kpi) return null;

    const getIconName = (label: string): React.ComponentProps<typeof Ionicons>['name'] => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes('step')) return 'walk-outline';
        if (lowerLabel.includes('sleep')) return 'moon-outline';
        if (lowerLabel.includes('heart')) return 'heart-outline';
        if (lowerLabel.includes('pressure')) return 'pulse-outline';
        return 'stats-chart-outline';
    };
    
    const displayValue = typeof kpi.value === 'object' 
        ? `${kpi.value.systolic}/${kpi.value.diastolic}` 
        : kpi.value.toLocaleString();

    return (
        <View className="flex-row items-center gap-x-2 mt-2">
            <Ionicons name={getIconName(kpi.label)} size={16} color={colors.textSecondary} />
            <Text className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                {displayValue}
                <Text className="text-xs" style={{ color: colors.textSecondary }}> {kpi.unit}</Text>
            </Text>
        </View>
    );
};

interface FamilyMemberCardProps {
  member: FamilyMember;
}

export function FamilyMemberCard({ member }: FamilyMemberCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  
  // Flatten KPIs safely (cholesterol is an object of arrays)
  const kpisToShow: Kpi[] = (() => {
    const result: Kpi[] = [];
    const kpis = member.kpis as any;
    for (const key in kpis) {
      if (key === 'cholesterol' && kpis.cholesterol) {
        const chol = kpis.cholesterol as { total: Kpi[]; ldl: Kpi[]; hdl: Kpi[]; triglycerides: Kpi[] };
        result.push(...chol.total, ...chol.ldl, ...chol.hdl, ...chol.triglycerides);
      } else {
        const arr = kpis[key] as Kpi[] | undefined;
        if (Array.isArray(arr)) result.push(...arr);
      }
    }
    return result.slice(0, 3);
  })();
  
  return (
    <Pressable
      // In a real app, this would navigate to the member's detailed profile page.
      onPress={() => console.log(`Navigating to ${member.name}'s profile...`)}
      className="w-48 mr-4 p-4 rounded-2xl"
      style={{ backgroundColor: colors.card }}
    >
        <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>{member.name}</Text>
        <Text className="text-sm" style={{ color: colors.textSecondary }}>{member.relationship}</Text>
        <View className="mt-2">
            {kpisToShow.map((kpi, index) => (
                <KpiIndicator key={index} kpi={kpi} />
            ))}
        </View>
    </Pressable>
  );
}