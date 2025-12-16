import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

interface BouncyButtonProps extends PressableProps {
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    scaleTo?: number;
}

export function BouncyButton({ style, children, ...props }: BouncyButtonProps) {
    return (
        <Pressable
            {...props}
            style={style}
        >
            {children}
        </Pressable>
    );
}
