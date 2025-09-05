import { FamilyMember } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FamilyState {
  familyMembers: FamilyMember[];
  addFamilyMember: (member: FamilyMember) => void;
}

// More realistic and detailed initial data for a family of four.
const initialFamily: FamilyMember[] = [
    {
        id: 'famWife', name: 'Elena', relationship: 'Wife', kpis: {
            dailyActivity: [{ label: 'Steps', value: 8250, unit: 'steps', category: 'Composition', timestamp: Date.now() }],
            sleepQuality: [{ label: 'Sleep', value: 92, unit: '%', category: 'Mental', timestamp: Date.now() }],
            restingHeartRate: [{ label: 'Heart Rate', value: 68, unit: 'bpm', category: 'Cardio', timestamp: Date.now() }],
        }
    },
    {
        id: 'famFather', name: 'Robert', relationship: 'Father', kpis: {
            bloodPressure: [{ label: 'Blood Pressure', value: { systolic: 128, diastolic: 84 }, unit: 'mmHg', category: 'Cardio', timestamp: Date.now() }],
            dailyActivity: [{ label: 'Steps', value: 6100, unit: 'steps', category: 'Composition', timestamp: Date.now() }],
            hba1c: [{ label: 'HbA1c', value: 5.8, unit: '%', category: 'Metabolic', timestamp: Date.now() }],
        }
    },
    {
        id: 'famMother', name: 'Maria', relationship: 'Mother', kpis: {
            restingHeartRate: [{ label: 'Heart Rate', value: 75, unit: 'bpm', category: 'Cardio', timestamp: Date.now() }],
            sleepQuality: [{ label: 'Sleep', value: 85, unit: '%', category: 'Mental', timestamp: Date.now() }],
            dailyActivity: [{ label: 'Steps', value: 7200, unit: 'steps', category: 'Composition', timestamp: Date.now() }],
        }
    },
    {
        id: 'famChild', name: 'Leo', relationship: 'Child', kpis: {
            dailyActivity: [{ label: 'Steps', value: 14500, unit: 'steps', category: 'Composition', timestamp: Date.now() }],
            sleepQuality: [{ label: 'Sleep', value: 98, unit: '%', category: 'Mental', timestamp: Date.now() }],
            restingHeartRate: [{ label: 'Heart Rate', value: 80, unit: 'bpm', category: 'Cardio', timestamp: Date.now() }],
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