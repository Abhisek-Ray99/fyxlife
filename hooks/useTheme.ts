import { useThemeStore } from '@/store/useThemeStore';
import { themes } from '@/styles/themes';

export const useTheme = () => {
  const mode = useThemeStore((s) => s.mode);
  const paletteName = useThemeStore((s) => s.paletteName);
  const { setMode, setPaletteName } = useThemeStore();
  
  const theme = themes[paletteName][mode];

  return {
    theme,
    mode,
    paletteName,
    setMode,
    setPaletteName,
    colors: theme.colors,
    palettes: themes
  };
};