import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Gender, ActivityLevel } from '@/types';
import { useGoalStore } from './useGoalStore'; // Import other stores to reset them
import { useStreakStore } from './useStreakStore';

interface UserState {
  profile: UserProfile | null;
  onboardingCompleted: boolean;
  setProfile: (profile: UserProfile) => void;
  logout: () => void; // The logout function signature
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      onboardingCompleted: false,
      setProfile: (profile) => set({ profile, onboardingCompleted: true }),
      
      // THE CORRECT LOGOUT FUNCTION IMPLEMENTATION
      logout: () => {
        // 1. Reset this store's state
        set({ profile: null, onboardingCompleted: false });

        // 2. (BEST PRACTICE) Reset other user-specific stores as well
        // This ensures no old data lingers between user sessions.
        // We can call the `persist.clearStorage()` method for each store.
        useGoalStore.persist.clearStorage();
        useStreakStore.persist.clearStorage();
        
        // You would add other stores here as needed, e.g.:
        // useKpiStore.persist.clearStorage();
        // useFamilyStore.persist.clearStorage();
        
        console.log("User data cleared.");
      },
    }),
    {
      name: 'fyxlife-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these specific fields
      partialize: (state) => ({ 
        profile: state.profile, 
        onboardingCompleted: state.onboardingCompleted 
      }),
    }
  )
);