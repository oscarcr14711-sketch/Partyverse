import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Player {
    id: number;
    name: string;
    avatarIndex: number;
    strikes: number;
    caughtInRounds: number[];
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

export default function DontLetItPicYouGameOver() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const players: Player[] = JSON.parse(params.players as string || '[]');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // Sort players by strikes (fewest wins)
    const sortedPlayers = [...players].sort((a, b) => a.strikes - b.strikes);
    const winner = sortedPlayers[0] || { name: 'No Winner', strikes: 0, avatarIndex: 0, id: 0, caughtInRounds: [] };

    // Calculate awards
    const calculateAwards = (): Award[] => {
        const awards: Award[] = [];

        // Ninja Master (never caught)
        const ninjaMaster = players.find(p => p.strikes === 0);
        if (ninjaMaster) {
            awards.push({
                title: 'Ninja Master',
                emoji: '🥷',
                player: ninjaMaster.name,
                description: 'Never got caught!',
            });
        }

        // Camera Magnet (caught every round)
        const totalRounds = Math.max(...players.map(p => p.caughtInRounds.length || 0));
        const cameraMagnet = players.find(p => p.caughtInRounds.length === totalRounds && totalRounds > 0);
        if (cameraMagnet) {
            awards.push({
                title: 'Camera Magnet',
                emoji: '📸',
                player: cameraMagnet.name,
                description: 'Caught every round!',
            });
        }

        // Best Hider (fewest catches, but not zero)
        const bestHider = sortedPlayers.find(p => p.strikes > 0);
        if (bestHider && bestHider.strikes < sortedPlayers[sortedPlayers.length - 1].strikes) {
            awards.push({
                title: 'Best Hider',
                emoji: '🙈',
                player: bestHider.name,
                description: 'Master of stealth',
            });
        }

        // Funniest Capture (random for now - could be voted in future)
        if (players.length > 0) {
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            awards.push({
                title: 'Funniest Capture',
                emoji: '😂',
                player: randomPlayer.name,
                description: 'Most hilarious photo',
            });
        }

        return awards;
    };

    const awards = calculateAwards();

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    {/* Game Over Title */}
                    <Text style={styles.gameOverText}>GAME OVER!</Text>
                    <Text style={styles.subtitle}>📸 Don't Let It PIC You</Text>

                    {/* Winner Section */}
                    <View style={styles.winnerSection}>
                        <Text style={styles.winnerLabel}>🏆 WINNER 🏆</Text>
                        <View style={styles.winnerCard}>
                            <LinearGradient
                                colors={['#ffd32a', '#ff9f1a']}
                                style={styles.winnerGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Image
                                    source={AVATAR_IMAGES[winner.avatarIndex % AVATAR_IMAGES.length]}
                                    style={styles.winnerAvatar}
                                />
                                <Text style={styles.winnerName}>{winner.name}</Text>
                                <Text style={styles.winnerScore}>
                                    {winner.strikes === 0 ? 'PERFECT!' : `${winner.strikes} Strike${winner.strikes > 1 ? 's' : ''}`}
                                </Text>
                            </LinearGradient>
                        </View>
                    </View>

                    {/* Final Scores */}
                    <View style={styles.scoresSection}>
                        <Text style={styles.sectionTitle}>Final Scores</Text>
                        <Text style={styles.sectionSubtitle}>(Fewest strikes wins!)</Text>
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
                                    <Text style={styles.playerName}>{player.name}</Text>
                                    <View style={styles.strikesContainer}>
                                        <Text style={styles.playerStrikes}>{player.strikes}</Text>
                                        <Ionicons name="close-circle" size={20} color="#e74c3c" />
                                    </View>
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
                            onPress={() => router.push('/dont-let-it-pic-you-pre-game')}
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
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 6,
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
        marginBottom: 5,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    sectionSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 15,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    scoresCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
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
    playerName: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    strikesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    playerStrikes: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e74c3c',
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
        letterSpacing: 1,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
});
