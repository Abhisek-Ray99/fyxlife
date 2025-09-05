import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface StepperProgressBarProps {
  totalSteps: number;
  currentStep: number; // 0-indexed
}

export function StepperProgressBar({ totalSteps, currentStep }: StepperProgressBarProps) {
  const progress = (currentStep + 1) / totalSteps;

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress * 100}%`, { duration: 300 }),
  }));

  return (
    <View className="w-full h-2 bg-[#e5f2e3] rounded-full overflow-hidden">
      <Animated.View
        className="h-full rounded-full"
        style={[{ backgroundColor: '#ccf446' }, animatedStyle]}
      />
    </View>
  );
}