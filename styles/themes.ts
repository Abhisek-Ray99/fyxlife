import { Palette, PaletteName } from "@/types";

type ThemeCollection = {
  [key in PaletteName]: Palette;
};

export const themes: ThemeCollection = {
  neon: {
    name: 'Neon',
    visuals: { top: '#78f8dd', right: '#2ECC71', bottom: '#FFFFFF', left: '#1C1C1E' },
    light: {
      barStyle: 'dark-content',
      colors: {
        background: '#F8faf7', card: '#eceeec', textPrimary: '#1C1C1E', textSecondary: '#555', accent: '#006b5b', accentSecondary: '#cde8e0', accentText: '#FFFFFF', border: '#d0e3de', success: '#2ECC71', warning: '#F1C40F', danger: '#E74C3C',
      },
    },
    dark: {
      barStyle: 'light-content',
      colors: {
        background: '#101413', card: '#1d201f', textPrimary: '#FFFFFF', textSecondary: '#cde8e0', accent: '#78f8dd', accentSecondary: '#334b45', accentText: '#0C0C0C', border: '#203934', success: '#2ECC71', warning: '#F1C40F', danger: '#E74C3C',
      },
    },
  },
  minimal: {
    name: 'Minimal',
    visuals: { top: '#5AC8FA', right: '#007AFF', bottom: '#1C1C1E', left: '#F9F9F9' },
    light: {
      barStyle: 'dark-content',
      colors: {
        background: '#F9F9F9', card: '#FFFFFF', textPrimary: '#1C1C1E', textSecondary: '#6E6E73', accent: '#007AFF', accentSecondary: '#5AC8FA', accentText: '#FFFFFF', border: '#E5E5EA', success: '#34C759', warning: '#FF9500', danger: '#FF3B30',
      },
    },
    dark: {
      barStyle: 'light-content',
      colors: {
        background: '#0f172a', card: '#1e293b', textPrimary: '#F5F5F7', textSecondary: '#86868B', accent: '#838dfb', accentSecondary: '#27334e', accentText: '#FFFFFF', border: '#2d3647', success: '#30D158', warning: '#FF9F0A', danger: '#FF453A',
      },
    },
  },
  sunset: {
    name: 'Sunset',
    visuals: { top: '#FFB6A3', right: '#FF6B6B', bottom: '#1A0F0F', left: '#FFEFEF' },
    light: {
      barStyle: 'dark-content',
      colors: {
        background: '#FFF5F5', card: '#FFFFFF', textPrimary: '#4A1C1C', textSecondary: '#8C4B4B', accent: '#E55353', accentSecondary: '#FF6B6B', accentText: '#FFFFFF', border: '#FFD9D9', success: '#52D681', warning: '#FFC700', danger: '#FF5A5A',
      },
    },
    dark: {
      barStyle: 'light-content',
      colors: {
        background: '#1A0F0F', card: '#2B1D1D', textPrimary: '#FFEFEF', textSecondary: '#FFB6A3', accent: '#FF6B6B', accentSecondary: '#FF8E8E', accentText: '#1A0F0F', border: '#4A3434', success: '#52D681', warning: '#FFC700', danger: '#FF5A5A',
      },
    },
  },
  nature: {
    name: 'Nature',
    visuals: { top: '#5DCBB5', right: '#3AB795', bottom: '#0B3D20', left: '#F4FFF8' },
    light: {
      barStyle: 'dark-content',
      colors: {
        background: '#F4FFF8', card: '#FFFFFF', textPrimary: '#0B3D20', textSecondary: '#4F6F52', accent: '#3AB795', accentSecondary: '#5DCBB5', accentText: '#FFFFFF', border: '#D0E6DB', success: '#28A745', warning: '#FFC107', danger: '#DC3545',
      },
    },
    dark: {
      barStyle: 'light-content',
      colors: {
        background: '#151817', card: '#172b23', textPrimary: '#E8F5E9', textSecondary: '#A5D6A7', accent: '#4CAF50', accentSecondary: '#81C784', accentText: '#FFFFFF', border: '#2E7D32', success: '#66BB6A', warning: '#FFEE58', danger: '#EF5350',
      },
    },
  },
};