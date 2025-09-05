import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface ProgressIndicatorProps {
  count: number;
  currentIndex: number;
}

export function ProgressIndicator({ count, currentIndex }: ProgressIndicatorProps) {
  return (
    <View className="flex-row gap-x-2">
      {Array.from({ length: count }).map((_, index) => (
        <Dot key={index} isActive={index === currentIndex} />
      ))}
    </View>
  );
}

const Dot = ({ isActive }: { isActive: boolean }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(isActive ? 24 : 8, { duration: 300 }),
    backgroundColor: withTiming(isActive ? '#154419' : '#e5f2e3', { duration: 300 }),
  }));

  return <Animated.View className="h-2 rounded-full" style={animatedStyle} />;
};