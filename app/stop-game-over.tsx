import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Player {
    id: number;
    name: string;
    answers: { [category: string]: string };
    score: number;
    funnyVotes: number;
}

interface Award {
    title: string;
    emoji: string;
    player: string;
    description: string;
}

export default function StopGameOver() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const players: Player[] = JSON.parse(params.players as string || '[]');
    const gameMode = params.gameMode as string;

    const confettiAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Sort players by score
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];

    // Calculate awards
    const calculateAwards = (): Award[] => {
        const awards: Award[] = [];

        // Most Creative (most unique answers)
        const creativityScores = players.map(p => {
            const allAnswers = Object.values(p.answers);
            return { player: p, uniqueCount: allAnswers.filter(a => a && a.length > 0).length };
        });
        const mostCreative = creativityScores.sort((a, b) => b.uniqueCount - a.uniqueCount)[0];
        if (mostCreative && mostCreative.uniqueCount > 0) {
            awards.push({
                title: 'Most Creative',
                emoji: '🎨',
                player: mostCreative.player.name,
                description: 'Filled the most categories'
            });
        }

        // Funniest (most funny votes)
        const funniest = [...players].sort((a, b) => b.funnyVotes - a.funnyVotes)[0];
        if (funniest && funniest.funnyVotes > 0) {
            awards.push({
                title: 'Funniest Answer',
                emoji: '😂',
                player: funniest.name,
                description: 'Made everyone laugh'
            });
        }

        // Fastest Writer (placeholder - could track time in future)
        const randomFastest = players[Math.floor(Math.random() * players.length)];
        awards.push({
            title: 'Speed Demon',
            emoji: '⚡',
            player: randomFastest.name,
            description: 'Lightning-fast responses'
        });

        // Most Consistent (highest average per category)
        const consistency = players.map(p => {
            const answers = Object.values(p.answers).filter(a => a && a.length > 0);
            return { player: p, avgScore: answers.length > 0 ? p.score / answers.length : 0 };
        });
        const mostConsistent = consistency.sort((a, b) => b.avgScore - a.avgScore)[0];
        if (mostConsistent && mostConsistent.avgScore > 0) {
            awards.push({
                title: 'Most Consistent',
                emoji: '🎯',
                player: mostConsistent.player.name,
                description: 'Steady and reliable'
            });
        }

        // Chaotic Genius (random fun award)
        const chaotic = players[Math.floor(Math.random() * players.length)];
        awards.push({
            title: 'Chaotic Genius',
            emoji: '🌪️',
            player: chaotic.name,
            description: 'Unpredictable brilliance'
        });

        return awards;
    };

    const awards = calculateAwards();

    useEffect(() => {
        // Confetti animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(confettiAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(confettiAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const confettiTranslateY = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, Dimensions.get('window').height + 50],
    });

    return (
        <LinearGradient
            colors={['#48dbfb', '#0abde3', '#48dbfb']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {/* Confetti */}
            {[...Array(20)].map((_, i) => (
                <Animated.View
                    key={i}
                    style={[
                        styles.confetti,
                        {
                            left: `${(i * 5) % 100}%`,
                            transform: [{ translateY: confettiTranslateY }],
                            opacity: confettiAnim,
                        },
                    ]}
                >
                    <Text style={styles.confettiText}>
                        {['🎉', '🎊', '⭐', '✨', '🏆'][i % 5]}
                    </Text>
                </Animated.View>
            ))}

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    {/* Game Over Title */}
                    <Text style={styles.gameOverText}>GAME OVER!</Text>

                    {/* Winner Section */}
                    <View style={styles.winnerSection}>
                        <Text style={styles.winnerEmoji}>🏆</Text>
                        <Text style={styles.winnerLabel}>WINNER</Text>
                        <View style={styles.winnerCard}>
                            <LinearGradient
                                colors={['#ffd32a', '#ff9f1a']}
                                style={styles.winnerGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
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
                                    <Text style={styles.playerName}>{player.name}</Text>
                                    <Text style={styles.playerScore}>{player.score}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Awards Section */}
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

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.playAgainButton}
                            onPress={() => router.push('/stop-game-pre-game')}
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
        marginBottom: 30,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 6,
        letterSpacing: 2,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    winnerSection: {
        alignItems: 'center',
        marginBottom: 40,
        width: '100%',
    },
    winnerEmoji: {
        fontSize: 80,
        marginBottom: 10,
    },
    winnerLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        letterSpacing: 3,
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
        padding: 25,
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff',
        borderRadius: 25,
    },
    winnerName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    winnerScore: {
        fontSize: 28,
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
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    scoresCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    rankBadge: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#95a5a6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    playerName: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    playerScore: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0abde3',
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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        width: (width - 56) / 2,
        borderWidth: 3,
        borderColor: '#ffd32a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    awardEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    awardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0abde3',
        marginBottom: 6,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    awardPlayer: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    awardDescription: {
        fontSize: 12,
        color: '#666',
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
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#fff',
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
