import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PulsingButton } from '../components/PulsingButton';

const clashImage = require('../assets/images/clash.png');

export default function ColorClashPreGame() {
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

    const handleStart = () => {
        router.push({
            pathname: '/color-clash',
            params: {
                numPlayers,
            }
        });
    };

    return (
        <LinearGradient
            colors={['#00008B', '#00008B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={[styles.titleText, { color: '#FF0000' }]}>Color</Text>
                    <Text style={[styles.titleText, { color: '#000000' }]}>Clash</Text>
                </View>

                {/* Game Preview */}
                <Image source={clashImage} style={styles.image} resizeMode="contain" />

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

                {/* Player Counter */}
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
                        onPress={() => setNumPlayers(Math.min(8, numPlayers + 1))}
                    >
                        <Text style={styles.playerCountCircleText}>+</Text>
                    </PulsingButton>
                </View>

                {/* Start Button with Info Icon */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                        <Text style={styles.startButtonText}>START</Text>
                    </TouchableOpacity>

                    {/* Info Icon */}
                    <TouchableOpacity style={styles.infoButton} onPress={() => setShowRules(true)}>
                        <Ionicons name="information-circle" size={32} color="#00F5FF" />
                    </TouchableOpacity>
                </View>

                {/* Rules Modal */}
                <Modal
                    visible={showRules}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowRules(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setShowRules(false)}
                    >
                        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styles.modalTitle}>🎯 HOW TO PLAY</Text>

                                <View style={styles.ruleCard}>
                                    <Text style={styles.ruleNumber}>1</Text>
                                    <View style={styles.ruleContent}>
                                        <Text style={styles.ruleText}>Pick RED ♥️ or BLACK ♠️</Text>
                                        <Text style={styles.ruleSubtext}>Guess the color of the next card</Text>
                                    </View>
                                </View>

                                <View style={styles.ruleCard}>
                                    <Text style={styles.ruleNumber}>2</Text>
                                    <View style={styles.ruleContent}>
                                        <Text style={styles.ruleText}>Tap a Card to Reveal</Text>
                                        <Text style={styles.ruleSubtext}>Flip all cards to complete the round</Text>
                                    </View>
                                </View>

                                <View style={styles.ruleCard}>
                                    <Text style={styles.ruleNumber}>3</Text>
                                    <View style={styles.ruleContent}>
                                        <Text style={styles.ruleText}>Correct? Choose Who Drinks!</Text>
                                        <Text style={styles.ruleSubtext}>Wrong? You drink!</Text>
                                    </View>
                                </View>

                                <View style={styles.ruleCard}>
                                    <Text style={styles.ruleNumber}>4</Text>
                                    <View style={styles.ruleContent}>
                                        <Text style={styles.ruleText}>Card Values</Text>
                                        <Text style={styles.ruleSubtext}>A=1s, 2-10=face value, J=11s, Q=12s, K=13s</Text>
                                    </View>
                                </View>

                                <View style={styles.multiplierSection}>
                                    <Text style={styles.multiplierTitle}>⚡ ROUND MULTIPLIERS</Text>
                                    <Text style={styles.multiplierText}>Round 1: ×1  •  Round 2: ×2</Text>
                                    <Text style={styles.multiplierText}>Round 3: ×3  •  Round 4: ×4</Text>
                                </View>

                                <TouchableOpacity style={styles.closeButton} onPress={() => setShowRules(false)}>
                                    <Text style={styles.closeButtonText}>GOT IT!</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    titleContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    titleText: {
        fontSize: 48,
        fontWeight: '900',
        letterSpacing: 2,
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    image: {
        width: 350,
        height: 350,
        marginBottom: 30,
    },
    avatarsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginHorizontal: 8,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#00F5FF',
    },
    playerCountPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 245, 255, 0.1)',
        borderRadius: 32,
        paddingHorizontal: 24,
        paddingVertical: 10,
        marginVertical: 16,
        width: 320,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
        justifyContent: 'space-between',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: 'rgba(0, 245, 255, 0.3)',
    },
    playerCountCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#00F5FF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#00F5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
    },
    playerCountCircleText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#18061F',
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    playerCountText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        minWidth: 150,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    buttonContainer: {
        marginTop: 16,
        alignItems: 'center',
        position: 'relative',
    },
    startButton: {
        backgroundColor: '#00F5FF',
        borderRadius: 30,
        paddingHorizontal: 80,
        paddingVertical: 16,
        marginBottom: 10,
        shadowColor: '#00F5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 15,
    },
    startButtonText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#18061F',
        letterSpacing: 2,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    infoButton: {
        position: 'absolute',
        right: -50,
        top: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#2B0B3F',
        borderRadius: 20,
        padding: 25,
        maxHeight: '80%',
        width: '100%',
        maxWidth: 400,
        borderWidth: 2,
        borderColor: '#00F5FF',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00F5FF',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 1,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    ruleCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
    },
    ruleNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#00F5FF',
        color: '#18061F',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 40,
        marginRight: 15,
    },
    ruleContent: {
        flex: 1,
    },
    ruleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    ruleSubtext: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    multiplierSection: {
        backgroundColor: 'rgba(0, 245, 255, 0.1)',
        borderRadius: 15,
        padding: 15,
        marginTop: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 245, 255, 0.3)',
    },
    multiplierTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00F5FF',
        textAlign: 'center',
        marginBottom: 10,
    },
    multiplierText: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 4,
    },
    closeButton: {
        backgroundColor: '#00F5FF',
        borderRadius: 15,
        paddingVertical: 14,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#18061F',
        letterSpacing: 1,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
});
