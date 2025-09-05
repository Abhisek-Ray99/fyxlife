import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withSpring, interpolateColor, useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { DashboardIcon, ProgressIcon, RiskIcon } from './TabBarIcons';

// --- Tab Definition ---
const TABS = [
  { name: 'dashboard', icon: DashboardIcon, label: 'Today' },
  { name: 'progress', icon: ProgressIcon, label: 'Progress' },
  { name: 'risk', icon: RiskIcon, label: 'Risk' },
] as const;

type TabName = typeof TABS[number]['name'];

// --- Main Component ---
export function AnimatedTabBar({ state, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useTheme(); // Use the theme hook for colors
  const currentRouteName = state.routes[state.index].name as TabName;

  return (
    <View 
      style={[
        styles.tabBarContainer, 
        { 
          paddingBottom: bottom, 
          height: TAB_BAR_HEIGHT + bottom,
          backgroundColor: colors.card, // THEME INTEGRATION
        }
      ]}
    >
      {TABS.map((tab) => {
        const isActive = currentRouteName === tab.name;
        return (
          <Pressable
            key={tab.name}
            accessibilityRole="button"
            accessibilityState={isActive ? { selected: true } : {}}
            accessibilityLabel={tab.label}
            onPress={() => {
              // Prevent navigation to the same tab
              if (!isActive) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate(tab.name);
              }
            }}
            style={styles.tabItem}
          >
            <AnimatedIcon icon={tab.icon} active={isActive} />
            <AnimatedLabel label={tab.label} active={isActive} />
          </Pressable>
        );
      })}
    </View>
  );
};

// --- Child Components & Helpers ---

const AnimatedIcon = ({ icon: Icon, active }: { icon: React.ElementType; active: boolean }) => {
    const { colors } = useTheme();
    const progress = useSharedValue(active ? 1 : 0);
  
    useEffect(() => {
      progress.value = withSpring(active ? 1 : 0, springConfig);
    }, [active]);
  
    const animatedContainerStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        progress.value,
        [0, 1],
        ['transparent', colors.accentSecondary] // THEME INTEGRATION
      );
  
      return {
        backgroundColor,
        transform: [{ translateY: progress.value * -6 }],
      };
    });
  
    return (
      <Animated.View style={[styles.iconContainer, animatedContainerStyle]}>
        <Icon 
          color={active ? colors.textSecondary : colors.textSecondary} // THEME INTEGRATION
          size={24} 
        />
      </Animated.View>
    );
  };
  
const AnimatedLabel = ({ label, active }: { label: string; active: boolean }) => {
  const { colors } = useTheme();
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(active ? 0 : 10, springConfig) }],
    opacity: withSpring(active ? 1 : 0, springConfig),
    color: active ? colors.textSecondary : colors.textSecondary, // THEME INTEGRATION
  }));
  return (
    <Animated.Text style={[styles.label, style]}>
      {label}
    </Animated.Text>
  );
};

// --- Constants & Styles ---
const TAB_BAR_HEIGHT = 70;
const springConfig = { damping: 18, stiffness: 140, mass: 0.9 };

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // Static colors are removed and applied dynamically above
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 32,
    borderRadius: 16, // This creates the pill shape
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    // Static color is removed and applied dynamically above
  },
});