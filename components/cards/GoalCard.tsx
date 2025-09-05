import { Goal } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface GoalCardProps {
  goal: Goal;
  onPress: () => void;
  onSwap: () => void;
}

export function GoalCard({ goal, onPress, onSwap }: GoalCardProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });
    
    const handlePressIn = () => {
        scale.value = withSpring(0.98);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };


  const progress = Math.min((goal.current / goal.target) * 100, 100);

  const getIcon = () => {
    switch (goal.category) {
      case 'Move': return <Ionicons name="walk" size={24} color="#4F46E5" />;
      case 'Eat': return <Ionicons name="restaurant" size={24} color="#10B981" />;
      case 'Calm': return <Ionicons name="leaf" size={24} color="#F59E0B" />;
      default: return null;
    }
  };

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="bg-white p-4 rounded-xl shadow-md mb-4"
      style={animatedStyle}
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center gap-x-3">
          {getIcon()}
          <Text className="text-lg font-bold text-text">{goal.title}</Text>
        </View>
        <TouchableOpacity onPress={onSwap}>
            <Ionicons name="swap-horizontal" size={22} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <Text className="text-muted mb-4">{goal.description}</Text>
      
      <View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-sm font-semibold text-primary">{goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}</Text>
            {goal.completed && <Ionicons name="checkmark-circle" size={20} color="#10B981" />}
          </View>
          <View className="w-full bg-gray-200 rounded-full h-2.5">
              <Animated.View 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
               />
          </View>
      </View>
    </AnimatedTouchableOpacity>
  );
}