import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, PaletteName } from '@/types';

interface ThemeState {
  mode: ThemeMode;
  paletteName: PaletteName;
  setMode: (mode: ThemeMode) => void;
  setPaletteName: (name: PaletteName) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      paletteName: 'neon',
      setMode: (mode) => set({ mode }),
      setPaletteName: (name) => set({ paletteName: name }),
    }),
    {
      name: 'fyxlife-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        mode: state.mode,
        paletteName: state.paletteName,
      }),
    }
  )
);