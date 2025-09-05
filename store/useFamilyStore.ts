import { FamilyMember } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FamilyState {
  familyMembers: FamilyMember[];
  addFamilyMember: (member: FamilyMember) => void;
}

const initialFamily: FamilyMember[] = [
    {
        id: 'fam1', name: 'Jane Doe', relationship: 'Partner', kpis: {
            restingHeartRate: [{ label: 'Resting Heart Rate', value: 72, unit: 'bpm', category: 'Cardio', timestamp: Date.now() }],
            dailyActivity: [{ label: 'Daily Activity', value: 8200, unit: 'steps', category: 'Composition', timestamp: Date.now() }],
        }
    },
     {
        id: 'fam2', name: 'Sam Doe', relationship: 'Child', kpis: {
            sleepQuality: [{ label: 'Sleep Quality', value: 95, unit: '%', category: 'Mental', timestamp: Date.now() }],
            dailyActivity: [{ label: 'Daily Activity', value: 12500, unit: 'steps', category: 'Composition', timestamp: Date.now() }],
        }
    }
];

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set) => ({
      familyMembers: initialFamily,
      addFamilyMember: (member: FamilyMember) =>
        set((state: FamilyState) => ({ familyMembers: [...state.familyMembers, member] })),
    }),
    {
      name: 'fyxlife-family-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);