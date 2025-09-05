import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

interface StepperProgressBarProps {
  totalSteps: number;
  currentStep: number; // 0-indexed
}

export function StepperProgressBar({ totalSteps, currentStep }: StepperProgressBarProps) {
  const { mode, colors } = useTheme();
  const progress = (currentStep + 1) / totalSteps;

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress * 100}%`, { duration: 300 }),
  }));

  const trackColor = mode === 'dark' ? '#2c3a31' : '#e5f2e3';
  const progressColor = colors.accent ?? '#ccf446';

  return (
    <View style={{ width: '100%', height: 8, backgroundColor: trackColor, borderRadius: 9999, overflow: 'hidden' }}>
      <Animated.View
        style={[
          {
            height: '100%',
            borderRadius: 9999,
            backgroundColor: progressColor,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
