import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { AnimatedTabBar } from '@/components/common/AnimatedTabBar'; // Import the new tab bar

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      // This is the key: replace the default tab bar with our custom component
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="risk" />
    </Tabs>
  );
}