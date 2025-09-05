// WelcomeScreen.tsx
import React, { useState } from 'react';
import { Text, View, Pressable, useWindowDimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated,
{
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useDerivedValue,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Button } from '@/components/common/Button';
import { PreferenceTag } from '@/components/onboarding/PreferenceTag';
import { ProgressIndicator } from '@/components/onboarding/ProgressIndicator';
import { Preference } from '@/types';
import { useTheme } from '@/hooks/useTheme';

interface OnboardingStep {
  title: string;
  description: string;
}

const SWIPE_THRESHOLD = 80;
const SPRING_CONFIG = { damping: 18, stiffness: 150 };

const STEPS_DATA: OnboardingStep[] = [
  {
    title: 'Personalize Wellness',
    description: 'Select your dietary preferences to help us tailor your experience.',
  },
  {
    title: 'Define Your Lifestyle',
    description: 'Let us know your lifestyle goals for better recommendations.',
  },
  {
    title: 'Ready to Begin?',
    description: 'Your personalized health journey is just one tap away.',
  },
];

const ALL_PREFERENCES: Preference[] = [
  { label: 'Organic', icon: 'leaf-outline', color: '#65C18C' },
  { label: 'Gluten-Free', icon: 'restaurant-outline', color: '#FFFFFF' },
  { label: 'Dairy Free', icon: 'ellipse-outline', color: '#FFFFFF' },
  { label: 'Low Sugar', icon: 'cube-outline', color: '#88D9E6' },
  { label: 'Keto', icon: 'flame-outline', color: '#FFD36E' },
  { label: 'Whole30', icon: 'refresh-circle-outline', color: '#FFFFFF' },
  { label: 'Vegetarian', icon: 'leaf-outline', color: '#94412b' },
  { label: 'Vegan', icon: 'heart-outline', color: '#65C18C' },

  { label: 'High Protein', icon: 'barbell-outline', color: '#65C18C' },
  { label: 'Low Carb', icon: 'cut-outline', color: '#FFFFFF' },
  { label: 'Fasting', icon: 'time-outline', color: '#FFD36E' },
  { label: 'Paleo', icon: 'bonfire-outline', color: '#88D9E6' },
  { label: 'Mediterranean', icon: 'boat-outline', color: '#6e5628' },
  { label: 'Pescatarian', icon: 'fish-outline', color: '#FFFFFF' },
  { label: 'Mindful Eating', icon: 'happy-outline', color: '#65C18C' },
  { label: 'Flexitarian', icon: 'shuffle-outline', color: '#FFFFFF' },

  { label: 'Track Health', icon: 'pulse-outline', color: '#65C18C' },
  { label: 'Eat Better', icon: 'nutrition-outline', color: '#FFD36E' },
  { label: 'Stay Active', icon: 'walk-outline', color: '#88D9E6' },
  { label: 'Be Mindful', icon: 'headset-outline', color: '#FFFFFF' },
  { label: 'Improve Sleep', icon: 'moon-outline', color: '#3A3A5E' },
  { label: 'Manage Stress', icon: 'leaf-outline', color: '#65C18C' },
  { label: 'Build Muscle', icon: 'fitness-outline', color: '#FFFFFF' },
  { label: 'Lose Weight', icon: 'scale-outline', color: '#FFD36E' },
];

// layout configs for 8 tags per screen
const SCREEN_TAG_LAYOUTS: { xPct: number; yPct: number }[][] = [
  [
    { xPct: 0.03, yPct: 0.07 },
    { xPct: 0.50, yPct: 0.07 },
    { xPct: -0.01, yPct: 0.20 },
    { xPct: 0.57, yPct: 0.20 },
    { xPct: 0.04, yPct: 0.33 },
    { xPct: 0.39, yPct: 0.33 },
    { xPct: 0.02, yPct: 0.46 },
    { xPct: 0.60, yPct: 0.46 },
  ],
  [
    { xPct: 0.12, yPct: 0.07 },
    { xPct: 0.78, yPct: 0.07 },
    { xPct: 0.10, yPct: 0.20 },
    { xPct: 0.56, yPct: 0.20 },
    { xPct: -0.14, yPct: 0.33 },
    { xPct: 0.56, yPct: 0.33 },
    { xPct: -0.01, yPct: 0.46 },
    { xPct: 0.72, yPct: 0.46 },
  ],
  [
    { xPct: 0.28, yPct: 0.07 },
    { xPct: 0.94, yPct: 0.07 },
    { xPct: -0.06, yPct: 0.20 },
    { xPct: 0.55, yPct: 0.20 },
    { xPct: 0.18, yPct: 0.33 },
    { xPct: 0.87, yPct: 0.33 },
    { xPct: 0.34, yPct: 0.46 },
    { xPct: 1.00, yPct: 0.46 },
  ],
];

export default function WelcomeScreen() {
  const { mode } = useTheme();
  const router = useRouter();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [currentStep, setCurrentStep] = useState(0);

  // pager shared values
  const baseTranslateX = useSharedValue(0);
  const gestureX = useSharedValue(0);
  const translateX = useDerivedValue(() => baseTranslateX.value + gestureX.value);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const goToStep = (stepIndex: number) => {
    const clamped = Math.max(0, Math.min(STEPS_DATA.length - 1, stepIndex));
    setCurrentStep(clamped);
    baseTranslateX.value = withSpring(-clamped * screenWidth, SPRING_CONFIG);
    gestureX.value = 0;
  };

  const handleNext = () => {
    if (currentStep < STEPS_DATA.length - 1) {
      goToStep(currentStep + 1);
    } else {
      router.push('/(onboarding)/user-info');
    }
  };

  const handleSkip = () => {
    router.push('/(onboarding)/user-info');
  };

  // swipe gesture
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      gestureX.value = e.translationX;
    })
    .onEnd((e) => {
      const vel = e.velocityX;
      const translate = baseTranslateX.value + e.translationX;
      const rawIndex = -translate / screenWidth;
      let target = Math.round(rawIndex);

      if (e.translationX < -SWIPE_THRESHOLD || (vel < -800 && rawIndex < currentStep + 0.4)) {
        target = Math.min(currentStep + 1, STEPS_DATA.length - 1);
      } else if (e.translationX > SWIPE_THRESHOLD || (vel > 800 && rawIndex > currentStep - 0.4)) {
        target = Math.max(currentStep - 1, 0);
      }

      target = Math.max(0, Math.min(STEPS_DATA.length - 1, target));
      baseTranslateX.value = withSpring(-target * screenWidth, SPRING_CONFIG);
      gestureX.value = withSpring(0, SPRING_CONFIG);
      runOnJS(setCurrentStep)(target);
    });

  // theme colors
  const isDark = mode === 'dark';
  const ThemeMode = isDark ? '#000000' : '#faffe3';
  const ThemeBg = isDark ? '#253429' : '#f2fff2';
  const textPrimary = isDark ? '#f2fff2' : '#1f2937'; // gray-800
  const textSecondary = isDark ? '#d1d5db' : '#4b5563'; // gray-600
  const titleText = isDark ? '#ffffff' : '#111827'; // gray-900

  const renderAllTags = () => {
    const all: React.ReactNode[] = [];

    ALL_PREFERENCES.forEach((pref, idx) => {
      const screenIdx = Math.floor(idx / 8);
      const tagIdx = idx % 8;
      const layout = SCREEN_TAG_LAYOUTS[screenIdx][tagIdx];
      if (!layout) return;

      const leftBase = screenIdx * screenWidth + layout.xPct * screenWidth;
      const top = layout.yPct * screenHeight;

      const CHAR_WIDTH = 12;
      const BASE_PADDING = 50;
      const TAG_WIDTH = pref.label.length * CHAR_WIDTH + BASE_PADDING;
      const TAG_HEIGHT = 64;

      const tagAnimatedStyle = useAnimatedStyle(() => {
        const tagCenterX = leftBase + TAG_WIDTH / 2;
        const viewportCenter = -translateX.value + screenWidth / 2;
        const distance = Math.abs(tagCenterX - viewportCenter);

        const opacity = interpolate(
          distance,
          [0, screenWidth * 0.7, screenWidth * 1.2],
          [1, 0.9, 0.4],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return {
          position: 'absolute',
          left: leftBase,
          top,
          width: TAG_WIDTH,
          height: TAG_HEIGHT,
          opacity,
        };
      });

      all.push(
        <Animated.View key={`${pref.label}-${idx}`} style={tagAnimatedStyle} pointerEvents="none">
          <PreferenceTag preference={pref} />
        </Animated.View>
      );
    });

    return all;
  };

  return (
    <GestureDetector gesture={panGesture}>
      <LinearGradient colors={[ThemeMode, ThemeBg]} style={styles.gradient}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 pt-6">
          <Text className="text-2xl font-bold" style={{ color: textPrimary }}>
            🌱 Fyxlife
          </Text>
          <Pressable onPress={handleSkip} className="bg-[#ccf446] px-5 py-2 rounded-full mt-4">
            <Text className="text-xl font-semibold text-[#154419]">Skip</Text>
          </Pressable>
        </View>

        {/* Pager */}
        <View style={{ flex: 1, overflow: 'hidden' }}>
          <Animated.View
            style={[
              {
                width: screenWidth * STEPS_DATA.length,
                height: screenHeight * 0.52,
                position: 'relative',
              },
              containerAnimatedStyle,
            ]}
          >
            {renderAllTags()}
          </Animated.View>
        </View>


        {/* Footer */}
        <View className="px-6 pt-6 rounded-t-3xl">
          <Animated.View
            key={currentStep}
            entering={FadeIn.duration(480)}
            exiting={FadeOut.duration(220)}
          >
            <Text className="text-4xl font-bold" style={{ color: titleText }}>
              {STEPS_DATA[currentStep].title}
            </Text>
            <Text className="text-lg mt-2 mb-6 pr-10" style={{ color: textSecondary }}>
              {STEPS_DATA[currentStep].description}
            </Text>
          </Animated.View>

          <View className="flex flex-row justify-between items-center mb-6">
            <ProgressIndicator count={STEPS_DATA.length} currentIndex={currentStep} />
            <Button
              title={currentStep === STEPS_DATA.length - 1 ? 'Get Started' : 'Next'}
              onPress={handleNext}
            />
          </View>
        </View>
      </LinearGradient>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1, // should work on Android
    // For iOS, sometimes you also need:
    minHeight: '100%', 
    paddingVertical: 20,
  },
});
