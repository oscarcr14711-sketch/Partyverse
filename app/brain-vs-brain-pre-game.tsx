import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function BrainVsBrainPreGame() {
    const router = useRouter();
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

    const difficulties = [
        { id: 'easy' as Difficulty, name: 'EASY', icon: '🟢', questions: 10, color: ['#4CAF50', '#66BB6A'] },
        { id: 'medium' as Difficulty, name: 'MEDIUM', icon: '🟡', questions: 12, color: ['#FFC107', '#FFD54F'] },
        { id: 'hard' as Difficulty, name: 'HARD', icon: '🔴', questions: 15, color: ['#F44336', '#EF5350'] },
    ];

    const handleStart = () => {
        if (!selectedDifficulty) return;
        router.push({
            pathname: '/brain-vs-brain-game',
            params: { difficulty: selectedDifficulty }
        });
    };

    return (
        <LinearGradient
            colors={['#0A1E3D', '#18304A', '#2A4A6F']}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="#FFC107" />
                    </TouchableOpacity>
                    <Text style={styles.title}>BRAIN VS BRAIN</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Subtitle */}
                <Text style={styles.subtitle}>⚡ Fast-Paced Buzzer Battles ⚡</Text>

                {/* Player Avatars */}
                <View style={styles.playersSection}>
                    <View style={styles.playerCard}>
                        <View style={[styles.playerAvatar, { backgroundColor: '#E91E63' }]}>
                            <Text style={styles.playerAvatarText}>P1</Text>
                        </View>
                        <Text style={styles.playerLabel}>Player 1</Text>
                    </View>

                    <Text style={styles.vsText}>VS</Text>

                    <View style={styles.playerCard}>
                        <View style={[styles.playerAvatar, { backgroundColor: '#2196F3' }]}>
                            <Text style={styles.playerAvatarText}>P2</Text>
                        </View>
                        <Text style={styles.playerLabel}>Player 2</Text>
                    </View>
                </View>

                {/* Difficulty Selection */}
                <View style={styles.difficultySection}>
                    <Text style={styles.sectionTitle}>SELECT DIFFICULTY</Text>

                    {difficulties.map((diff) => (
                        <TouchableOpacity
                            key={diff.id}
                            style={[
                                styles.difficultyButton,
                                selectedDifficulty === diff.id && styles.difficultyButtonSelected
                            ]}
                            onPress={() => setSelectedDifficulty(diff.id)}
                        >
                            <LinearGradient
                                colors={selectedDifficulty === diff.id ? diff.color as [string, string] : ['#1A3A5A', '#2A4A6A']}
                                style={styles.difficultyGradient}
                            >
                                <Text style={styles.difficultyIcon}>{diff.icon}</Text>
                                <View style={styles.difficultyInfo}>
                                    <Text style={styles.difficultyName}>{diff.name}</Text>
                                    <Text style={styles.difficultyQuestions}>{diff.questions} Questions</Text>
                                </View>
                                {selectedDifficulty === diff.id && (
                                    <Ionicons name="checkmark-circle" size={32} color="#fff" />
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Start Button */}
                <TouchableOpacity
                    style={[styles.startButton, !selectedDifficulty && styles.startButtonDisabled]}
                    onPress={handleStart}
                    disabled={!selectedDifficulty}
                >
                    <LinearGradient
                        colors={selectedDifficulty ? ['#FFC107', '#FFD54F'] : ['#666', '#888']}
                        style={styles.startButtonGradient}
                    >
                        <Ionicons name="play" size={28} color="#0A1E3D" />
                        <Text style={styles.startButtonText}>START GAME</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1, padding: 20 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    backButton: { padding: 8 },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFC107',
        letterSpacing: 2,
        textShadowColor: '#FFC107',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
        opacity: 0.9,
    },
    playersSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 40,
    },
    playerCard: { alignItems: 'center' },
    playerAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFC107',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    playerAvatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    playerLabel: {
        fontSize: 16,
        color: '#fff',
        marginTop: 8,
        fontWeight: '600',
    },
    vsText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFC107',
        textShadowColor: '#FFC107',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    difficultySection: {
        flex: 1,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFC107',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 1,
    },
    difficultyButton: {
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
    },
    difficultyButtonSelected: {
        shadowColor: '#FFC107',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 12,
    },
    difficultyGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 193, 7, 0.3)',
    },
    difficultyIcon: {
        fontSize: 36,
        marginRight: 15,
    },
    difficultyInfo: { flex: 1 },
    difficultyName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    difficultyQuestions: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    startButton: {
        borderRadius: 30,
        overflow: 'hidden',
        marginTop: 10,
    },
    startButtonDisabled: { opacity: 0.5 },
    startButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 12,
    },
    startButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0A1E3D',
        letterSpacing: 2,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
});
