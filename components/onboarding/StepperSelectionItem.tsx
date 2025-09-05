import React from 'react';
import { Text, Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  useSharedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

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
  const selectionProgress = useSharedValue(0);

  React.useEffect(() => {
    selectionProgress.value = withTiming(isSelected ? 1 : 0, { duration: 250 });
  }, [isSelected]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      selectionProgress.value,
      [0, 1],
      ['#e5f2e3', '#e5f2e3'] // White to light green
    );
    const borderColor = interpolateColor(
      selectionProgress.value,
      [0, 1],
      ['#e5f2e3', '#154419'] // Gray-50 to dark green
    );
    return { backgroundColor, borderColor };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      selectionProgress.value,
      [0, 1],
      ['#4B5563', '#052C65'] // Gray-600 to a custom dark blue
    );
    return { color };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      style={animatedContainerStyle}
      className="flex-row items-center justify-between p-4 rounded-lg border-2 mb-4"
    >
      {/* Left side content */}
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

      {/* Right side tick if selected */}
      {isSelected && (
        <Ionicons name="checkmark-circle" size={22} color="#154419" />
      )}
    </AnimatedPressable>
  );
}
