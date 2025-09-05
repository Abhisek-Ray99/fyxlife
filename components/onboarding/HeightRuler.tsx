import React, { useMemo, useEffect } from 'react';
import { View, Text, useWindowDimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';


const RULER_HEIGHT = 400;
const TICK_INTERVAL = 10; // 10px = 1 unit
const MIN_VALUE_CM = 120;
const MAX_VALUE_CM = 220;
const MIN_VALUE_FT = 4;
const MAX_VALUE_FT = 7.5;

type Unit = 'cm' | 'ft';

interface HeightRulerProps {
    onHeightChange: (height: number, unit: Unit) => void;
}

export function HeightRuler({ onHeightChange }: HeightRulerProps) {
    const [unit, setUnit] = React.useState<Unit>('cm');
    const [currentValue, setCurrentValue] = React.useState(175);
    const { width: screenWidth } = useWindowDimensions();

    const MIN_VALUE = unit === 'cm' ? MIN_VALUE_CM : MIN_VALUE_FT;
    const MAX_VALUE = unit === 'cm' ? MAX_VALUE_CM : MAX_VALUE_FT;

    const translateY = useSharedValue(0);
    const startY = useSharedValue(0);
    const rulerCenterY = RULER_HEIGHT / 2;

    const contentHeight = (MAX_VALUE - MIN_VALUE) * TICK_INTERVAL; // ✅ works for ft too

    const prevTickIndex = React.useRef<number>(Math.round(-translateY.value / TICK_INTERVAL));

    // Generate ticks (cm → every 1, ft → every 0.1)
    const ticks = useMemo(() => {
        const arr: number[] = [];
        for (let i = MIN_VALUE; i <= MAX_VALUE; i += unit === 'cm' ? 1 : 0.1) {
            arr.push(Number(i.toFixed(1)));
        }
        return arr;
    }, [MIN_VALUE, MAX_VALUE, unit]);

    const maxTranslateY = 0; // MIN_VALUE at center
    const minTranslateY = -(ticks.length - 1) * TICK_INTERVAL; // MAX_VALUE at center


    // ✅ Map value to offset
    const getOffsetForValue = (value: number) => {
        return -(value - MIN_VALUE) * TICK_INTERVAL;
    };

    // ✅ Map offset back to value
    const updateCurrentValue = (translateYVal: number) => {
        const tickIndex = Math.round(-translateYVal / TICK_INTERVAL);
    
        if (tickIndex !== prevTickIndex.current) {
            // Light haptic feedback
            Haptics.selectionAsync();
            prevTickIndex.current = tickIndex;
        }
    
        let value = MIN_VALUE + tickIndex;
        if (unit === 'ft') value = Math.round((MIN_VALUE + tickIndex * 0.1) * 10) / 10;
    
        const clampedValue = Math.max(MIN_VALUE, Math.min(MAX_VALUE, value));
        setCurrentValue(clampedValue);
        onHeightChange(clampedValue, unit);
    };


    // ✅ Snap to nearest tick
    const snapToNearest = (val: number) => {
        const snapped =
            unit === 'cm'
                ? Math.round(val)
                : Math.round(val * 10) / 10;

        const offset = getOffsetForValue(snapped);
        translateY.value = withTiming(offset, { duration: 180 });
        runOnJS(updateCurrentValue)(offset);
    };

    // ✅ Gesture control
    const panGesture = Gesture.Pan()
        .onBegin(() => {
            startY.value = translateY.value;
        })
        .onUpdate((e) => {
            const newTranslateY = startY.value + e.translationY;
            const clamped = Math.max(minTranslateY, Math.min(maxTranslateY, newTranslateY));
            translateY.value = clamped;
            runOnJS(updateCurrentValue)(clamped);
        })
        .onEnd((e) => {
            const velocity = e.velocityY / 4;
            let projected = translateY.value + velocity * 0.2;
            const clampedProjected = Math.max(minTranslateY, Math.min(maxTranslateY, projected));
        
            // Snap to nearest tick
            const tickIndex = Math.round(-clampedProjected / TICK_INTERVAL);
            const snappedOffset = -tickIndex * TICK_INTERVAL;
        
            translateY.value = withTiming(snappedOffset, { duration: 200 }, () => {
                runOnJS(updateCurrentValue)(snappedOffset);
            });
        });
        


    const animatedRulerStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    // ✅ Handle unit change & initial positioning
    useEffect(() => {
        const initialValue = unit === 'cm' ? 175 : 5.5; // ✅ default ft = 5.5
        setCurrentValue(initialValue);
        const offset = getOffsetForValue(initialValue);
        translateY.value = offset;
        onHeightChange(initialValue, unit);
    }, [unit]);


    // Toggle cm/ft
    const toggleUnit = () => {
        setUnit(unit === 'cm' ? 'ft' : 'cm');
    };

    return (
        <View className="items-center w-full">
            {/* Value Display */}
            <View className="flex-row items-center justify-center">
                <View style={{ width: screenWidth / 2, alignItems: 'center' }}>
                    <Text className="text-6xl font-extrabold text-gray-900">
                        {currentValue.toFixed(unit === 'ft' ? 1 : 0)}
                    </Text>
                </View>

                {/* Ruler (fixed-height viewport) */}
                <View
                    style={{
                        height: RULER_HEIGHT,
                        width: 120,
                        overflow: 'hidden', // ✅ important to prevent overflow
                    }}
                    className="relative justify-center"
                >
                    {/* Top Fade */}
                    <LinearGradient
                        colors={['#f3fff3', 'transparent']}
                        className="absolute top-0 left-0 right-0 h-16 z-10"
                    />

                    {/* Scrollable Ruler */}
                    <GestureDetector gesture={panGesture}>
                        <Animated.View
                            style={[
                                {
                                    paddingTop: rulerCenterY,
                                    paddingBottom: rulerCenterY,
                                },
                                animatedRulerStyle,
                            ]}
                        >
                            {ticks.map((val, index) => {
                                const isMajorTick =
                                    unit === 'cm'
                                        ? val % 5 === 0
                                        : Math.abs(val % 0.5) < 0.001;
                                const isMainTick =
                                    unit === 'cm'
                                        ? val % 10 === 0
                                        : Math.abs(val % 1) < 0.001;

                                return (
                                    <View
                                        key={index}
                                        className="flex-row items-center px-2"
                                        style={{ height: TICK_INTERVAL }}
                                    >
                                        {isMainTick ? (
                                            <Text className="w-10 text-xs font-bold text-gray-700">
                                                {unit === 'cm' ? Math.round(val) : val.toFixed(1)}
                                            </Text>
                                        ) : isMajorTick ? (
                                            <Text className="w-14 text-xs text-gray-400">
                                                {unit === 'cm' ? Math.round(val) : ''}
                                            </Text>
                                        ) : (
                                            <View style={{ width: 60 }} />
                                        )}

                                        <View
                                            style={{
                                                flex: 1,
                                                backgroundColor: isMainTick
                                                    ? '#50a762' // Dark green
                                                    : isMajorTick
                                                        ? '#7bc783' // Medium green
                                                        : '#c9e9cb', // Light green (minor)
                                                height: isMainTick ? 6 : isMajorTick ? 4 : 2, // ✅ different heights
                                                borderRadius: 999,
                                            }}
                                        />

                                    </View>
                                );
                            })}
                        </Animated.View>
                    </GestureDetector>

                    {/* Bottom Fade */}
                    <LinearGradient
                        colors={['transparent', '#f3fff3']}
                        className="absolute bottom-0 left-0 right-0 h-16 z-10"
                    />

                    {/* Center Indicator */}
                    <View className="absolute left-0 right-0 top-1/2 -mt-[1px]">
                        <View className="w-16 h-1 bg-orange-500 rounded-full mx-auto" />
                    </View>
                </View>
            </View>

            {/* Unit Switch */}
            <Pressable
                onPress={toggleUnit}
                className="bg-[#e5f2e3] px-5 py-2 rounded-full mt-4"
            >
                <Text className="text-base font-semibold text-gray-800 uppercase">
                    {unit}
                </Text>
            </Pressable>
        </View>
    );
}
