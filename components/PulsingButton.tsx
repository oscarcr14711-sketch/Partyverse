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
    pulseScale, // Ignored
    pulseDuration, // Ignored
    ...props
}: PulsingButtonProps) {
    return (
        <Pressable
            {...props}
            style={style}
        >
            {children}
        </Pressable>
    );
}
