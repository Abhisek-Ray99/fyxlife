import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { ScrollView, View, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function Screen({ children, scrollable = false, contentContainerStyle }: ScreenProps) {
  const { colors } = useTheme();
  const Container = scrollable ? ScrollView : View;

  const defaultPadding: ViewStyle = { paddingHorizontal: 24, paddingTop: 16};
  const scrollPadding: ViewStyle = { paddingBottom: 40 };

  // Combine default styles with any passed-in styles
  const finalContentContainerStyle = [
    defaultPadding,
    scrollable && scrollPadding,
    contentContainerStyle
  ];

  return (
    // This remains transparent to allow the root background to show through
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <Container
        className="flex-1"
        contentContainerStyle={finalContentContainerStyle}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
}