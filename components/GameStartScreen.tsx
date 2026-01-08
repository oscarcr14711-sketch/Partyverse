import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, ImageSourcePropType, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../utils/LanguageContext';
import { PulsingButton } from './PulsingButton';

interface GameStartScreenProps {
    backgroundImage?: ImageSourcePropType; // Not actually used in PreGameScreen style directly as bg image, but useful for flexibility
    backgroundColor?: string;
    logoImage?: ImageSourcePropType;
    // Allows passing a composite component for the main image area if needed, or a simple source
    gameImage?: React.ReactNode | ImageSourcePropType;
    gameImageResizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center'; // How to resize the game image
    title?: string | React.ReactNode; // Fallback if no logo
    minPlayers: number;
    maxPlayers: number;
    playerCount: number;
    setPlayerCount: (count: number) => void;
    onStart: () => void;
    onInstructions: () => void;
    accentColor?: string;
    startButtonText?: string;
    hidePlayerSelection?: boolean;
    playerCountLabel?: string;
    hideButtons?: boolean;
    hideStartButton?: boolean;
    gameImageSize?: { width: number; height: number };
    gameImageMarginTop?: number;
    gameImageMarginLeft?: number;
    logoMarginTop?: number;
    logoMarginLeft?: number;
    children?: React.ReactNode;
}

const avatarImages = [
    require('../assets/images/avatars/avatar1.png'),
    require('../assets/images/avatars/avatar2.png'),
    require('../assets/images/avatars/avatar3.png'),
    require('../assets/images/avatars/avatar4.png'),
    require('../assets/images/avatars/avatar5.png'),
    require('../assets/images/avatars/avatar6.png'),
];

export function GameStartScreen({
    backgroundImage,
    backgroundColor = '#3B1A5A',
    logoImage,
    gameImage,
    gameImageResizeMode = 'cover',
    title,
    minPlayers,
    maxPlayers,
    playerCount,
    setPlayerCount,
    onStart,
    onInstructions,
    accentColor = '#E74C3C',
    startButtonText,
    hidePlayerSelection = false,
    playerCountLabel,
    children,
    hideStartButton = false,
    hideButtons = false,
    gameImageSize,
    gameImageMarginTop = 0,
    gameImageMarginLeft = 0,
    logoMarginTop,
    logoMarginLeft,
}: GameStartScreenProps) {
    const router = useRouter();
    const { t } = useLanguage();

    // Use translations for defaults if not provided
    const finalStartButtonText = startButtonText || t('common.start');
    const finalPlayerCountLabel = playerCountLabel || t('common.players');

    const renderGameImage = () => {
        if (React.isValidElement(gameImage)) {
            return gameImage;
        }
        if (gameImage) {
            return (
                <Image
                    source={gameImage as ImageSourcePropType}
                    style={styles.mainImage}
                    resizeMode="contain"
                />
            );
        }
        return null;
    };

    const Content = (
        <>
            <View style={styles.contentContainer}>
                {/* Content Area with Game Image and Overlaid Logo */}
                {/* Content Area with Game Image and Overlaid Logo */}
                <View style={{
                    flex: 1,
                    width: '100%',
                    paddingBottom: (hideButtons && hidePlayerSelection) ? 0 : 160
                }}>
                    {(gameImage || logoImage || title) && (
                        <View style={{ flex: 1, width: '100%', position: 'relative', overflow: 'hidden' }}>
                            {gameImage && (
                                React.isValidElement(gameImage) ? (
                                    gameImage
                                ) : (
                                    <Image
                                        source={gameImage as ImageSourcePropType}
                                        style={[
                                            styles.mainImage,
                                            gameImageSize && { width: gameImageSize.width, height: gameImageSize.height },
                                            gameImageMarginTop > 0 && { marginTop: gameImageMarginTop },
                                            gameImageMarginLeft !== 0 && { marginLeft: gameImageMarginLeft },
                                        ]}
                                        resizeMode={gameImageResizeMode}
                                    />
                                )
                            )}
                            {logoImage && (
                                <Image
                                    source={logoImage}
                                    style={[
                                        styles.overlaidLogoImage,
                                        logoMarginTop !== undefined && { top: logoMarginTop },
                                        logoMarginLeft !== undefined && { left: logoMarginLeft }
                                    ]}
                                    resizeMode="contain"
                                />
                            )}
                            {/* Fallback title if no logo and no gameImage */}
                            {!logoImage && !gameImage && (
                                React.isValidElement(title) ? (
                                    title
                                ) : title ? (
                                    <Text style={[styles.titleText, { color: accentColor || '#fff' }]}>{title as string}</Text>
                                ) : null
                            )}
                        </View>
                    )}
                    {children}
                </View>

                {/* Bottom Control Container */}
                {/* Bottom Control Container - Only show if there's content */}
                {(!hidePlayerSelection || !hideButtons) && (
                    <View style={[styles.bottomControlContainer]}>
                        {/* Player Counter */}
                        {!hidePlayerSelection && (
                            <View style={styles.newPlayerCounterContainer}>
                                <TouchableOpacity
                                    style={[styles.newPlayerCounterButton, { backgroundColor: accentColor }]}
                                    onPress={() => setPlayerCount(Math.max(minPlayers, playerCount - 1))}
                                >
                                    <Text style={styles.newPlayerCounterButtonText}>−</Text>
                                </TouchableOpacity>

                                <View style={styles.playerCountDisplay}>
                                    <Text style={styles.playerCounterText}>{playerCount}</Text>
                                    <Text style={styles.playerCounterLabel}>{finalPlayerCountLabel}</Text>
                                </View>

                                <TouchableOpacity
                                    style={[styles.newPlayerCounterButton, { backgroundColor: accentColor }]}
                                    onPress={() => setPlayerCount(Math.min(maxPlayers, playerCount + 1))}
                                >
                                    <Text style={styles.newPlayerCounterButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Buttons */}
                        {!hideButtons && (
                            <View style={styles.buttonContainer}>
                                {/* Back Button on Left */}
                                <TouchableOpacity
                                    style={[styles.bottomBackButton, { backgroundColor: accentColor, borderBottomColor: darkenColor(accentColor) }]}
                                    onPress={() => router.back()}
                                >
                                    <Ionicons name="arrow-back" size={28} color="#fff" />
                                </TouchableOpacity>

                                {!hideStartButton && (
                                    <PulsingButton
                                        style={[styles.setupStartButton, { backgroundColor: accentColor, borderBottomColor: darkenColor(accentColor) }]}
                                        onPress={onStart}
                                    >
                                        <Text style={styles.setupStartButtonText}>{finalStartButtonText}</Text>
                                    </PulsingButton>
                                )}
                                <TouchableOpacity
                                    style={[styles.infoButton, { backgroundColor: accentColor, borderBottomColor: darkenColor(accentColor) }]}
                                    onPress={onInstructions}
                                >
                                    <Text style={styles.infoButtonText}>i</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </>
    );

    if (backgroundImage) {
        return (
            <View style={[styles.container, { backgroundColor }]}>
                <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
                    {Content}
                </ImageBackground>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {Content}
        </View>
    );
}

// Simple helper to darken hex color for borders (rudimentary just for the prop usage)
// Ideally we'd use a robust utility, but for this component's needs:
function darkenColor(hex: string) {
    // This is a very basic replacement for the border darkening. 
    // In PreGameScreen it was #E74C3C -> #C0392B
    // If we want exact match we might need to pass borderColor prop or use a library
    // For now returning the same color or a hardcoded darker var is tricky without logic.
    // We will assume the caller might want to pass distinct colors or we stick to a simple mapping or just use the same with opacity.
    // To keep it simple and safe given no dedicated color util imported in this file yet (it was in spicy-games):
    return hex; // In a real scenario, use 'polished' or similar. 
    // Actually, PreGameScreen hardcodes #C0392B which is a darker red.
    // Let's just use the prop passed or default. 
    // We can rely on shadow mainly.
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerSafeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomBackButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#6c5ce7', // Will be overridden by accentColor
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderBottomWidth: 4,
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 0,
        width: '100%',
    },
    logoImage: {
        width: 380,
        height: 180,
        marginBottom: 20,
    },
    overlaidLogoImage: {
        position: 'absolute',
        top: 30,
        alignSelf: 'center',
        width: 450,
        height: 200,
        zIndex: 10,
    },
    titleText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    mainImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    playerAvatarsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 20,
        marginTop: 30,
    },
    playerAvatar: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        overflow: 'hidden',
    },
    playerAvatarImage: {
        width: 60,
        height: 60,
    },
    playerAvatarImageAdjusted: {
        transform: [{ scale: 1.22 }],
    },
    // New Player Counter Styles
    newPlayerCounterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2C2C2C', // Dark background for the counter pill
        borderRadius: 50, // Pill shape
        padding: 5,
        marginBottom: 25,
        width: '100%', // Full width
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    newPlayerCounterButton: {
        width: 50,
        height: 50,
        borderRadius: 25, // Circular
        alignItems: 'center',
        justifyContent: 'center',
    },
    newPlayerCounterButtonText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        lineHeight: 32,
    },
    playerCountDisplay: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    playerCounterText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    playerCounterLabel: {
        fontSize: 14,
        color: '#ccc',
        marginTop: -5,
        fontWeight: '600',
    },

    // Bottom Sheet
    bottomControlContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1E1E1E', // Solid dark background as requested
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        paddingBottom: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 20,
    },

    // Buttons
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Spread buttons
        width: '100%',
    },
    setupStartButton: {
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderBottomWidth: 4,
        flex: 1, // Fill available space
        marginHorizontal: 10, // Add some spacing between buttons
    },
    setupStartButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
    },
    infoButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderBottomWidth: 4,
    },
    infoButtonText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
});
