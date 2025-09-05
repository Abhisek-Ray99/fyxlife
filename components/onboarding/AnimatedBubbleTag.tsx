import React, { useEffect } from 'react';
import { Text, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

interface AnimatedBubbleTagProps {
  label: string;
  index: number;
}

const COLORS = ['#bef264', '#84cc16', '#FFFFFF', '#4d7c0f']; // Lime/Green theme

export function AnimatedBubbleTag({ label, index }: AnimatedBubbleTagProps) {
  const { width: screenWidth } = useWindowDimensions();
  const progress = useSharedValue(0);

  useEffect(() => {
    // Animate in with a staggered delay based on the index
    progress.value = withDelay(index * 100, withTiming(1, { duration: 1500 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [100, -300] // Start below the visible area and float up
    );
    const opacity = interpolate(
      progress.value,
      [0, 0.2, 0.8, 1],
      [0, 1, 1, 0], // Fade in, stay visible, then fade out
      Extrapolate.CLAMP
    );
    const scale = interpolate(
      progress.value,
      [0, 0.2, 1],
      [0.5, 1, 0.5], // Scale up then down
      Extrapolate.CLAMP
    );
    // Random horizontal position for each bubble
    const translateX = interpolate(
        index % 4, // Simple way to distribute horizontally
        [0, 1, 2, 3],
        [-screenWidth * 0.3, screenWidth * 0.2, -screenWidth * 0.2, screenWidth * 0.3]
    )

    return {
      opacity,
      transform: [{ translateY }, { translateX }, { scale }],
    };
  });
  
  // Choose colors based on index for variety
  const bgColor = COLORS[index % 3]; // Use first 3 colors for background
  const textColor = bgColor === '#FFFFFF' ? '#1a2e05' : '#FFFFFF';

  return (
    <Animated.View
      style={[{ backgroundColor: bgColor }, animatedStyle]}
      className="absolute px-6 py-3 rounded-full shadow-lg"
    >
      <Text className="text-lg font-bold" style={{ color: textColor }}>
        {label}
      </Text>
    </Animated.View>
  );
}