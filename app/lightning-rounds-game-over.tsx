import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const AVATAR_IMAGES = [
    require('../assets/images/avatars/avatar1.png'),
    require('../assets/images/avatars/avatar2.png'),
    require('../assets/images/avatars/avatar3.png'),
    require('../assets/images/avatars/avatar4.png'),
    require('../assets/images/avatars/avatar5.png'),
    require('../assets/images/avatars/avatar6.png'),
];

interface Player {
    id: number;
    name: string;
    avatarIndex: number;
    strikes: number;
    isEliminated: boolean;
}

export default function LightningRoundsGameOver() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const players: Player[] = JSON.parse(params.players as string || '[]');
    const rounds = parseInt(params.rounds as string || '0');

    const winner = players.find(p => !p.isEliminated) || players[0];
    const sortedPlayers = [...players].sort((a, b) => a.strikes - b.strikes);

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const confettiAnims = useRef([...Array(15)].map(() => ({
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(-50),
        rotate: new Animated.Value(0),
    }))).current;

    useEffect(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Winner animation
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 5,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Rotate trophy
        Animated.loop(
            Animated.sequence([
                Animated.timing(rotateAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
                Animated.timing(rotateAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ])
        ).start();

        // Confetti animation
        confettiAnims.forEach((anim, i) => {
            const delay = i * 100;
            Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.delay(delay),
                        Animated.timing(anim.y, {
                            toValue: 800,
                            duration: 3000 + Math.random() * 2000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(anim.y, {
                            toValue: -50,
                            duration: 0,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.timing(anim.rotate, {
                        toValue: 10,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });
    }, []);

    const trophySpin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['-5deg', '5deg'],
    });

    return (
        <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.container}>
            {/* Confetti */}
            {confettiAnims.map((anim, i) => (
                <Animated.View
                    key={i}
                    style={[
                        styles.confetti,
                        {
                            left: Math.random() * width,
                            transform: [
                                { translateY: anim.y },
                                {
                                    rotate: anim.rotate.interpolate({
                                        inputRange: [0, 10],
                                        outputRange: ['0deg', '360deg'],
                                    })
                                },
                            ],
                            backgroundColor: ['#f9c74f', '#f8961e', '#f3722c', '#e74c3c', '#2ecc71', '#3498db'][i % 6],
                        }
                    ]}
                />
            ))}

            <SafeAreaView style={styles.safeArea}>
                {/* Title */}
                <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.gameOverText}>GAME OVER!</Text>
                </Animated.View>

                {/* Winner Section */}
                <Animated.View style={[styles.winnerSection, { transform: [{ scale: scaleAnim }] }]}>
                    <Animated.Text style={[styles.trophyEmoji, { transform: [{ rotate: trophySpin }] }]}>
                        🏆
                    </Animated.Text>

                    <View style={styles.winnerCard}>
                        <LinearGradient
                            colors={['#f9c74f', '#f8961e']}
                            style={styles.winnerGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.winnerLabel}>⚡ CHAMPION ⚡</Text>
                            <Image
                                source={AVATAR_IMAGES[winner?.avatarIndex % AVATAR_IMAGES.length]}
                                style={styles.winnerAvatar}
                            />
                            <Text style={styles.winnerName}>{winner?.name}</Text>
                            <Text style={styles.winnerStats}>
                                Survived {rounds} rounds with only {winner?.strikes} strike{winner?.strikes !== 1 ? 's' : ''}!
                            </Text>
                        </LinearGradient>
                    </View>
                </Animated.View>

                {/* Final Standings */}
                <Animated.View style={[styles.standingsSection, { opacity: fadeAnim }]}>
                    <Text style={styles.standingsTitle}>FINAL STANDINGS</Text>

                    <View style={styles.standingsList}>
                        {sortedPlayers.map((player, index) => (
                            <View key={player.id} style={[styles.standingRow, player.id === winner?.id && styles.standingRowWinner]}>
                                <Text style={styles.standingRank}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                </Text>
                                <Image
                                    source={AVATAR_IMAGES[player.avatarIndex % AVATAR_IMAGES.length]}
                                    style={styles.standingAvatar}
                                />
                                <Text style={styles.standingName}>{player.name}</Text>
                                <View style={styles.standingStrikes}>
                                    {[0, 1, 2].map(i => (
                                        <View
                                            key={i}
                                            style={[
                                                styles.strikeCircle,
                                                i < player.strikes && styles.strikeCircleActive
                                            ]}
                                        />
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.playAgainButton}
                        onPress={() => router.push('/lightning-rounds-pre-game')}
                    >
                        <LinearGradient colors={['#2ecc71', '#27ae60']} style={styles.buttonGradient}>
                            <Ionicons name="refresh" size={24} color="#fff" />
                            <Text style={styles.buttonText}>PLAY AGAIN</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() => router.push('/')}
                    >
                        <Ionicons name="home" size={24} color="#fff" />
                        <Text style={styles.homeButtonText}>HOME</Text>
                    </TouchableOpacity>
                </View>
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
        paddingHorizontal: 20,
    },
    confetti: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 3,
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    gameOverText: {
        fontSize: 36,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 4,
        textShadowColor: 'rgba(249, 199, 79, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    winnerSection: {
        alignItems: 'center',
        marginTop: 20,
    },
    trophyEmoji: {
        fontSize: 70,
        marginBottom: 15,
    },
    winnerCard: {
        width: '100%',
        borderRadius: 25,
        overflow: 'hidden',
        shadowColor: '#f9c74f',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 25,
        elevation: 15,
    },
    winnerGradient: {
        padding: 25,
        alignItems: 'center',
    },
    winnerLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 3,
        marginBottom: 15,
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
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 2,
        marginBottom: 8,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    winnerStats: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
    standingsSection: {
        flex: 1,
        marginTop: 25,
    },
    standingsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f9c74f',
        textAlign: 'center',
        letterSpacing: 3,
        marginBottom: 15,
    },
    standingsList: {
        gap: 10,
    },
    standingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    standingRowWinner: {
        borderColor: '#f9c74f',
        backgroundColor: 'rgba(249, 199, 79, 0.15)',
    },
    standingRank: {
        fontSize: 24,
        width: 40,
    },
    standingAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#f9c74f',
    },
    standingName: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    standingStrikes: {
        flexDirection: 'row',
        gap: 5,
    },
    strikeCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    strikeCircleActive: {
        backgroundColor: '#e74c3c',
        borderColor: '#c0392b',
    },
    buttonsContainer: {
        gap: 12,
        marginBottom: 20,
    },
    playAgainButton: {
        borderRadius: 25,
        overflow: 'hidden',
    },
    buttonGradient: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        gap: 12,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
    },
    homeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 18,
        borderRadius: 25,
        gap: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    homeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
    },
});
