import { useEffect } from 'react';
import { useStreakStore } from '@/store/useStreakStore';

export const useStreak = () => {
  const { currentStreak } = useStreakStore();

  return {
    currentStreak
  };
};