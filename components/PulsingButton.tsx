import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

interface PulsingButtonProps extends PressableProps {
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    pulseScale?: number;
    pulseDuration?: number;
}

export function PulsingButton({
    style,
    children,
    pulseScale = 1.05,
    pulseDuration = 1000,
    ...props
}: PulsingButtonProps) {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const pressScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Continuous pulsing animation
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: pulseScale,
                    duration: pulseDuration / 2,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: pulseDuration / 2,
                    useNativeDriver: true,
                }),
            ])
        );

        pulseAnimation.start();

        return () => {
            pulseAnimation.stop();
        };
    }, [scaleValue, pulseScale, pulseDuration]);

    const handlePressIn = () => {
        Animated.spring(pressScale, {
            toValue: 0.95,
            useNativeDriver: true,
            tension: 100,
            friction: 3,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 40,
            friction: 5,
        }).start();
    };

    // Combine both animations
    const combinedScale = Animated.multiply(scaleValue, pressScale);

    return (
        <Animated.View style={[style, { transform: [{ scale: combinedScale }] }]}>
            <Pressable
                {...props}
                onPressIn={(e) => {
                    handlePressIn();
                    props.onPressIn?.(e);
                }}
                onPressOut={(e) => {
                    handlePressOut();
                    props.onPressOut?.(e);
                }}
            >
                {children}
            </Pressable>
        </Animated.View>
    );
}
