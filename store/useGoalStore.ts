import { Goal } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface GoalState {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  updateGoalProgress: (goalId: string, progress: number) => void;
  swapGoal: (oldGoalId: string, newGoal: Goal) => void;
  getTodayProgress: () => number;
  getWeekProgress: () => number;
  getMonthProgress: () => number;
}

const initialGoals: Goal[] = [
  { id: '1', title: 'Walk 10,000 Steps', category: 'Move', description: 'A brisk walk to boost cardio.', target: 10000, current: 7500, unit: 'steps', completed: false },
  { id: '2', title: 'Eat 5 Servings of Veggies', category: 'Eat', description: 'Fuel your body with nutrients.', target: 5, current: 3, unit: 'servings', completed: false },
  { id: '3', title: 'Meditate for 10 Minutes', category: 'Calm', description: 'Clear your mind and reduce stress.', target: 10, current: 10, unit: 'min', completed: true },
];

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: initialGoals,
      setGoals: (goals: Goal[]) => set({ goals }),
      updateGoalProgress: (goalId: string, progress: number) =>
        set((state: GoalState) => ({
          goals: state.goals.map((g: Goal) =>
            g.id === goalId ? { ...g, current: progress, completed: progress >= g.target } : g
          ),
        })),
      swapGoal: (oldGoalId: string, newGoal: Goal) =>
        set((state: GoalState) => ({
          goals: state.goals.map((g: Goal) => (g.id === oldGoalId ? newGoal : g)),
        })),
      getTodayProgress: () => {
        const { goals } = get() as GoalState;
        return goals.filter((g: Goal) => g.completed).length / goals.length * 100;
      },
      // Note: In a real app, these would check historical data
      getWeekProgress: () => 65,
      getMonthProgress: () => 75,
    }),
    {
      name: 'fyxlife-goal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);