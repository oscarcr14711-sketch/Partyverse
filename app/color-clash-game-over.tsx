import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GameStats {
    correct: number;
    wrong: number;
    totalDrinksGiven: number;
    totalDrinksTaken: number;
    bestStreak: number;
}

export default function ColorClashGameOver() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const correct = parseInt(params.correct as string) || 0;
    const wrong = parseInt(params.wrong as string) || 0;
    const bestStreak = parseInt(params.bestStreak as string) || 0;

    const neonPulse = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const confettiAnim = useRef(new Animated.Value(0)).current;

    const totalGuesses = correct + wrong;
    const accuracy = totalGuesses > 0 ? Math.round((correct / totalGuesses) * 100) : 0;

    // Calculate awards
    const getAwards = () => {
        const awards = [];

        if (accuracy >= 80) {
            awards.push({ emoji: '🎯', title: 'Color Master', description: `${accuracy}% accuracy!` });
        }

        if (bestStreak >= 5) {
            awards.push({ emoji: '🔥', title: 'Streak King', description: `${bestStreak} in a row!` });
        }

        if (wrong > correct) {
            awards.push({ emoji: '🍻', title: 'Drink Champion', description: 'Most drinks taken!' });
        }

        if (correct > wrong * 2) {
            awards.push({ emoji: '🧠', title: 'Mind Reader', description: 'Incredible predictions!' });
        }

        if (totalGuesses >= 17) {
            awards.push({ emoji: '🏆', title: 'Full Circle', description: 'Completed all cards!' });
        }

        return awards;
    };

    const awards = getAwards();

    useEffect(() => {
        // Neon pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(neonPulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(neonPulse, { toValue: 0, duration: 1000, useNativeDriver: true }),
            ])
        ).start();

        // Confetti
        Animated.loop(
            Animated.sequence([
                Animated.timing(confettiAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
                Animated.timing(confettiAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
            ])
        ).start();

        // Fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const neonGlow = neonPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [10, 25],
    });

    const confettiTranslateY = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, Dimensions.get('window').height + 50],
    });

    return (
        <LinearGradient
            colors={["#18061F", "#2B0B3F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* Confetti */}
            {[...Array(12)].map((_, i) => (
                <Animated.View
                    key={i}
                    style={[
                        styles.confetti,
                        {
                            left: `${(i * 8.5) % 100}%`,
                            transform: [{ translateY: confettiTranslateY }],
                            opacity: confettiAnim,
                        },
                    ]}
                >
                    <Text style={styles.confettiText}>
                        {['♥️', '♠️', '♦️', '♣️', '🎴', '✨'][i % 6]}
                    </Text>
                </Animated.View>
            ))}

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    {/* Title */}
                    <Animated.Text style={[styles.gameOverText, { textShadowRadius: neonGlow }]}>
                        GAME OVER!
                    </Animated.Text>
                    <Text style={styles.subtitle}>♥️♠️ Color Clash ♦️♣️</Text>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={styles.statEmoji}>✅</Text>
                            <Text style={styles.statValue}>{correct}</Text>
                            <Text style={styles.statLabel}>Correct</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statEmoji}>❌</Text>
                            <Text style={styles.statValue}>{wrong}</Text>
                            <Text style={styles.statLabel}>Wrong</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statEmoji}>🎯</Text>
                            <Text style={styles.statValue}>{accuracy}%</Text>
                            <Text style={styles.statLabel}>Accuracy</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statEmoji}>🔥</Text>
                            <Text style={styles.statValue}>{bestStreak}</Text>
                            <Text style={styles.statLabel}>Best Streak</Text>
                        </View>
                    </View>

                    {/* Awards Section */}
                    {awards.length > 0 && (
                        <View style={styles.awardsSection}>
                            <Text style={styles.awardsTitle}>🏆 AWARDS</Text>
                            <View style={styles.awardsGrid}>
                                {awards.map((award, index) => (
                                    <View key={index} style={styles.awardCard}>
                                        <Text style={styles.awardEmoji}>{award.emoji}</Text>
                                        <Text style={styles.awardTitle}>{award.title}</Text>
                                        <Text style={styles.awardDescription}>{award.description}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Summary */}
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryText}>
                            {accuracy >= 70
                                ? "🎉 Incredible performance! You're a Color Clash master!"
                                : accuracy >= 50
                                    ? "👏 Nice job! Keep practicing to improve your accuracy!"
                                    : "🍻 Better luck next time! The drinks were flowing!"}
                        </Text>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.playAgainButton}
                            onPress={() => router.push('/color-clash-pre-game')}
                        >
                            <LinearGradient
                                colors={['#00F5FF', '#00CED1']}
                                style={styles.buttonGradient}
                            >
                                <Ionicons name="refresh" size={24} color="#18061F" />
                                <Text style={styles.playAgainText}>PLAY AGAIN</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.homeButton}
                            onPress={() => router.push('/')}
                        >
                            <Ionicons name="home" size={24} color="#fff" />
                            <Text style={styles.homeText}>HOME</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </LinearGradient>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    confetti: {
        position: 'absolute',
        fontSize: 24,
    },
    confettiText: {
        fontSize: 28,
    },
    scrollContent: {
        flexGrow: 1,
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    content: {
        alignItems: 'center',
    },
    gameOverText: {
        fontSize: 52,
        fontWeight: '900',
        color: '#00F5FF',
        marginBottom: 10,
        textShadowColor: '#00F5FF',
        textShadowOffset: { width: 0, height: 0 },
        letterSpacing: 3,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    subtitle: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 35,
        opacity: 0.9,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 30,
        justifyContent: 'center',
        width: '100%',
    },
    statCard: {
        backgroundColor: 'rgba(0, 245, 255, 0.1)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        minWidth: (width - 60) / 2,
        maxWidth: 180,
        borderWidth: 2,
        borderColor: 'rgba(0, 245, 255, 0.3)',
    },
    statEmoji: {
        fontSize: 36,
        marginBottom: 10,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#00F5FF',
        marginBottom: 5,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    statLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '600',
    },
    awardsSection: {
        width: '100%',
        marginBottom: 30,
    },
    awardsTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#00F5FF',
        marginBottom: 20,
        textAlign: 'center',
        letterSpacing: 2,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    awardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    awardCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 18,
        padding: 18,
        alignItems: 'center',
        minWidth: (width - 60) / 2,
        maxWidth: 180,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    awardEmoji: {
        fontSize: 40,
        marginBottom: 10,
    },
    awardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 6,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    awardDescription: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    summaryBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 18,
        padding: 20,
        marginBottom: 30,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    summaryText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '600',
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    playAgainButton: {
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#00F5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 15,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 12,
    },
    playAgainText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#18061F',
        letterSpacing: 2,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    homeButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        gap: 12,
    },
    homeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
});
