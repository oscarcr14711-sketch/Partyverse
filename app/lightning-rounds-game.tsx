import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const AVATAR_IMAGES = [
    require('../assets/images/avatars/avatar1.png'),
    require('../assets/images/avatars/avatar2.png'),
    require('../assets/images/avatars/avatar3.png'),
    require('../assets/images/avatars/avatar4.png'),
    require('../assets/images/avatars/avatar5.png'),
    require('../assets/images/avatars/avatar6.png'),
];

const CHALLENGES = [
    { text: 'TOUCH YOUR NOSE!', emoji: '👃', time: 3 },
    { text: 'CLAP 5 TIMES!', emoji: '👏', time: 4 },
    { text: 'JUMP 3 TIMES!', emoji: '🦘', time: 5 },
    { text: 'SPIN AROUND!', emoji: '🔄', time: 5 },
    { text: 'HANDS ON HEAD!', emoji: '🙆', time: 3 },
    { text: 'TOUCH THE FLOOR!', emoji: '🦵', time: 4 },
    { text: 'HIGH FIVE SOMEONE!', emoji: '🖐️', time: 5 },
    { text: 'DO A SQUAT!', emoji: '🏋️', time: 4 },
    { text: 'WAVE BOTH HANDS!', emoji: '👋', time: 3 },
    { text: 'STAND ON ONE FOOT!', emoji: '🦶', time: 4 },
    { text: 'MAKE A FUNNY FACE!', emoji: '🤪', time: 3 },
    { text: 'AIR GUITAR!', emoji: '🎸', time: 4 },
    { text: 'STRIKE A POSE!', emoji: '💃', time: 3 },
    { text: 'DO 5 JUMPING JACKS!', emoji: '⭐', time: 6 },
    { text: 'THUMBS UP!', emoji: '👍', time: 2 },
    { text: 'TOUCH YOUR TOES!', emoji: '🦶', time: 4 },
    { text: 'SHAKE YOUR HIPS!', emoji: '💃', time: 4 },
    { text: 'APPLAUD LOUDLY!', emoji: '👐', time: 3 },
    { text: 'RAISE BOTH ARMS!', emoji: '🙌', time: 3 },
    { text: 'SIT DOWN CROSS-LEGGED!', emoji: '🧘', time: 5 },
];

interface Player {
    id: number;
    name: string;
    avatarIndex: number;
    strikes: number;
    isEliminated: boolean;
}

type GamePhase = 'countdown' | 'challenge' | 'select-loser' | 'strike-given' | 'elimination';

export default function LightningRoundsGame() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const initialPlayers: Player[] = JSON.parse(params.players as string || '[]').map((p: any) => ({
        ...p,
        strikes: 0,
        isEliminated: false,
    }));

    const [players, setPlayers] = useState<Player[]>(initialPlayers);
    const [gamePhase, setGamePhase] = useState<GamePhase>('countdown');
    const [currentChallenge, setCurrentChallenge] = useState(CHALLENGES[0]);
    const [countdownValue, setCountdownValue] = useState(3);
    const [roundNumber, setRoundNumber] = useState(1);
    const [lastLoser, setLastLoser] = useState<Player | null>(null);
    const [usedChallenges, setUsedChallenges] = useState<number[]>([]);

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const activePlayers = players.filter(p => !p.isEliminated);

    // Start countdown for new round
    useEffect(() => {
        if (gamePhase === 'countdown') {
            let count = 3;
            setCountdownValue(count);

            const interval = setInterval(() => {
                count--;
                if (count > 0) {
                    setCountdownValue(count);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                } else {
                    clearInterval(interval);
                    showChallenge();
                }
            }, 800);

            return () => clearInterval(interval);
        }
    }, [gamePhase, roundNumber]);

    const showChallenge = () => {
        // Pick a random challenge that hasn't been used recently
        let availableIndices = CHALLENGES.map((_, i) => i).filter(i => !usedChallenges.includes(i));
        if (availableIndices.length === 0) {
            availableIndices = CHALLENGES.map((_, i) => i);
            setUsedChallenges([]);
        }

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        setCurrentChallenge(CHALLENGES[randomIndex]);
        setUsedChallenges(prev => [...prev.slice(-10), randomIndex]);

        setGamePhase('challenge');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

        // Animate challenge appearance
        scaleAnim.setValue(0);
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
        }).start();

        // Start pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.1, duration: 300, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ])
        ).start();
    };

    const handleChallengeComplete = () => {
        pulseAnim.stopAnimation();
        pulseAnim.setValue(1);
        setGamePhase('select-loser');
    };

    const handleSelectLoser = (player: Player) => {
        const updatedPlayers = players.map(p => {
            if (p.id === player.id) {
                const newStrikes = p.strikes + 1;
                return { ...p, strikes: newStrikes, isEliminated: newStrikes >= 3 };
            }
            return p;
        });

        setPlayers(updatedPlayers);
        setLastLoser(player);

        const loserPlayer = updatedPlayers.find(p => p.id === player.id);

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

        // Shake animation
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();

        if (loserPlayer?.isEliminated) {
            setGamePhase('elimination');
        } else {
            setGamePhase('strike-given');
        }
    };

    const handleNextRound = () => {
        const stillPlaying = players.filter(p => !p.isEliminated);

        if (stillPlaying.length <= 1) {
            // Game over - we have a winner
            router.replace({
                pathname: '/lightning-rounds-game-over',
                params: { players: JSON.stringify(players), rounds: roundNumber }
            });
        } else {
            setRoundNumber(prev => prev + 1);
            setGamePhase('countdown');
            setLastLoser(null);
        }
    };

    const renderCountdown = () => (
        <View style={styles.centerContainer}>
            <Text style={styles.getReadyText}>GET READY!</Text>
            <Animated.Text style={[styles.countdownNumber, { transform: [{ scale: pulseAnim }] }]}>
                {countdownValue}
            </Animated.Text>
            <Text style={styles.roundText}>Round {roundNumber}</Text>
        </View>
    );

    const renderChallenge = () => (
        <View style={styles.challengeContainer}>
            <Animated.View style={[styles.challengeCard, { transform: [{ scale: scaleAnim }] }]}>
                <LinearGradient
                    colors={['#f9c74f', '#f8961e', '#f3722c']}
                    style={styles.challengeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Animated.Text style={[styles.challengeEmoji, { transform: [{ scale: pulseAnim }] }]}>
                        {currentChallenge.emoji}
                    </Animated.Text>
                    <Text style={styles.challengeText}>{currentChallenge.text}</Text>
                </LinearGradient>
            </Animated.View>

            <TouchableOpacity style={styles.doneButton} onPress={handleChallengeComplete}>
                <LinearGradient colors={['#2ecc71', '#27ae60']} style={styles.doneButtonGradient}>
                    <Text style={styles.doneButtonText}>SOMEONE IS LAST!</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const renderSelectLoser = () => (
        <View style={styles.selectLoserContainer}>
            <Text style={styles.selectTitle}>WHO WAS LAST?</Text>
            <Text style={styles.selectSubtitle}>Tap the slowest player</Text>

            <View style={styles.playersGrid}>
                {activePlayers.map(player => (
                    <TouchableOpacity
                        key={player.id}
                        style={styles.playerCard}
                        onPress={() => handleSelectLoser(player)}
                    >
                        <Image
                            source={AVATAR_IMAGES[player.avatarIndex % AVATAR_IMAGES.length]}
                            style={styles.playerAvatar}
                        />
                        <Text style={styles.playerCardName}>{player.name}</Text>
                        <View style={styles.strikesRow}>
                            {[0, 1, 2].map(i => (
                                <View
                                    key={i}
                                    style={[
                                        styles.strikeIndicator,
                                        i < player.strikes && styles.strikeActive
                                    ]}
                                />
                            ))}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderStrikeGiven = () => (
        <Animated.View style={[styles.strikeContainer, { transform: [{ translateX: shakeAnim }] }]}>
            <Text style={styles.strikeEmoji}>⚠️</Text>
            <Text style={styles.strikeName}>{lastLoser?.name}</Text>
            <Text style={styles.strikeText}>GETS A STRIKE!</Text>

            <View style={styles.strikeDotsLarge}>
                {[0, 1, 2].map(i => (
                    <View
                        key={i}
                        style={[
                            styles.strikeDotLarge,
                            i < (players.find(p => p.id === lastLoser?.id)?.strikes || 0) && styles.strikeDotActive
                        ]}
                    >
                        <Text style={styles.strikeDotText}>{i < (players.find(p => p.id === lastLoser?.id)?.strikes || 0) ? '✗' : ''}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleNextRound}>
                <Text style={styles.nextButtonText}>NEXT ROUND ⚡</Text>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderElimination = () => (
        <View style={styles.eliminationContainer}>
            <Text style={styles.eliminationEmoji}>💀</Text>
            <Text style={styles.eliminationName}>{lastLoser?.name}</Text>
            <Text style={styles.eliminationText}>IS ELIMINATED!</Text>

            <Text style={styles.remainingText}>
                {activePlayers.length - 1} player{activePlayers.length - 1 !== 1 ? 's' : ''} remaining
            </Text>

            <TouchableOpacity style={styles.nextButton} onPress={handleNextRound}>
                <Text style={styles.nextButtonText}>
                    {activePlayers.length <= 2 ? 'SEE WINNER 🏆' : 'CONTINUE ⚡'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <LinearGradient colors={['#0f0f23', '#1a1a2e', '#16213e']} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.roundBadge}>
                    <Text style={styles.roundBadgeText}>Round {roundNumber}</Text>
                </View>
                <View style={styles.playerCountBadge}>
                    <Text style={styles.playerCountText}>{activePlayers.length} left</Text>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {gamePhase === 'countdown' && renderCountdown()}
                {gamePhase === 'challenge' && renderChallenge()}
                {gamePhase === 'select-loser' && renderSelectLoser()}
                {gamePhase === 'strike-given' && renderStrikeGiven()}
                {gamePhase === 'elimination' && renderElimination()}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    roundBadge: {
        backgroundColor: 'rgba(249, 199, 79, 0.3)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#f9c74f',
    },
    roundBadgeText: {
        color: '#f9c74f',
        fontSize: 16,
        fontWeight: 'bold',
    },
    playerCountBadge: {
        backgroundColor: 'rgba(46, 204, 113, 0.3)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#2ecc71',
    },
    playerCountText: {
        color: '#2ecc71',
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    centerContainer: {
        alignItems: 'center',
    },
    getReadyText: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
        letterSpacing: 3,
    },
    countdownNumber: {
        fontSize: 150,
        fontWeight: '900',
        color: '#f9c74f',
        textShadowColor: 'rgba(249, 199, 79, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 30,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    roundText: {
        fontSize: 20,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 10,
    },
    challengeContainer: {
        alignItems: 'center',
        width: '100%',
    },
    challengeCard: {
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#f9c74f',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 20,
    },
    challengeGradient: {
        padding: 40,
        alignItems: 'center',
    },
    challengeEmoji: {
        fontSize: 100,
        marginBottom: 20,
    },
    challengeText: {
        fontSize: 36,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    doneButton: {
        marginTop: 30,
        width: '100%',
        borderRadius: 25,
        overflow: 'hidden',
    },
    doneButtonGradient: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    doneButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
    },
    selectLoserContainer: {
        alignItems: 'center',
        width: '100%',
    },
    selectTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 5,
        letterSpacing: 2,
    },
    selectSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 30,
    },
    playersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
    },
    playerCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        width: (width - 70) / 2,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    playerAvatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: '#f9c74f',
        marginBottom: 10,
    },
    playerCardName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    strikesRow: {
        flexDirection: 'row',
        gap: 8,
    },
    strikeIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    strikeActive: {
        backgroundColor: '#e74c3c',
        borderColor: '#c0392b',
    },
    strikeContainer: {
        alignItems: 'center',
    },
    strikeEmoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    strikeName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    strikeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#e74c3c',
        letterSpacing: 2,
    },
    strikeDotsLarge: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 30,
        marginBottom: 40,
    },
    strikeDotLarge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    strikeDotActive: {
        backgroundColor: '#e74c3c',
        borderColor: '#c0392b',
    },
    strikeDotText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
    },
    nextButton: {
        backgroundColor: '#f9c74f',
        paddingHorizontal: 40,
        paddingVertical: 18,
        borderRadius: 25,
    },
    nextButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a2e',
        letterSpacing: 2,
    },
    eliminationContainer: {
        alignItems: 'center',
    },
    eliminationEmoji: {
        fontSize: 100,
        marginBottom: 20,
    },
    eliminationName: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    eliminationText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#e74c3c',
        letterSpacing: 3,
        marginBottom: 20,
    },
    remainingText: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 40,
    },
});
