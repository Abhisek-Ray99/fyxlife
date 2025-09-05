import { useTheme } from '@/hooks/useTheme';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme, View } from 'react-native';
import '../styles/global.css'; // Import the global CSS file
import { useThemeStore } from '@/store/useThemeStore';

// This is the CSS variable injection magic
function Root({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();

  const style = {
    '--color-background': colors.background,
    '--color-card': colors.card,
    '--color-text-primary': colors.textPrimary,
    '--color-text-secondary': colors.textSecondary,
    '--color-accent': colors.accent,
    '--color-accent-secondary': colors.accentSecondary,
    '--color-accent-text': colors.accentText,
    '--color-border': colors.border,
    '--color-success': colors.success,
    '--color-warning': colors.warning,
    '--color-danger': colors.danger,
  } as any;

  return <View style={[{ flex: 1 }, style]}>{children}</View>;
}

export default function RootLayout() {
  const { theme, mode, paletteName } = useTheme();
  const systemScheme = useColorScheme();
  const setMode = useThemeStore((state) => state.setMode);

  const [fontsLoaded] = useFonts({});

  // 🔥 Sync system scheme with Zustand
  useEffect(() => {
    if (systemScheme) {
      setMode(systemScheme);
    }
  }, [systemScheme, setMode]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Root>
      <StatusBar style={theme.barStyle === "light-content" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </Root>
  );
}
