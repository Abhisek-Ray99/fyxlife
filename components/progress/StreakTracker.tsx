import React from 'react';
import { View, Text, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { useStreakStore } from '@/store/useStreakStore';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { FontAwesome6, Ionicons } from '@expo/vector-icons'; // Make sure Ionicons is imported

dayjs.extend(isoWeek);

// --- REFINED DayCircle COMPONENT ---
interface DayCircleProps {
    dayLabel: string;
    dayObject: dayjs.Dayjs;
    isComplete: boolean;
}

const DayCircle = ({ dayLabel, dayObject, isComplete }: DayCircleProps) => {
    const { colors } = useTheme();
    const today = dayjs();

    const isToday = dayObject.isSame(today, 'day');
    const isFuture = dayObject.isAfter(today, 'day');
    const isPast = dayObject.isBefore(today, 'day');

    let content = null;
    let circleStyle: object = { backgroundColor: colors.border };
    let labelStyle: object = { color: colors.textSecondary };

    if (isToday) {
        labelStyle = { color: colors.accent };
        circleStyle = { borderColor: colors.accent, borderWidth: 2 };
        if (isComplete) {
            content = <FontAwesome6 name="fire-flame-curved" size={40} />;
            circleStyle = { ...circleStyle, backgroundColor: colors.accentSecondary };
        }
    } else if (isPast) {
        if (isComplete) {
            content = <Ionicons name="checkmark" size={20} color={colors.accentText} />;
            circleStyle = { backgroundColor: colors.accent };
        } else {
            content = <Ionicons name="close" size={20} color={colors.textSecondary} />;
        }
    } else if (isFuture) {
        // For future days, make the circle more subtle
        circleStyle = { backgroundColor: colors.border, opacity: 0.5 };
        content = null;
    }
    
    return (
        <View className="items-center gap-y-2">
            <Text className="font-bold text-xs uppercase" style={labelStyle}>
                {isToday ? 'Today' : dayLabel}
            </Text>
            <View className="w-8 h-8 rounded-full items-center justify-center" style={circleStyle}>
                {content}
            </View>
        </View>
    );
};

// --- StreakTracker Component (Main Logic Unchanged) ---
export function StreakTracker() {
  const { colors } = useTheme();
  const { currentStreak, activeDates } = useStreakStore();

  const weekDays = React.useMemo(() => {
    const today = dayjs();
    const startOfWeek = today.startOf('isoWeek'); // Starts on Monday
    return Array.from({ length: 7 }).map((_, i) => {
        const day = startOfWeek.add(i, 'day');
        return {
            label: day.format('dd'),
            dayObject: day,
            isComplete: activeDates.includes(day.format('YYYY-MM-DD')),
        };
    });
  }, [activeDates]);

  const hasStreak = currentStreak > 0;
  const flameColor = hasStreak ? colors.accent : colors.textSecondary;

  return (
    <View className="items-center p-6 rounded-2xl w-full" style={{ backgroundColor: colors.card }}>
      <View className="items-center justify-center mb-2">
        <FontAwesome6 name="fire-flame-curved" size={40} color={flameColor} />
        <Animated.Text
          className="text-6xl font-extrabold"
          style={[
            { color: hasStreak ? colors.accentText : colors.textPrimary}
          ]}
        >
          {currentStreak}
        </Animated.Text>
      </View>
      
      <Text className="text-2xl font-bold mt-4" style={{ color: colors.textPrimary }}>
        day streak
      </Text>

      <View className="flex-row justify-between w-full mt-8 pt-6 border-t" style={{ borderColor: colors.border }}>
        {weekDays.map(dayInfo => (
            <DayCircle 
                key={dayInfo.dayObject.format('YYYY-MM-DD')}
                dayLabel={dayInfo.label}
                dayObject={dayInfo.dayObject}
                isComplete={dayInfo.isComplete}
            />
        ))}
      </View>
    </View>
  );
}