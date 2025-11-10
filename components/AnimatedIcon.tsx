
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, withRepeat, useAnimatedStyle, withTiming, Easing, withSequence } from 'react-native-reanimated';

type AnimatedIconProps = {
  name: React.ComponentProps<typeof Ionicons>['name'];
  size: number;
  color: string;
};

export function AnimatedIcon({ name, size, color }: AnimatedIconProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 500, easing: Easing.quad }),
        withTiming(1, { duration: 500, easing: Easing.quad })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}
