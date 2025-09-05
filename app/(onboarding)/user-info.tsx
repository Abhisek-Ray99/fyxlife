import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { StepperProgressBar } from '@/components/onboarding/StepperProgressBar';
import { StepperSelectionItem } from '@/components/onboarding/StepperSelectionItem';
import { HeightRuler } from '@/components/onboarding/HeightRuler';

import { useUserStore } from '@/store/useUserStore';
import { UserProfile, Gender, ActivityLevel } from '@/types';
import { useTheme } from '@/hooks/useTheme';

const TOTAL_STEPS = 4;

// Multi-selection hook
const useMultiSelection = (initialState: string[] = []) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(initialState);

  const toggleSelection = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return [selectedItems, toggleSelection] as const;
};

export default function UserInfoScreen() {
  const router = useRouter();
  const setProfile = useUserStore((state) => state.setProfile);
  const [currentStep, setCurrentStep] = useState(0);

  const { mode } = useTheme();

  // Light & Dark palettes
  const lightColors = {
    background: '#f3fff3',
    textPrimary: '#1f2937', // gray-800
    textSecondary: '#6b7280', // gray-500
    stepText: '#9ca3af', // gray-400
  };

  const darkColors = {
    background: '#0f1a12',
    textPrimary: '#f9fafb', // gray-50
    textSecondary: '#d1d5db', // gray-300
    stepText: '#6b7280', // gray-500
  };

  const palette = mode === 'dark' ? darkColors : lightColors;

  // --- FORM STATE ---
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const [height, setHeight] = useState(175);
  const [heightUnit, setHeightUnit] = useState('cm');

  const [fitnessGoals, toggleFitnessGoal] = useMultiSelection();

  const [diet, setDiet] = useState('');
  const [allergies, setAllergies] = useState('');

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(s => s + 1);
      return;
    }

    const profile: UserProfile = {
      name,
      age: parseInt(age, 10) || 0,
      phone: '',
      gender: (gender as Gender) || Gender.PreferNotToSay,
      activityLevel: ActivityLevel.ModeratelyActive,
    };

    setProfile(profile);
    router.push('/(onboarding)/confirmation');
  };

  const renderStepContent = () => {
    return (
      <Animated.View
        key={currentStep}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
      >
        {currentStep === 0 && (
          <>
            <Text
              className="text-3xl font-bold"
              style={{ color: palette.textPrimary }}
            >
              Personal Information
            </Text>
            <Text
              className="text-base mt-2 mb-6"
              style={{ color: palette.textSecondary }}
            >
              Let's start with the basics.
            </Text>

            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Abhisek Ray"
            />
            <Input
              label="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              placeholder="24"
            />

            <Text
              className="text-lg font-semibold mt-6 mb-2"
              style={{ color: palette.textPrimary }}
            >
              Gender
            </Text>
            <StepperSelectionItem
              label="Male"
              icon="male-outline"
              isSelected={gender === 'Male'}
              onPress={() => setGender('Male')}
            />
            <StepperSelectionItem
              label="Female"
              icon="female-outline"
              isSelected={gender === 'Female'}
              onPress={() => setGender('Female')}
            />
            <StepperSelectionItem
              label="Prefer not to say"
              icon="close-circle-outline"
              isSelected={gender === 'PreferNotToSay'}
              onPress={() => setGender('PreferNotToSay')}
            />
          </>
        )}

        {currentStep === 1 && (
          <View className="items-center">
            <Text
              className="text-3xl font-bold"
              style={{ color: palette.textPrimary }}
            >
              Enter Your Height
            </Text>
            <Text
              className="text-base mt-2 mb-10"
              style={{ color: palette.textSecondary }}
            >
              Your height will help us calculate your BMI.
            </Text>
            <HeightRuler
              onHeightChange={(h, unit) => {
                setHeight(h);
                setHeightUnit(unit);
              }}
            />
          </View>
        )}

        {currentStep === 2 && (
          <>
            <Text
              className="text-3xl font-bold"
              style={{ color: palette.textPrimary }}
            >
              Fitness Goals
            </Text>
            <Text
              className="text-base mt-2 mb-6"
              style={{ color: palette.textSecondary }}
            >
              What are you hoping to achieve? Select all that apply.
            </Text>
            <StepperSelectionItem
              label="Lose Weight"
              icon="scale-outline"
              isSelected={fitnessGoals.includes('Lose Weight')}
              onPress={() => toggleFitnessGoal('Lose Weight')}
            />
            <StepperSelectionItem
              label="Build Muscle"
              icon="barbell-outline"
              isSelected={fitnessGoals.includes('Build Muscle')}
              onPress={() => toggleFitnessGoal('Build Muscle')}
            />
            <StepperSelectionItem
              label="Improve Stamina"
              icon="walk-outline"
              isSelected={fitnessGoals.includes('Improve Stamina')}
              onPress={() => toggleFitnessGoal('Improve Stamina')}
            />
            <StepperSelectionItem
              label="Reduce Stress"
              icon="happy-outline"
              isSelected={fitnessGoals.includes('Reduce Stress')}
              onPress={() => toggleFitnessGoal('Reduce Stress')}
            />
          </>
        )}

        {currentStep === 3 && (
          <>
            <Text
              className="text-3xl font-bold"
              style={{ color: palette.textPrimary }}
            >
              Health & Diet
            </Text>
            <Text
              className="text-base mt-2 mb-6"
              style={{ color: palette.textSecondary }}
            >
              Any preferences or restrictions we should know about?
            </Text>
            <StepperSelectionItem
              label="Vegetarian"
              icon="leaf-outline"
              isSelected={diet === 'Vegetarian'}
              onPress={() => setDiet('Vegetarian')}
            />
            <StepperSelectionItem
              label="Vegan"
              icon="heart-outline"
              isSelected={diet === 'Vegan'}
              onPress={() => setDiet('Vegan')}
            />
            <StepperSelectionItem
              label="Non-Vegetarian"
              icon="restaurant-outline"
              isSelected={diet === 'Non-Vegetarian'}
              onPress={() => setDiet('Non-Vegetarian')}
            />
            <Input
              label="Allergies (optional)"
              value={allergies}
              onChangeText={setAllergies}
              placeholder="e.g., Peanuts, Shellfish"
            />
          </>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
      {/* Header with Progress Bar */}
      <View className="px-6 pt-4">
        <StepperProgressBar totalSteps={TOTAL_STEPS} currentStep={currentStep} />
        <Text
          className="text-sm font-semibold mt-4 uppercase"
          style={{ color: palette.stepText }}
        >
          Step {currentStep + 1} of {TOTAL_STEPS}
        </Text>
      </View>

      {/* Scrollable Form Content */}
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Sticky Footer with Continue Button */}
      <View
        className="absolute bottom-0 left-0 right-0 p-6"
        style={{ backgroundColor: palette.background }}
      >
        <Button
          title="Continue"
          onPress={handleNext}
          disabled={currentStep === 0 && (!name || !age || !gender)}
        />
      </View>
    </SafeAreaView>
  );
}
