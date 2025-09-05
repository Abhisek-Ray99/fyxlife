import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Palette } from '@/types';

interface PaletteCircleProps {
  palette: Palette;
  isSelected: boolean;
  onSelect: () => void;
}

export function PaletteCircle({ palette, isSelected, onSelect }: PaletteCircleProps) {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity onPress={onSelect} className="p-1">
      <View
        className="w-14 h-14 rounded-full items-center justify-center"
        style={{ borderWidth: isSelected ? 3 : 0, borderColor: colors.accent }}
      >
        <View className="w-12 h-12 rounded-full overflow-hidden flex-row flex-wrap">
          <View style={{ width: '50%', height: '50%', backgroundColor: palette.visuals.top }} />
          <View style={{ width: '50%', height: '50%', backgroundColor: palette.visuals.right }} />
          <View style={{ width: '50%', height: '50%', backgroundColor: palette.visuals.left }} />
          <View style={{ width: '50%', height: '50%', backgroundColor: palette.visuals.bottom }} />
        </View>
      </View>
    </TouchableOpacity>
  );
}