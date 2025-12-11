import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { playSound } from '../utils/SoundManager';

interface BackButtonProps {
    onPress?: () => void;
    color?: string;
    size?: number;
    style?: ViewStyle;
}

export function BackButton({
    onPress,
    color = 'white',
    size = 24,
    style
}: BackButtonProps) {
    const router = useRouter();

    const handlePress = () => {
        playSound('ui.buttonClick');
        if (onPress) {
            onPress();
        } else {
            router.back();
        }
    };

    return (
        <TouchableOpacity
            style={[styles.backButton, style]}
            activeOpacity={0.7}
            onPress={handlePress}
        >
            <Ionicons name="arrow-back" size={size} color={color} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    backButton: {
        padding: 8,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
});
