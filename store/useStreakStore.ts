import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

dayjs.extend(isoWeek);

interface StreakState {
  currentStreak: number;
  // Store a list of active dates in 'YYYY-MM-DD' format
  activeDates: string[];
  logActivity: () => void;
  checkStreak: () => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      activeDates: [],
      
      logActivity: () => {
        const today = dayjs().format('YYYY-MM-DD');
        const { activeDates } = get() as StreakState;

        // Prevent logging multiple times a day
        if (activeDates.includes(today)) {
          (get() as StreakState).checkStreak(); // Re-check streak in case of date changes
          return;
        }

        const newActiveDates = [...activeDates, today].sort();
        set({ activeDates: newActiveDates });
        (get() as StreakState).checkStreak(); // Immediately update the streak count after logging
      },

      checkStreak: () => {
        const { activeDates } = get() as StreakState;
        if (activeDates.length === 0) {
          set({ currentStreak: 0 });
          return;
        }

        let streak = 0;
        let today = dayjs();
        const yesterday = dayjs().subtract(1, 'day');

        // Check if the last active day is today or yesterday to continue the streak
        const lastActiveDate = dayjs(activeDates[activeDates.length - 1]);
        if (lastActiveDate.isSame(today, 'day') || lastActiveDate.isSame(yesterday, 'day')) {
          streak = 1;
          // Traverse backwards from yesterday
          for (let i = activeDates.length - 2; i >= 0; i--) {
            const currentDate = dayjs(activeDates[i + 1]);
            const previousDate = dayjs(activeDates[i]);
            if (currentDate.diff(previousDate, 'day') === 1) {
              streak++;
            } else {
              break; // Streak is broken
            }
          }
        }
        
        set({ currentStreak: streak });
      },
    }),
    {
      name: 'fyxlife-streak-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);