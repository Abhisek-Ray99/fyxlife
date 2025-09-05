import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface StreakState {
  currentStreak: number;
  lastActivityDate: string | null;
  incrementStreak: () => void;
  resetStreak: () => void;
  checkAndResetStreak: () => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      lastActivityDate: null,
      incrementStreak: () => {
        const today = dayjs().format('YYYY-MM-DD');
        set((state: StreakState) => ({
          currentStreak: state.currentStreak + 1,
          lastActivityDate: today,
        }));
      },
      resetStreak: () => set({ currentStreak: 0, lastActivityDate: null }),
      checkAndResetStreak: () => {
          const { lastActivityDate } = get() as StreakState;
          if (!lastActivityDate) return;
          
          const today = dayjs();
          const lastDate = dayjs(lastActivityDate);
          
          if (today.diff(lastDate, 'day') > 1) {
              set({ currentStreak: 0, lastActivityDate: null });
          }
      },
    }),
    {
      name: 'fyxlife-streak-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);