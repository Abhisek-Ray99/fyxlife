import { useEffect } from 'react';
import { useStreakStore } from '@/store/useStreakStore';

export const useStreak = () => {
  const { checkAndResetStreak, currentStreak, incrementStreak } = useStreakStore();

  useEffect(() => {
    // Check the streak when the app loads or this hook is mounted
    checkAndResetStreak();
  }, [checkAndResetStreak]);

  return {
    currentStreak,
    incrementStreak,
  };
};