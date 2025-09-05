import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  const { colors, mode } = useTheme();

  const backgroundColor = mode === 'dark' ? '#1e2a22' : '#e5f2e3';
  const borderColor = error ? colors.danger : mode === 'dark' ? '#88c999' : '#154419';
  const textColor = mode === 'dark' ? colors.textPrimary : '#111827'; // dark: white-ish, light: gray-900

  return (
    <View className="w-full mb-4">
      <Text
        className="text-lg font-semibold mb-2 ml-1"
        style={{ color: colors.textSecondary }}
      >
        {label}
      </Text>
      <TextInput
        style={{
          backgroundColor,
          borderBottomWidth: 2,
          borderColor,
          color: textColor,
          fontSize: 18,
          padding: 16,
          borderRadius: 12,
          width: '100%',
        }}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && (
        <Text className="mt-1 ml-1" style={{ color: colors.danger }}>
          {error}
        </Text>
      )}
    </View>
  );
}
