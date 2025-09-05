import { Screen } from '@/components/common/Screen';
import { BioSystemCard } from '@/components/risk/BioSystemCard';
import { RiskScoreHeader } from '@/components/risk/RiskScoreHeader';
import { useTheme } from '@/hooks/useTheme';
import { useKpiStore } from '@/store/useKpiStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function RiskScreen() {
  const { colors } = useTheme();
  const { userKpis } = useKpiStore();

  // --- DERIVE REAL DATA & SCORES ---
  const riskAnalysis = useMemo(() => {
    // In a real app, this logic would be much more sophisticated.
    // This is a simplified example for demonstration.
    const bp = userKpis.bloodPressure?.[0]?.value;
    const hrRaw = userKpis.restingHeartRate?.[0]?.value;
    const sleepRaw = userKpis.sleepQuality?.[0]?.value;
    const hr = typeof hrRaw === 'number' ? hrRaw : 70;
    const sleep = typeof sleepRaw === 'number' ? sleepRaw : 75;

    // Cardio Score (example)
    let cardioScore = 100;
    if (bp && typeof bp === 'object' && (bp.systolic > 130 || bp.diastolic > 85)) cardioScore -= 30;
    if (hr > 80) cardioScore -= 20;
    const cardioRisk: 'High' | 'Medium' | 'Low' = cardioScore < 50 ? 'High' : cardioScore < 80 ? 'Medium' : 'Low';

    // Neuro Score (example)
    let neuroScore = 100;
    if (sleep < 70) neuroScore -= 40;
    const neuroRisk: 'High' | 'Medium' | 'Low' = neuroScore < 50 ? 'High' : neuroScore < 80 ? 'Medium' : 'Low';
    
    // Overall Health Score
    const overallScore = (cardioScore + neuroScore) / 2;

    return {
      overallScore,
      cardio: {
        riskLevel: cardioRisk,
        metrics: [
          { label: 'Blood Pressure', value: (bp && typeof bp === 'object') ? `${bp.systolic}/${bp.diastolic}` : 'N/A' },
          { label: 'Resting Heart Rate', value: `${hr} bpm` },
        ]
      },
      neuro: {
        riskLevel: neuroRisk,
        metrics: [
            { label: 'Sleep Quality', value: `${sleep}%` },
            { label: 'Stress Levels', value: 'Low' }, // Mocked
        ]
      },
      respiratory: { // Mocked data
        riskLevel: 'Low' as 'Low',
        metrics: [
            { label: 'Oxygen Saturation', value: '98%' },
            { label: 'VO2 Max', value: 'Good' },
        ]
      },
    };
  }, [userKpis]);

  return (
    <Screen scrollable>
      <Text className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>Health Risk Overview</Text>
      <Text className="text-base mb-4" style={{ color: colors.textSecondary }}>A summary of your key bio-markers and potential risks.</Text>
      
      <RiskScoreHeader score={riskAnalysis.overallScore} />

      {/* Bio System Cards */}
      <BioSystemCard
        index={0}
        system="Cardio"
        icon="heart-outline"
        riskLevel={riskAnalysis.cardio.riskLevel}
        metrics={riskAnalysis.cardio.metrics}
      />
      <BioSystemCard
        index={1}
        system="Neuro"
        icon="headset-outline"
        riskLevel={riskAnalysis.neuro.riskLevel}
        metrics={riskAnalysis.neuro.metrics}
      />
      <BioSystemCard
        index={2}
        system="Respiratory"
        icon="body-outline"
        riskLevel={riskAnalysis.respiratory.riskLevel}
        metrics={riskAnalysis.respiratory.metrics}
      />
      
      {/* THE CTA */}
      <Animated.View entering={FadeInUp.duration(500).delay(600)}>
          <Pressable 
            className="flex-row justify-between items-center p-4 rounded-2xl mt-4" 
            style={{ backgroundColor: colors.accent }}
            onPress={() => console.log('Navigate to Organ Analytics')}
          >
            <View>
                <Text className="text-lg font-bold" style={{ color: colors.accentText }}>Deep Dive</Text>
                <Text className="text-base" style={{ color: colors.accentText }}>Organ & Cellular Analytics</Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={32} color={colors.accentText} />
          </Pressable>
      </Animated.View>
      
    </Screen>
  );
}