import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function Button({ title, onPress, isLoading = false, disabled = false }: ButtonProps) {
  const disabledClasses = (disabled || isLoading) ? 'opacity-50' : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`bg-[#154419] py-6 px-12 rounded-full items-center justify-center ${disabledClasses}`}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-accent-text font-bold text-white text-lg">{title}</Text>
      )}
    </TouchableOpacity>
  );
}   
      