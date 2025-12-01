import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

interface BouncyButtonProps extends PressableProps {
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    scaleTo?: number;
}

export function BouncyButton({ style, children, scaleTo = 0.9, ...props }: BouncyButtonProps) {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: scaleTo,
            useNativeDriver: true,
            tension: 100,
            friction: 3,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            tension: 40,
            friction: 5,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <Pressable
                {...props}
                style={style}
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
