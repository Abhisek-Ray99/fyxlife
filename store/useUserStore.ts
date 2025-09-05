import { UserProfile } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  profile: UserProfile | null;
  onboardingCompleted: boolean;
  setProfile: (profile: UserProfile) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      onboardingCompleted: false,
      setProfile: (profile: UserProfile) => set({ profile, onboardingCompleted: true }),
      completeOnboarding: () => set({ onboardingCompleted: true }),
       reset: () => set({ profile: null, onboardingCompleted: false }),
    }),
    {
      name: 'fyxlife-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);