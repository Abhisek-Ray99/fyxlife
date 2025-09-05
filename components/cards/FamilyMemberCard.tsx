import { FamilyMember, Kpi, KpiData } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface FamilyMemberCardProps {
  member: FamilyMember;
}

export function FamilyMemberCard({ member }: FamilyMemberCardProps) {
  const allKpis: Kpi[] = [];
  const kpis: KpiData = member.kpis;
  for (const key in kpis) {
    if (key === 'cholesterol' && kpis.cholesterol) {
      const chol = kpis.cholesterol;
      allKpis.push(...chol.total, ...chol.ldl, ...chol.hdl, ...chol.triglycerides);
    } else {
      const arr = (kpis as any)[key] as Kpi[] | undefined;
      if (Array.isArray(arr)) allKpis.push(...arr);
    }
  }
  const firstKpi = allKpis[0];
  const secondKpi = allKpis[1];

  return (
    <View className="bg-white p-4 rounded-xl shadow-md w-48 mr-4">
      <Text className="text-base font-bold text-text">{member.name}</Text>
      <Text className="text-sm text-muted mb-3">{member.relationship}</Text>
      {firstKpi && (
         <View className="flex-row items-center gap-x-2 mb-1">
           <Ionicons name="heart-circle-outline" size={18} color="#EF4444"/>
            <Text className="text-sm text-text">
                {typeof firstKpi.value === 'object' ? `${firstKpi.value.systolic}/${firstKpi.value.diastolic}` : firstKpi.value} {firstKpi.unit}
            </Text>
         </View>
      )}
       {secondKpi && (
         <View className="flex-row items-center gap-x-2">
           <Ionicons name="walk-outline" size={18} color="#3B82F6"/>
            <Text className="text-sm text-text">
               {typeof secondKpi.value === 'object' ? `${secondKpi.value.systolic}/${secondKpi.value.diastolic}` : secondKpi.value} {secondKpi.unit}
            </Text>
         </View>
      )}
    </View>
  );
}