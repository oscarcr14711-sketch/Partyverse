import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../components/BackButton';
import { PulsingButton } from '../components/PulsingButton';
import { RuleSection, RulesModal } from '../components/RulesModal';

export default function LipSyncPreGame() {
    const router = useRouter();
    const [numPlayers, setNumPlayers] = useState(3);
    const [showRules, setShowRules] = useState(false);

    const avatarImages = [
        require('../assets/images/avatars/avatar1.png'),
        require('../assets/images/avatars/avatar2.png'),
        require('../assets/images/avatars/avatar3.png'),
        require('../assets/images/avatars/avatar4.png'),
        require('../assets/images/avatars/avatar5.png'),
        require('../assets/images/avatars/avatar6.png'),
    ];

    const handleStart = () => {
        // Show headphones warning popup
        Alert.alert(
            '🎧 Headphones Required!',
            'Make sure the guesser is wearing headphones with LOUD music so they can\'t hear! Ready to play?',
            [
                {
                    text: 'Not Ready',
                    style: 'cancel'
                },
                {
                    text: 'Let\'s Play!',
                    onPress: () => {
                        router.push({ pathname: "/lip-sync-game", params: { numPlayers } });
                    }
                }
            ]
        );
    };

    return (
        <ImageBackground
            source={require('../assets/images/lip.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.safeHeader}>
                <View style={styles.header}>
                    <BackButton color="#FFE0B2" />
                </View>
            </SafeAreaView>
            <View style={styles.overlay}>
                {/* Title */}
                <Text style={styles.titleText}>LIP SYNC{'\n'}CHAOS</Text>

                {/* Spacer to push controls down if needed, or just use justify content */}
                <View style={{ flex: 1 }} />

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
                        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
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
                accentColor="#1ABC9C"
            >
                <RuleSection title="🎯 Objective">
                    Read lips to guess the phrase while wearing headphones with loud music!
                </RuleSection>
                <RuleSection title="🎧 Setup">
                    • One player puts on headphones{'\n'}
                    • Loud music plays so they can't hear{'\n'}
                    • The other player holds the phone
                </RuleSection>
                <RuleSection title="🎮 How It Works">
                    • A phrase appears on screen{'\n'}
                    • Player without headphones reads it aloud{'\n'}
                    • Player with headphones tries to guess by reading lips{'\n'}
                    • Points for correct guesses!
                </RuleSection>
                <RuleSection title="💡 Tips">
                    • Speak clearly and slowly{'\n'}
                    • Exaggerate your mouth movements{'\n'}
                    • Music should be loud enough to block hearing
                </RuleSection>
            </RulesModal>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    safeHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
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
    titleText: {
        fontSize: 48,
        fontWeight: '900',
        color: '#FFE0B2',
        textAlign: 'center',
        marginTop: 20,
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 8,
    },
    noticeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(26, 188, 156, 0.9)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 15,
        borderWidth: 2,
        borderColor: '#1ABC9C',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    noticeIcon: {
        fontSize: 24,
        marginRight: 10,
    },
    noticeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    controlsContainer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 20,
    },
    avatarsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginHorizontal: 8,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#1ABC9C',
    },
    playerCountPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#004D40',
        borderRadius: 32,
        paddingHorizontal: 24,
        paddingVertical: 10,
        marginBottom: 24,
        width: 320,
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: '#00695C',
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
        backgroundColor: '#1ABC9C',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 12,
        borderWidth: 2,
        borderColor: '#16A085',
    },
    playerCountCircleText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    playerCountText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFE0B2',
        textAlign: 'center',
        minWidth: 120,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    buttonContainer: { marginTop: 0, alignItems: 'center', flexDirection: 'row', gap: 15 },
    startButton: { backgroundColor: '#004D40', borderRadius: 30, paddingHorizontal: 60, paddingVertical: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 10, borderBottomWidth: 4, borderBottomColor: '#00332A', alignItems: 'center', borderWidth: 1, borderColor: '#1ABC9C' },
    startButtonText: { fontSize: 24, fontWeight: 'bold', color: '#1ABC9C', letterSpacing: 1, ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }) },
    infoButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1ABC9C', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
    infoButtonText: { fontSize: 26, fontWeight: 'bold', color: '#004D40' },
});
