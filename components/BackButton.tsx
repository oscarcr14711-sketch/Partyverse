import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { playSound } from '../utils/SoundManager';
import { BouncyButton } from './BouncyButton';

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
        <BouncyButton onPress={handlePress}>
            <TouchableOpacity style={[styles.backButton, style]} activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={size} color={color} />
            </TouchableOpacity>
        </BouncyButton>
    );
}

const styles = StyleSheet.create({
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
    },
});
