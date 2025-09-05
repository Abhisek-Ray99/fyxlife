import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface AnimatedSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

const SWITCH_WIDTH = 52;
const SWITCH_HEIGHT = 32;
const THUMB_SIZE = 28;

export function AnimatedSwitch({ isOn, onToggle }: AnimatedSwitchProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(isOn ? 1 : 0, { duration: 250 });
  }, [isOn]);

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value * (SWITCH_WIDTH - THUMB_SIZE - 4) }],
    };
  });

  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.border, colors.accent]
    );
    return { backgroundColor };
  });

  return (
    <Pressable onPress={onToggle}>
      <Animated.View
        style={[animatedTrackStyle, { width: SWITCH_WIDTH, height: SWITCH_HEIGHT }]}
        className="justify-center rounded-full"
      >
        <Animated.View
          style={[animatedThumbStyle, { width: THUMB_SIZE, height: THUMB_SIZE, margin: 2 }]}
          className="bg-white rounded-full items-center justify-center shadow"
        >
          {isOn && <Ionicons name="checkmark" size={18} color={colors.accent} />}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}