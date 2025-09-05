import { Redirect } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { ActivityIndicator, View } from 'react-native';
import { useState, useEffect } from 'react';

export default function Index() {
  const { onboardingCompleted } = useUserStore();
  const [isReady, setIsReady] = useState(false);

  // Zustand persistence can be async, so we wait for rehydration
  useEffect(() => {
    const unsubscribe = useUserStore.persist.onFinishHydration(() => {
      setIsReady(true);
    });
    // If it's already hydrated, set ready immediately
    if (useUserStore.persist.hasHydrated()) {
      setIsReady(true);
    }
    return unsubscribe;
  }, []);

  if (!isReady) {
    return <View className="flex-1 justify-center items-center bg-background"><ActivityIndicator size="large" /></View>;
  }
  
  if (onboardingCompleted) {
    return <Redirect href="/(tabs)/dashboard" />;
  } else {
    return <Redirect href="/(onboarding)/welcome" />;
  }
}