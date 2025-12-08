import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PulsingButton } from '../components/PulsingButton';
import { RuleSection, RulesModal } from '../components/RulesModal';

export default function BrainBuzzerPreGame() {
    const router = useRouter();
    const [numPlayers, setNumPlayers] = useState(2);
    const [showRules, setShowRules] = useState(false);

    const avatarImages = [
        require('../assets/images/avatars/avatar1.png'),
        require('../assets/images/avatars/avatar2.png'),
        require('../assets/images/avatars/avatar3.png'),
        require('../assets/images/avatars/avatar4.png'),
        require('../assets/images/avatars/avatar5.png'),
        require('../assets/images/avatars/avatar6.png'),
    ];

    return (
        <View style={[styles.container, { backgroundColor: '#0A1E3D' }]}>
            <ImageBackground
                source={require('../assets/images/brain_buzzer_final.png')}
                style={styles.container}
                resizeMode="contain"
            >
                <View style={styles.overlay}>
                    {/* Title is part of the background image, so we just add spacing */}
                    <View style={styles.headerSpacer} />

                    {/* Controls Container */}
                    <View style={styles.controlsContainer}>
                        {/* Avatars */}
                        <View style={styles.avatarsRow}>
                            {[...Array(numPlayers)].map((_, i) => (
                                <Image
                                    key={i}
                                    source={avatarImages[i % avatarImages.length]}
                                    style={styles.avatar}
                                />
                            ))}
                        </View>

                        {/* Player Counter Pill */}
                        <View style={styles.playerCountPill}>
                            <PulsingButton
                                style={styles.playerCountCircle}
                                onPress={() => setNumPlayers(Math.max(2, numPlayers - 1))}
                            >
                                <Text style={styles.playerCountCircleText}>−</Text>
                            </PulsingButton>
                            <Text style={styles.playerCountText}>{numPlayers} Players</Text>
                            <PulsingButton
                                style={styles.playerCountCircle}
                                onPress={() => setNumPlayers(Math.min(6, numPlayers + 1))}
                            >
                                <Text style={styles.playerCountCircleText}>+</Text>
                            </PulsingButton>
                        </View>

                        {/* Start Button */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={() => router.push({ pathname: "/brain-buzzer-difficulty", params: { numPlayers } })}
                            >
                                <Text style={styles.startButtonText}>START</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.infoButton} onPress={() => setShowRules(true)}>
                                <Text style={styles.infoButtonText}>i</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <RulesModal
                    visible={showRules}
                    onClose={() => setShowRules(false)}
                    title="How to Play"
                    accentColor="#FFC107"
                >
                    <RuleSection title="🎯 Objective">
                        Answer trivia questions correctly before time runs out!
                    </RuleSection>
                    <RuleSection title="🎮 How It Works">
                        • Choose your difficulty level{'\n'}
                        • Each player takes turns{'\n'}
                        • Tap the correct answer{'\n'}
                        • Faster answers = more points
                    </RuleSection>
                    <RuleSection title="🏆 Scoring">
                        Correct answers earn points. Build streaks for bonus points!
                    </RuleSection>
                </RulesModal>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 60,
        paddingHorizontal: 24,
    },
    headerSpacer: {
        flex: 1, // Pushes controls down
    },
    controlsContainer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 40,
    },
    avatarsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginHorizontal: 8,
        backgroundColor: '#fff',
        borderWidth: 3,
        borderColor: '#FFC107', // Amber border
    },
    playerCountPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(24, 48, 74, 0.9)', // Dark Blue background
        borderRadius: 32,
        paddingHorizontal: 24,
        paddingVertical: 10,
        marginBottom: 30,
        width: 320,
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: '#FFC107', // Amber border
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    playerCountCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFC107', // Amber
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 2,
        borderColor: '#FFA000', // Darker Amber
    },
    playerCountCircleText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#18304A', // Dark Blue text
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    playerCountText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFC107', // Amber text
        textAlign: 'center',
        minWidth: 120,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    buttonContainer: {
        marginTop: 0,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 15,
    },
    startButton: {
        backgroundColor: '#FFC107',
        borderRadius: 30,
        paddingHorizontal: 60,
        paddingVertical: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
        borderBottomWidth: 4,
        borderBottomColor: '#FFA000',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFD54F',
    },
    startButtonText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#18304A',
        letterSpacing: 1,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    infoButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFC107',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderBottomWidth: 3,
        borderBottomColor: '#FFA000',
    },
    infoButtonText: { fontSize: 26, fontWeight: 'bold', color: '#18304A' },
});
