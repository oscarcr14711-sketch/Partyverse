import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Player {
    id: number;
    name: string;
    avatarIndex: number;
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    timeouts: number;
    streak: number;
    fastestTime: number | null;
    reactionTimes: number[];
}

interface Award {
    title: string;
    emoji: string;
    player: string;
    description: string;
}

const AVATAR_IMAGES = [
    require('../assets/images/avatars/avatar1.png'),
    require('../assets/images/avatars/avatar2.png'),
    require('../assets/images/avatars/avatar3.png'),
    require('../assets/images/avatars/avatar4.png'),
    require('../assets/images/avatars/avatar5.png'),
    require('../assets/images/avatars/avatar6.png'),
];

export default function MemoryRushGameOver() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const players: Player[] = JSON.parse(params.players as string || '[]');

    const neonAnim = useRef(new Animated.Value(0)).current;
    const confettiAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];

    // Calculate awards
    const calculateAwards = (): Award[] => {
        const awards: Award[] = [];

        // Memory Monster (highest accuracy)
        const accuracyPlayers = players.map(p => ({
            player: p,
            accuracy: p.correctAnswers + p.wrongAnswers > 0
                ? p.correctAnswers / (p.correctAnswers + p.wrongAnswers)
                : 0
        }));
        const memoryMonster = accuracyPlayers.sort((a, b) => b.accuracy - a.accuracy)[0];
        if (memoryMonster && memoryMonster.accuracy > 0) {
            awards.push({
                title: 'Memory Monster',
                emoji: '🧠',
                player: memoryMonster.player.name,
                description: `${Math.round(memoryMonster.accuracy * 100)}% accuracy`,
            });
        }

        // Speed Demon (fastest average reaction)
        const speedPlayers = players.filter(p => p.reactionTimes.length > 0).map(p => ({
            player: p,
            avgTime: p.reactionTimes.reduce((a, b) => a + b, 0) / p.reactionTimes.length
        }));
        if (speedPlayers.length > 0) {
            const speedDemon = speedPlayers.sort((a, b) => a.avgTime - b.avgTime)[0];
            awards.push({
                title: 'Speed Demon',
                emoji: '⚡',
                player: speedDemon.player.name,
                description: `${(speedDemon.avgTime / 1000).toFixed(2)}s avg`,
            });
        }

        // Lightning Brain (had a perfect streak)
        const lightningBrain = players.find(p => p.streak >= 3);
        if (lightningBrain) {
            awards.push({
                title: 'Lightning Brain',
                emoji: '🔥',
                player: lightningBrain.name,
                description: 'Perfect streak!',
            });
        }

        // Overthinker (most timeouts)
        const overthinker = [...players].sort((a, b) => b.timeouts - a.timeouts)[0];
        if (overthinker && overthinker.timeouts > 0) {
            awards.push({
                title: 'Overthinker',
                emoji: '🤔',
                player: overthinker.name,
                description: `${overthinker.timeouts} timeout${overthinker.timeouts > 1 ? 's' : ''}`,
            });
        }

        // Chaos Brain (most wrong answers)
        const chaosBrain = [...players].sort((a, b) => b.wrongAnswers - a.wrongAnswers)[0];
        if (chaosBrain && chaosBrain.wrongAnswers > 0) {
            awards.push({
                title: 'Chaos Brain',
                emoji: '🌪️',
                player: chaosBrain.name,
                description: 'Most creative guesses',
            });
        }

        return awards;
    };

    const awards = calculateAwards();

    useEffect(() => {
        // Neon pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(neonAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(neonAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
            ])
        ).start();

        // Confetti animation
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

    const neonGlow = neonAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20],
    });

    const confettiTranslateY = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, Dimensions.get('window').height + 50],
    });

    return (
        <LinearGradient
            colors={['#667eea', '#764ba2', '#f093fb']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {/* Confetti */}
            {[...Array(15)].map((_, i) => (
                <Animated.View
                    key={i}
                    style={[
                        styles.confetti,
                        {
                            left: `${(i * 7) % 100}%`,
                            transform: [{ translateY: confettiTranslateY }],
                            opacity: confettiAnim,
                        },
                    ]}
                >
                    <Text style={styles.confettiText}>
                        {['⚡', '🧠', '💨', '✨', '🔥'][i % 5]}
                    </Text>
                </Animated.View>
            ))}

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    {/* Game Over Title */}
                    <Animated.Text style={[styles.gameOverText, { textShadowRadius: neonGlow }]}>
                        GAME OVER!
                    </Animated.Text>
                    <Text style={styles.subtitle}>🧠💨 Memory Rush</Text>

                    {/* Winner Section */}
                    <View style={styles.winnerSection}>
                        <Text style={styles.winnerLabel}>🏆 WINNER 🏆</Text>
                        <View style={styles.winnerCard}>
                            <LinearGradient
                                colors={['#f093fb', '#f5576c']}
                                style={styles.winnerGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Image
                                    source={AVATAR_IMAGES[winner.avatarIndex % AVATAR_IMAGES.length]}
                                    style={styles.winnerAvatar}
                                />
                                <Text style={styles.winnerName}>{winner.name}</Text>
                                <Text style={styles.winnerScore}>{winner.score} points</Text>
                            </LinearGradient>
                        </View>
                    </View>

                    {/* Final Scores */}
                    <View style={styles.scoresSection}>
                        <Text style={styles.sectionTitle}>Final Scores</Text>
                        <View style={styles.scoresCard}>
                            {sortedPlayers.map((player, index) => (
                                <View key={player.id} style={styles.scoreRow}>
                                    <View style={[
                                        styles.rankBadge,
                                        index === 0 && styles.rankBadgeGold,
                                        index === 1 && styles.rankBadgeSilver,
                                        index === 2 && styles.rankBadgeBronze,
                                    ]}>
                                        <Text style={styles.rankText}>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                        </Text>
                                    </View>
                                    <Image
                                        source={AVATAR_IMAGES[player.avatarIndex % AVATAR_IMAGES.length]}
                                        style={styles.playerAvatar}
                                    />
                                    <View style={styles.playerInfo}>
                                        <Text style={styles.playerName}>{player.name}</Text>
                                        <Text style={styles.playerStats}>
                                            ✓ {player.correctAnswers} | ✗ {player.wrongAnswers}
                                        </Text>
                                    </View>
                                    <Text style={styles.playerScore}>{player.score}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Awards Section */}
                    {awards.length > 0 && (
                        <View style={styles.awardsSection}>
                            <Text style={styles.sectionTitle}>🎖️ Special Awards</Text>
                            <View style={styles.awardsGrid}>
                                {awards.map((award, index) => (
                                    <View key={index} style={styles.awardCard}>
                                        <Text style={styles.awardEmoji}>{award.emoji}</Text>
                                        <Text style={styles.awardTitle}>{award.title}</Text>
                                        <Text style={styles.awardPlayer}>{award.player}</Text>
                                        <Text style={styles.awardDescription}>{award.description}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.playAgainButton}
                            onPress={() => router.push('/memory-rush-pre-game')}
                        >
                            <LinearGradient
                                colors={['#2ecc71', '#27ae60']}
                                style={styles.buttonGradient}
                            >
                                <Ionicons name="refresh" size={24} color="#fff" />
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
        fontSize: 24,
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
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textShadowColor: '#f093fb',
        textShadowOffset: { width: 0, height: 0 },
        letterSpacing: 2,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    subtitle: {
        fontSize: 18,
        color: '#ffd32a',
        marginBottom: 30,
        fontStyle: 'italic',
    },
    winnerSection: {
        alignItems: 'center',
        marginBottom: 40,
        width: '100%',
    },
    winnerLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        letterSpacing: 2,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    winnerCard: {
        width: '100%',
        borderRadius: 25,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 12,
    },
    winnerGradient: {
        padding: 30,
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff',
        borderRadius: 25,
    },
    winnerAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#fff',
        marginBottom: 15,
    },
    winnerName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    winnerScore: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    scoresSection: {
        width: '100%',
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    scoresCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    rankBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#95a5a6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankBadgeGold: {
        backgroundColor: '#ffd32a',
    },
    rankBadgeSilver: {
        backgroundColor: '#bdc3c7',
    },
    rankBadgeBronze: {
        backgroundColor: '#cd7f32',
    },
    rankText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    playerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#ffd32a',
        marginRight: 12,
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    playerStats: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 2,
    },
    playerScore: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f093fb',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    awardsSection: {
        width: '100%',
        marginBottom: 30,
    },
    awardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    awardCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        width: (width - 56) / 2,
        borderWidth: 2,
        borderColor: '#ffd32a',
    },
    awardEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    awardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffd32a',
        marginBottom: 6,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    awardPlayer: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    awardDescription: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    playAgainButton: {
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
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
        color: '#fff',
        letterSpacing: 1,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    homeButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
        letterSpacing: 1,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
});
