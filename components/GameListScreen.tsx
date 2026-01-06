import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, ImageSourcePropType, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { playSound } from '../utils/SoundManager';
import { BackButton } from './BackButton';
import { PulsingButton } from './PulsingButton';

export interface Game {
    title: string;
    description: string;
    emoji?: string;
    logo?: ImageSourcePropType;
    color: string;
    path: string;
}

interface GameListScreenProps {
    title: string;
    games: Game[];
    backgroundImage?: ImageSourcePropType;
    backgroundColor?: string;
}

// Color helpers para el efecto 3D
const clamp = (v: number) => Math.max(0, Math.min(255, v));
const hexToRgb = (hex: string) => {
    const full = hex.replace('#', '');
    const h = full.length === 3 ? full.split('').map((c) => c + c).join('') : full;
    const num = parseInt(h, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};
const rgbToHex = (r: number, g: number, b: number) =>
    '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
const lighten = (hex: string, amt = 0.2) => {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(
        clamp(Math.round(r + (255 - r) * amt)),
        clamp(Math.round(g + (255 - g) * amt)),
        clamp(Math.round(b + (255 - b) * amt))
    );
};
const darken = (hex: string, amt = 0.2) => {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(
        clamp(Math.round(r * (1 - amt))),
        clamp(Math.round(g * (1 - amt))),
        clamp(Math.round(b * (1 - amt)))
    );
};

interface GameItemProps {
    title: string;
    description: string;
    emoji?: string;
    logo?: ImageSourcePropType;
    color: string;
    onPress: () => void;
}

const GameItem = ({ title, description, emoji, logo, color, onPress }: GameItemProps) => {
    const top = lighten(color, 0.30);
    const bottom = darken(color, 0.30);
    const ringLight = lighten(color, 0.45);
    const ringDark = darken(color, 0.45);

    return (
        <PulsingButton onPress={onPress}>
            <LinearGradient
                colors={[ringLight, ringDark]}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={[styles.gameButtonOuter, { shadowColor: ringDark }]}
            >
                <LinearGradient
                    colors={[top, bottom]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.gameButtonInner}
                >
                    <LinearGradient
                        colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.22)"]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={styles.buttonInnerShadow}
                    />
                    {logo ? (
                        <Image source={logo} style={styles.gameLogo} resizeMode="contain" />
                    ) : (
                        <Text style={styles.gameEmoji}>{emoji}</Text>
                    )}
                    <View style={styles.gameTextContainer}>
                        <Text style={styles.gameTitle}>{title}</Text>
                        <Text style={styles.gameDescription}>{description}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#E8E8E8" />
                </LinearGradient>
            </LinearGradient>
        </PulsingButton>
    );
};

export function GameListScreen({ title, games, backgroundImage, backgroundColor = '#1a1a2e' }: GameListScreenProps) {
    const router = useRouter();

    const handleGamePress = (path: string) => {
        playSound('ui.buttonClick');
        router.push(path as any);
    };

    const content = (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
            <View style={styles.backButtonContainer}>
                <BackButton />
            </View>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {games.map((game, index) => (
                    <GameItem
                        key={index}
                        title={game.title}
                        description={game.description}
                        emoji={game.emoji}
                        logo={game.logo}
                        color={game.color}
                        onPress={() => handleGamePress(game.path)}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );

    if (backgroundImage) {
        return (
            <ImageBackground
                source={backgroundImage}
                style={styles.background}
                resizeMode="cover"
            >
                {content}
            </ImageBackground>
        );
    }

    return (
        <View style={[styles.background, { backgroundColor }]}>
            {content}
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingBottom: 20,
    },
    backButtonContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 5,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 5,
        paddingBottom: 15,
    },
    headerTitle: {
        color: 'white',
        fontSize: 28,
        fontWeight: '900',
        textAlign: 'center',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 0,
        gap: 12,
    },
    gameButtonOuter: {
        borderRadius: 24,
        padding: 2, // Reduced from 4
        marginBottom: 4,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 10,
    },
    gameButtonInner: {
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingRight: 18,
        paddingLeft: 0, // Removed left padding for the logo
        minHeight: 100,
        overflow: 'hidden',
    },
    buttonInnerShadow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        borderRadius: 20,
    },
    gameEmoji: {
        fontSize: 40,
        marginRight: 16,
    },
    gameLogo: {
        width: 110, // Slightly wider to fill space
        height: 90, // Slightly taller
        marginRight: 8, // Reduced margin
    },
    gameTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    gameTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    gameDescription: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 13,
        fontWeight: '500',
        letterSpacing: 0.2,
        lineHeight: 18,
    },
});
