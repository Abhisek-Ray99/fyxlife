import React from 'react';
import { View, Text, Modal, Pressable, SafeAreaView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { AnimatedSwitch } from '@/components/common/AnimatedSwitch';
import { PaletteCircle } from '@/components/settings/PaletteCircle';
import { Ionicons } from '@expo/vector-icons';
import { PaletteName } from '@/types';

interface ThemeSettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function ThemeSettingsModal({ isVisible, onClose }: ThemeSettingsModalProps) {
  const { colors, palettes, paletteName, setPaletteName, mode, setMode } = useTheme();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 justify-end" 
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onPress={onClose}
      >
        <Pressable // This prevents the modal from closing when pressing inside the card
          className="p-6 rounded-t-3xl"
          style={{ backgroundColor: colors.card }}
        >
          <SafeAreaView>
             <View className="flex-row justify-between items-center mb-6">
                <Text className={`text-xl font-bold`} style={{ color: colors.textPrimary }}>Theme Settings</Text>
                <Pressable onPress={onClose}>
                    <Ionicons name="close-circle" size={30} color={colors.textSecondary} />
                </Pressable>
             </View>
            
            <Text className={`text-base mb-4`} style={{ color: colors.textSecondary }}>
              Icons, text, and more match colors in your wallpaper
            </Text>

            <View className="flex-row justify-around my-4">
              {Object.values(palettes).map((p) => (
                <PaletteCircle
                  key={p.name}
                  palette={p}
                  isSelected={paletteName === p.name.toLowerCase()}
                  onSelect={() => setPaletteName(p.name.toLowerCase() as PaletteName)}
                />
              ))}
            </View>

            <View className="flex-row justify-between items-center mt-6 pt-6 border-t" style={{ borderColor: colors.border }}>
              <Text className={`text-lg font-semibold`} style={{ color: colors.textPrimary }}>Dark theme</Text>
              <AnimatedSwitch
                isOn={mode === 'dark'}
                onToggle={() => setMode(mode === 'light' ? 'dark' : 'light')}
              />
            </View>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}