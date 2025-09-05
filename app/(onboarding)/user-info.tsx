import React from 'react';
import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { StepperProgressBar } from '@/components/onboarding/StepperProgressBar';
import { StepperSelectionItem } from '@/components/onboarding/StepperSelectionItem';
import { HeightRuler } from '@/components/onboarding/HeightRuler';

import { useUserStore } from '@/store/useUserStore';
import { UserProfile, Gender, ActivityLevel } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOTAL_STEPS = 4;

// A custom hook to simplify managing state for lists where multiple items can be selected.
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

  // --- FORM STATE ---
  // Step 1: Personal Information
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  // Step 2: Body Metrics
  const [height, setHeight] = useState(175);
  const [heightUnit, setHeightUnit] = useState('cm');
  // NOTE: A similar state would be needed for a WeightRuler component
  // const [weight, setWeight] = useState(70);
  // const [weightUnit, setWeightUnit] = useState('kg');

  // Step 3: Fitness Goals
  const [fitnessGoals, toggleFitnessGoal] = useMultiSelection();

  // Step 4: Health & Diet
  const [diet, setDiet] = useState('');
  const [allergies, setAllergies] = useState('');

  const handleNext = () => {
    // If not on the last step, just advance to the next one
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(s => s + 1);
      return;
    }

    // On the final step, compile the profile and navigate
    const profile: UserProfile = {
      name,
      age: parseInt(age, 10) || 0,
      phone: '', // Phone number was removed from this flow
      gender: (gender as Gender) || Gender.PreferNotToSay,
      activityLevel: ActivityLevel.ModeratelyActive, // This could be a future step
    };

    // Here, you would also save the other collected data (height, weight, goals, diet)
    // to a relevant Zustand store (e.g., useKpiStore, useGoalStore).

    setProfile(profile);
    router.push('/(onboarding)/confirmation');
  };

  const renderStepContent = () => {
    // The key={currentStep} prop on Animated.View is essential.
    // It tells React to re-mount the component when the step changes,
    // which is what triggers the enter/exit animations.
    return (
      <Animated.View key={currentStep} entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
        {currentStep === 0 && (
          <>
            <Text className="text-3xl font-bold text-gray-800">Personal Information</Text>
            <Text className="text-base text-gray-500 mt-2 mb-6">
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

            {/* Gender Section */}
            <Text className="text-lg font-semibold text-gray-700 mt-6 mb-2">
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
            <Text className="text-3xl font-bold text-gray-800">Enter Your Height</Text>
            <Text className="text-base text-gray-500 mt-2 mb-10">Your height will help us calculate your BMI.</Text>
            <HeightRuler
              onHeightChange={(h, unit) => {
                setHeight(h);
                setHeightUnit(unit);
              }}
            />
            {/* A similar WeightRuler component would go here */}
          </View>
        )}

        {currentStep === 2 && (
          <>
            <Text className="text-3xl font-bold text-gray-800">Fitness Goals</Text>
            <Text className="text-base text-gray-500 mt-2 mb-6">What are you hoping to achieve? Select all that apply.</Text>
            <StepperSelectionItem label="Lose Weight" icon="scale-outline" isSelected={fitnessGoals.includes('Lose Weight')} onPress={() => toggleFitnessGoal('Lose Weight')} />
            <StepperSelectionItem label="Build Muscle" icon="barbell-outline" isSelected={fitnessGoals.includes('Build Muscle')} onPress={() => toggleFitnessGoal('Build Muscle')} />
            <StepperSelectionItem label="Improve Stamina" icon="walk-outline" isSelected={fitnessGoals.includes('Improve Stamina')} onPress={() => toggleFitnessGoal('Improve Stamina')} />
            <StepperSelectionItem label="Reduce Stress" icon="happy-outline" isSelected={fitnessGoals.includes('Reduce Stress')} onPress={() => toggleFitnessGoal('Reduce Stress')} />
          </>
        )}

        {currentStep === 3 && (
          <>
            <Text className="text-3xl font-bold text-gray-800">Health & Diet</Text>
            <Text className="text-base text-gray-500 mt-2 mb-6">Any preferences or restrictions we should know about?</Text>
            <StepperSelectionItem label="Vegetarian" icon="leaf-outline" isSelected={diet === 'Vegetarian'} onPress={() => setDiet('Vegetarian')} />
            <StepperSelectionItem label="Vegan" icon="heart-outline" isSelected={diet === 'Vegan'} onPress={() => setDiet('Vegan')} />
            <StepperSelectionItem label="Non-Vegetarian" icon="restaurant-outline" isSelected={diet === 'Non-Vegetarian'} onPress={() => setDiet('Non-Vegetarian')} />
            <Input label="Allergies (optional)" value={allergies} onChangeText={setAllergies} placeholder="e.g., Peanuts, Shellfish" />
          </>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f3fff3]">
      {/* Header with Progress Bar */}
      <View className="px-6 pt-4">
        <StepperProgressBar totalSteps={TOTAL_STEPS} currentStep={currentStep} />
        <Text className="text-sm font-semibold text-gray-400 mt-4 uppercase">
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
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-[#f3fff3]">
        <Button
          title="Continue"
          onPress={handleNext}
          // Basic validation: Disable button on the first step if required fields are empty
          disabled={currentStep === 0 && (!name || !age || !gender)}
        />
      </View>
    </SafeAreaView>
  );
}