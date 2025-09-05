import { Goal } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Extend dayjs with necessary plugins
dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Define the shape of a single completion record
interface GoalCompletion {
  goalId: string;
  date: string; // Stored in 'YYYY-MM-DD' format
}

interface GoalState {
  goals: Goal[];
  completionHistory: GoalCompletion[];
  // New action to log a completion
  completeGoalForToday: (goalId: string) => void;
  // Progress functions now return a detailed object
  getTodayProgress: () => { completed: number; planned: number };
  getWeekProgress: () => { completed: number; planned: number };
  getMonthProgress: () => { completed: number; planned: number };
}

const initialGoals: Goal[] = [
  { id: '1', title: 'Walk 10,000 Steps', category: 'Move', description: 'A brisk walk to boost cardio.', target: 10000, current: 0, unit: 'steps', completed: false },
  { id: '2', title: 'Eat 5 Servings of Veggies', category: 'Eat', description: 'Fuel your body with nutrients.', target: 5, current: 0, unit: 'servings', completed: false },
  { id: '3', title: 'Meditate for 10 Minutes', category: 'Calm', description: 'Clear your mind and reduce stress.', target: 10, current: 0, unit: 'min', completed: false },
];


export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: initialGoals,
      // Add some mock historical data to make the chart look realistic on first load
      completionHistory: [
        { goalId: '1', date: dayjs().format('YYYY-MM-DD') }, // Today
        { goalId: '3', date: dayjs().format('YYYY-MM-DD') }, // Today
        { goalId: '1', date: dayjs().subtract(1, 'day').format('YYYY-MM-DD') },
        { goalId: '2', date: dayjs().subtract(1, 'day').format('YYYY-MM-DD') },
        { goalId: '3', date: dayjs().subtract(1, 'day').format('YYYY-MM-DD') },
        { goalId: '1', date: dayjs().subtract(2, 'day').format('YYYY-MM-DD') },
      ],

      completeGoalForToday: (goalId: string) => {
        const today = dayjs().format('YYYY-MM-DD');
        const { completionHistory } = get() as GoalState;
        if (completionHistory.some((c: GoalCompletion) => c.goalId === goalId && c.date === today)) return; // Prevent duplicates

        set((state: GoalState) => ({
          completionHistory: [...state.completionHistory, { goalId, date: today }],
          goals: state.goals.map((g: Goal) => g.id === goalId ? { ...g, completed: true } : g)
        }));
      },

      // --- NEW FACTUAL PROGRESS CALCULATIONS ---
      getTodayProgress: () => {
        const { goals, completionHistory } = get() as GoalState;
        const today = dayjs().format('YYYY-MM-DD');
        const completed = completionHistory.filter((c: GoalCompletion) => c.date === today).length;
        return { completed, planned: goals.length };
      },

      getWeekProgress: () => {
        const { goals, completionHistory } = get() as GoalState;
        const startOfWeek = dayjs().startOf('isoWeek');
        const endOfWeek = dayjs().endOf('isoWeek');
        
        const completedCount = completionHistory.filter((c: GoalCompletion) => {
            const date = dayjs(c.date);
            return date.isSameOrAfter(startOfWeek) && date.isSameOrBefore(endOfWeek);
        }).length;

        // Planned = 3 goals per day * number of days passed in the week so far
        const plannedCount = goals.length * dayjs().isoWeekday();
        return { completed: completedCount, planned: plannedCount };
      },

      getMonthProgress: () => {
        const { goals, completionHistory } = get() as GoalState;
        const startOfMonth = dayjs().startOf('month');
        const endOfMonth = dayjs().endOf('month');
        
        const completedCount = completionHistory.filter((c: GoalCompletion) => {
            const date = dayjs(c.date);
            return date.isSameOrAfter(startOfMonth) && date.isSameOrBefore(endOfMonth);
        }).length;

        // Planned = 3 goals per day * number of days passed in the month so far
        const plannedCount = goals.length * dayjs().date();
        return { completed: completedCount, planned: plannedCount };
      },
    }),
    {
      name: 'fyxlife-goal-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist goals and history, not the derived functions
      partialize: (state: GoalState) => ({ goals: state.goals, completionHistory: state.completionHistory }),
    }
  )
);