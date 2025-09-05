import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Kpi, KpiData } from '@/types';

interface KpiState {
  userKpis: KpiData;
  addKpi: (kpi: Kpi, key: Exclude<keyof KpiData, 'cholesterol'>) => void;
  // A separate, simpler action for cholesterol can be added if needed
}

// Add more realistic and varied initial data
const initialKpis: KpiData = {
  restingHeartRate: [{ label: 'Resting Heart Rate', value: 62, unit: 'bpm', category: 'Cardio', timestamp: Date.now() }],
  bloodPressure: [{ label: 'Blood Pressure', value: { systolic: 118, diastolic: 78 }, unit: 'mmHg', category: 'Cardio', timestamp: Date.now() }],
  sleepQuality: [{ label: 'Sleep Score', value: 91, unit: '%', category: 'Mental', timestamp: Date.now() }],
  dailyActivity: [{ label: 'Active Energy', value: 450, unit: 'kcal', category: 'Composition', timestamp: Date.now() }],
  hba1c: [{ label: 'Blood Glucose', value: 5.4, unit: '%', category: 'Metabolic', timestamp: Date.now() }],
  oxygenSaturation: [{ label: 'Oxygen Saturation', value: 98, unit: '%', category: 'Respiratory', timestamp: Date.now() }],
};

export const useKpiStore = create<KpiState>()(
  persist(
    (set) => ({
      userKpis: initialKpis,
      
      // THE FIX: A much simpler and more robust `addKpi` function.
      // This version correctly handles adding a new Kpi object to the start of the array for a given key.
      addKpi: (kpi, key) =>
        set((state) => ({
          userKpis: {
            ...state.userKpis,
            [key]: [kpi, ...(state.userKpis[key] || [])],
          },
        })),
    }),
    {
      name: 'fyxlife-kpi-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ userKpis: state.userKpis }),
    }
  )
);