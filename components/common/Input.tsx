import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  const { colors } = useTheme();

  return (
    <View className="w-full mb-4">
      <Text className="text-secondary text-lg font-semibold mb-2 ml-1">{label}</Text>
      <TextInput
        className={`bg-[#e5f2e3] border-b-2 text-lg p-6 rounded-lg w-full ${error ? 'border-danger' : 'border-[#154419]'}`}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && <Text className="text-danger mt-1 ml-1">{error}</Text>}
    </View>
  );
}