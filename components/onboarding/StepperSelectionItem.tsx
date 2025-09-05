import React from 'react';
import { Text, Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  useSharedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface StepperSelectionItemProps {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  isSelected: boolean;
  onPress: () => void;
}

export function StepperSelectionItem({
  label,
  icon,
  isSelected,
  onPress,
}: StepperSelectionItemProps) {
  const { mode } = useTheme();
  const selectionProgress = useSharedValue(0);

  React.useEffect(() => {
    selectionProgress.value = withTiming(isSelected ? 1 : 0, { duration: 250 });
  }, [isSelected]);

  // Local colors for light & dark mode
  const lightColors = {
    background: '#e5f2e3',
    border: '#e5f2e3',
    borderActive: '#154419',
    text: '#4B5563',
    textActive: '#052C65',
    tick: '#154419',
  };

  const darkColors = {
    background: '#1e2a22',
    border: '#3b5446',
    borderActive: '#88c999',
    text: '#9CA3AF',
    textActive: '#ccf446',
    tick: '#ccf446',
  };

  const palette = mode === 'dark' ? darkColors : lightColors;

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      selectionProgress.value,
      [0, 1],
      [palette.background, palette.background]
    );
    const borderColor = interpolateColor(
      selectionProgress.value,
      [0, 1],
      [palette.border, palette.borderActive]
    );
    return { backgroundColor, borderColor };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      selectionProgress.value,
      [0, 1],
      [palette.text, palette.textActive]
    );
    return { color };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      style={animatedContainerStyle}
      className="flex-row items-center justify-between p-4 rounded-lg border-2 mb-4"
    >
      {/* Left side */}
      <View className="flex-row items-center">
        <Animated.Text style={animatedTextStyle}>
          <Ionicons name={icon} size={24} />
        </Animated.Text>
        <Animated.Text
          className="text-base font-semibold ml-4"
          style={animatedTextStyle}
        >
          {label}
        </Animated.Text>
      </View>

      {/* Right tick if selected */}
      {isSelected && (
        <Ionicons name="checkmark-circle" size={22} color={palette.tick} />
      )}
    </AnimatedPressable>
  );
}
