import { Kpi, KpiData } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface KpiState {
  userKpis: KpiData;
  addKpi: (kpi: Kpi, key: keyof KpiData, subkey?: keyof KpiData['cholesterol']) => void;
}

const initialKpis: KpiData = {
  restingHeartRate: [{ label: 'Resting Heart Rate', value: 65, unit: 'bpm', category: 'Cardio', timestamp: Date.now() }],
  bloodPressure: [{ label: 'Blood Pressure', value: { systolic: 120, diastolic: 80 }, unit: 'mmHg', category: 'Cardio', timestamp: Date.now() }],
  sleepQuality: [{ label: 'Sleep Quality', value: 85, unit: '%', category: 'Mental', timestamp: Date.now() }],
};

export const useKpiStore = create<KpiState>()(
  persist(
    (set) => ({
      userKpis: initialKpis,
      addKpi: (
        kpi: Kpi,
        key: keyof KpiData,
        subkey?: keyof NonNullable<KpiData['cholesterol']>
      ) =>
        set((state: KpiState) => {
          const newUserKpis: KpiData = { ...state.userKpis };
          if (key === 'cholesterol' && subkey) {
            const existingChol = newUserKpis.cholesterol ?? {
              total: [],
              ldl: [],
              hdl: [],
              triglycerides: [],
            };
            newUserKpis.cholesterol = {
              ...existingChol,
              [subkey]: [...(existingChol[subkey] || []), kpi],
            } as KpiData['cholesterol'];
          } else if (key !== 'cholesterol') {
            const arrayKey = key as Exclude<keyof KpiData, 'cholesterol'>;
            const existing = (newUserKpis[arrayKey] as Kpi[] | undefined) ?? [];
            newUserKpis[arrayKey] = [...existing, kpi] as any;
          }
          return { userKpis: newUserKpis };
        }),
    }),
    {
      name: 'fyxlife-kpi-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);