import React, { useRef, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeOutUp, ZoomIn } from 'react-native-reanimated';

import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import { useUserStore } from '@/store/useUserStore';
import { AnimatedBubbleTag } from '@/components/onboarding/AnimatedBubbleTag'; // Import the new component
import { useTheme } from '@/hooks/useTheme';

const BUBBLE_TAGS = [
  'Wellness', 'Strength', 'Clarity', 'Energy',
  'Focus', 'Balance', 'Growth', 'Vitality',
  'Rest', 'Nutrition', 'Hydration', 'Mindfulness'
];

export default function ConfirmationScreen() {
  const router = useRouter();
  const profile = useUserStore((state) => state.profile);
  const { colors } = useTheme(); // Use theme colors

  const handleFinish = () => {
    router.replace('/(tabs)/dashboard');
  };

  return (
    <Screen contentContainerStyle={{ backgroundColor: '#f0fdf4' }}>
      {/* Background Bubbles Animation */}
      <View className="absolute inset-0 items-center justify-center">
        {BUBBLE_TAGS.map((label, index) => (
          <AnimatedBubbleTag key={index} label={label} index={index} />
        ))}
      </View>
    

      {/* Main Content */}
      <Animated.View
        entering={ZoomIn.duration(800).delay(200)}
        className="items-center z-10 p-6 rounded-2xl"
      >
        <Text className="text-4xl font-bold text-center mb-2" style={{ color: '#1a2e05' }}>
          You're all set,
        </Text>
        <Text className="text-5xl font-extrabold text-center" style={{ color: '#4d7c0f' }}>
          {profile?.name}! 🎉
        </Text>
        <Text className="text-lg text-center mt-4" style={{ color: '#3f6212' }}>
          Your profile is ready for a new chapter in wellness.
        </Text>
      </Animated.View>

      <Animated.View 
        className="w-full px-8 absolute bottom-16"
        entering={FadeInUp.duration(600).delay(1000)}
      >
        <Button title="Go to Dashboard" onPress={handleFinish} />
      </Animated.View>
    </Screen>
  );
}