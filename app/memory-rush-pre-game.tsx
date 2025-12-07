import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PulsingButton } from '../components/PulsingButton';

const memoryImage = require('../assets/images/memory.png');

export default function MemoryRushPreGame() {
    const router = useRouter();
    const [numPlayers, setNumPlayers] = useState(2);
    const [showRules, setShowRules] = useState(false);

    const handleStart = () => {
        // Generate players array
        const players = Array.from({ length: numPlayers }, (_, i) => ({
            id: i,
            name: `Player ${i + 1}`,
            avatarIndex: i % 6,
        }));

        router.push({
            pathname: '/memory-rush-game',
            params: {
                players: JSON.stringify(players),
                difficulty: 'medium',
                numRounds: 5,
            }
        });
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Back Button */}
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>

                {/* Title */}
                <Text style={styles.title}>MEMORY</Text>
                <Text style={styles.title}>RUSH</Text>

                {/* Memory Image */}
                <Image source={memoryImage} style={styles.memoryImage} resizeMode="contain" />

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

                {/* Start Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                        <Text style={styles.startButtonText}>START</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.infoButton} onPress={() => setShowRules(true)}>
                        <Text style={styles.infoButtonText}>i</Text>
                    </TouchableOpacity>
                </View>

                {/* Rules Modal */}
                <Modal visible={showRules} transparent animationType="slide" onRequestClose={() => setShowRules(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>How to Play</Text>
                                <TouchableOpacity onPress={() => setShowRules(false)}>
                                    <Ionicons name="close" size={24} color="#FFE4B5" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.modalScroll}>
                                <Text style={styles.sectionTitle}>🎯 Objective</Text>
                                <Text style={styles.ruleText}>Memorize a sequence, then find what changed!</Text>
                                <Text style={styles.sectionTitle}>🎮 How It Works</Text>
                                <Text style={styles.ruleText}>• View the original sequence{'\n'}• Spot the difference{'\n'}• Tap the changed item{'\n'}• Be fast for bonus points!</Text>
                                <Text style={styles.sectionTitle}>🏆 Scoring</Text>
                                <Text style={styles.ruleText}>• Combo multipliers for streaks{'\n'}• Speed bonus for fast answers{'\n'}• 3 lives per game</Text>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E88B8B', // Pink background
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        padding: 8,
    },
    title: {
        fontSize: 64,
        fontWeight: '900',
        color: '#FFE4B5', // Cream/beige color
        textAlign: 'center',
        letterSpacing: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    memoryImage: {
        width: 500,
        height: 300,
        marginVertical: 30,
    },
    playerCountPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 50,
        paddingHorizontal: 24,
        paddingVertical: 12,
        justifyContent: 'space-between',
        width: 320,
        marginBottom: 30,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    playerCountCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1E3A5F', // Dark blue
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    playerCountCircleText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFE4B5',
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    playerCountText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E3A5F',
        textAlign: 'center',
        minWidth: 150,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    startButton: { backgroundColor: '#1E3A5F', borderRadius: 30, paddingHorizontal: 60, paddingVertical: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10 },
    startButtonText: { fontSize: 24, fontWeight: 'bold', color: '#FFE4B5', letterSpacing: 2, ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }) },
    buttonContainer: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    infoButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1E3A5F', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
    infoButtonText: { fontSize: 26, fontWeight: 'bold', color: '#FFE4B5' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#E88B8B', borderRadius: 20, maxHeight: '65%', borderWidth: 2, borderColor: '#1E3A5F' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(30,58,95,0.3)' },
    modalTitle: { color: '#1E3A5F', fontSize: 22, fontWeight: 'bold' },
    modalScroll: { padding: 20 },
    sectionTitle: { color: '#1E3A5F', fontSize: 18, fontWeight: 'bold', marginTop: 8, marginBottom: 5 },
    ruleText: { color: '#fff', fontSize: 15, lineHeight: 21, marginBottom: 6 },
});
