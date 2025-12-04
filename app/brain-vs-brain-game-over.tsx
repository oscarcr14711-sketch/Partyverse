import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BrainVsBrainGameOver() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const player1Score = parseInt(params.player1Score as string) || 0;
    const player2Score = parseInt(params.player2Score as string) || 0;
    const difficulty = params.difficulty as string || 'easy';

    const winner = player1Score > player2Score ? 1 : player2Score > player1Score ? 2 : 0;
    const winnerColor = winner === 1 ? '#E91E63' : winner === 2 ? '#2196F3' : '#FFC107';

    const confettiAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Celebration animation
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(confettiAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                    Animated.timing(confettiAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
                ])
            ),
        ]).start();
    }, []);

    const getBadges = () => {
        const badges = [];
        const totalQuestions = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 12 : 15;
        const winnerScore = Math.max(player1Score, player2Score);
        const accuracy = (winnerScore / totalQuestions) * 100;

        if (winnerScore === totalQuestions) badges.push({ icon: '🏆', name: 'Human Wikipedia', color: '#FFD700' });
        else if (accuracy >= 80) badges.push({ icon: '🧠', name: 'Trivia Beast', color: '#9C27B0' });
        else if (accuracy >= 60) badges.push({ icon: '⚡', name: 'Fast Thinker', color: '#FF9800' });

        if (Math.abs(player1Score - player2Score) >= 5) badges.push({ icon: '👑', name: 'Dominator', color: '#F44336' });
        if (winner !== 0 && (winner === 1 ? player1Score : player2Score) < 0) badges.push({ icon: '🍀', name: 'Lucky Guess Legend', color: '#4CAF50' });

        return badges;
    };

    const badges = getBadges();

    return (
        <LinearGradient colors={['#0A1E3D', '#18304A', '#2A4A6F']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Confetti Effect */}
                <Animated.View style={[styles.confettiContainer, { opacity: confettiAnim }]}>
                    <Text style={styles.confetti}>🎉</Text>
                    <Text style={styles.confetti}>🎊</Text>
                    <Text style={styles.confetti}>✨</Text>
                    <Text style={styles.confetti}>⭐</Text>
                </Animated.View>

                {/* Winner Display */}
                <Animated.View style={[styles.winnerSection, { transform: [{ scale: scaleAnim }] }]}>
                    {winner === 0 ? (
                        <>
                            <Text style={styles.winnerTitle}>IT'S A TIE!</Text>
                            <Text style={styles.tieEmoji}>🤝</Text>
                        </>
                    ) : (
                        <>
                            <View style={[styles.winnerAvatar, { backgroundColor: winnerColor }]}>
                                <Text style={styles.winnerAvatarText}>P{winner}</Text>
                            </View>
                            <Text style={[styles.winnerTitle, { color: winnerColor }]}>
                                PLAYER {winner} WINS!
                            </Text>
                            <Text style={styles.winnerEmoji}>🏆</Text>
                        </>
                    )}
                </Animated.View>

                {/* Scores */}
                <View style={styles.scoresSection}>
                    <View style={styles.scoreCard}>
                        <View style={[styles.scoreAvatar, { backgroundColor: '#E91E63' }]}>
                            <Text style={styles.scoreAvatarText}>P1</Text>
                        </View>
                        <Text style={styles.scoreLabel}>Player 1</Text>
                        <Text style={[styles.scoreValue, player1Score > player2Score && styles.scoreWinner]}>
                            {player1Score}
                        </Text>
                    </View>

                    <Text style={styles.vsText}>VS</Text>

                    <View style={styles.scoreCard}>
                        <View style={[styles.scoreAvatar, { backgroundColor: '#2196F3' }]}>
                            <Text style={styles.scoreAvatarText}>P2</Text>
                        </View>
                        <Text style={styles.scoreLabel}>Player 2</Text>
                        <Text style={[styles.scoreValue, player2Score > player1Score && styles.scoreWinner]}>
                            {player2Score}
                        </Text>
                    </View>
                </View>

                {/* Badges */}
                {badges.length > 0 && (
                    <View style={styles.badgesSection}>
                        <Text style={styles.badgesTitle}>🏅 ACHIEVEMENTS 🏅</Text>
                        <View style={styles.badgesGrid}>
                            {badges.map((badge, index) => (
                                <View key={index} style={[styles.badge, { borderColor: badge.color }]}>
                                    <Text style={styles.badgeIcon}>{badge.icon}</Text>
                                    <Text style={styles.badgeName}>{badge.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Buttons */}
                <View style={styles.buttonsSection}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push({ pathname: '/brain-vs-brain-pre-game' })}
                    >
                        <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.buttonGradient}>
                            <Ionicons name="refresh" size={24} color="#fff" />
                            <Text style={styles.buttonText}>PLAY AGAIN</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.back()}
                    >
                        <LinearGradient colors={['#2196F3', '#42A5F5']} style={styles.buttonGradient}>
                            <Ionicons name="home" size={24} color="#fff" />
                            <Text style={styles.buttonText}>MAIN MENU</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1, padding: 20 },
    confettiContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        paddingTop: 50,
        pointerEvents: 'none',
    },
    confetti: {
        fontSize: 48,
    },
    winnerSection: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    winnerAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: '#FFC107',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 12,
    },
    winnerAvatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
    },
    winnerTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFC107',
        textAlign: 'center',
        letterSpacing: 2,
        textShadowColor: '#FFC107',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    winnerEmoji: {
        fontSize: 64,
        marginTop: 10,
    },
    tieEmoji: {
        fontSize: 80,
        marginTop: 20,
    },
    scoresSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 30,
    },
    scoreCard: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 193, 7, 0.3)',
        minWidth: 120,
    },
    scoreAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFC107',
        marginBottom: 10,
    },
    scoreAvatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    scoreLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 8,
    },
    scoreValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    scoreWinner: {
        color: '#FFC107',
    },
    vsText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.5)',
    },
    badgesSection: {
        marginBottom: 30,
    },
    badgesTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFC107',
        textAlign: 'center',
        marginBottom: 15,
    },
    badgesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        minWidth: 140,
    },
    badgeIcon: {
        fontSize: 32,
        marginBottom: 5,
    },
    badgeName: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonsSection: {
        gap: 15,
        marginTop: 'auto',
    },
    button: {
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
});
