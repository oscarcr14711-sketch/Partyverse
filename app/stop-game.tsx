import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View } from 'react-native';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const WRITING_TIME = 10; // seconds per player

type GamePhase = 'letter-spin' | 'writing' | 'review' | 'round-end';

interface PlayerAnswers {
    [category: string]: string;
}

interface Player {
    id: number;
    name: string;
    answers: PlayerAnswers;
    score: number;
    funnyVotes: number;
}

export default function StopGame() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const numPlayers = parseInt(params.numPlayers as string) || 2;
    const numRounds = parseInt(params.numRounds as string) || 3;
    const gameMode = (params.gameMode as 'pass-phone' | 'team') || 'pass-phone';
    const categories = JSON.parse(params.categories as string || '[]');

    const [currentRound, setCurrentRound] = useState(1);
    const [currentPhase, setCurrentPhase] = useState<GamePhase>('letter-spin');
    const [currentLetter, setCurrentLetter] = useState('');
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(WRITING_TIME);
    const [players, setPlayers] = useState<Player[]>(() =>
        Array.from({ length: numPlayers }, (_, i) => ({
            id: i,
            name: gameMode === 'team' ? `Team ${i + 1}` : `Player ${i + 1}`,
            answers: {},
            score: 0,
            funnyVotes: 0,
        }))
    );
    const [currentAnswers, setCurrentAnswers] = useState<PlayerAnswers>({});
    const [reviewPlayerIndex, setReviewPlayerIndex] = useState(0);
    const [funnyVotes, setFunnyVotes] = useState<Set<number>>(new Set());

    const spinAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Letter wheel spin animation
    const spinWheel = () => {
        spinAnim.setValue(0);
        Animated.timing(spinAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start(() => {
            const randomLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
            setCurrentLetter(randomLetter);
            setTimeout(() => {
                setCurrentPhase('writing');
                setTimeLeft(WRITING_TIME);
            }, 1000);
        });
    };

    // Timer countdown
    useEffect(() => {
        if (currentPhase === 'writing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (currentPhase === 'writing' && timeLeft === 0) {
            handleTimeUp();
        }
    }, [timeLeft, currentPhase]);

    // Pulse animation for timer
    useEffect(() => {
        if (currentPhase === 'writing' && timeLeft <= 3 && timeLeft > 0) {
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start();
        }
    }, [timeLeft, currentPhase]);

    const handleTimeUp = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Vibration.vibrate(500);

        // Save current player's answers
        const updatedPlayers = [...players];
        updatedPlayers[currentPlayerIndex].answers = { ...currentAnswers };
        setPlayers(updatedPlayers);

        // Move to next player or review phase
        if (currentPlayerIndex < numPlayers - 1) {
            setCurrentPlayerIndex(currentPlayerIndex + 1);
            setCurrentAnswers({});
            setTimeLeft(WRITING_TIME);
        } else {
            setCurrentPhase('review');
            setReviewPlayerIndex(0);
        }
    };

    const handleAnswerChange = (category: string, value: string) => {
        setCurrentAnswers({ ...currentAnswers, [category]: value });
    };

    const handleNextReview = () => {
        if (reviewPlayerIndex < numPlayers - 1) {
            setReviewPlayerIndex(reviewPlayerIndex + 1);
            setFunnyVotes(new Set());
        } else {
            // Calculate scores for this round
            calculateScores();
            setCurrentPhase('round-end');
        }
    };

    const toggleFunnyVote = (playerId: number) => {
        const newVotes = new Set(funnyVotes);
        if (newVotes.has(playerId)) {
            newVotes.delete(playerId);
        } else {
            newVotes.add(playerId);
        }
        setFunnyVotes(newVotes);
    };

    const calculateScores = () => {
        const updatedPlayers = [...players];
        const allAnswers: { [category: string]: string[] } = {};

        // Collect all answers by category
        categories.forEach((cat: string) => {
            allAnswers[cat] = updatedPlayers.map(p => p.answers[cat]?.toLowerCase().trim() || '');
        });

        // Score each player
        updatedPlayers.forEach((player, playerIndex) => {
            let roundScore = 0;

            categories.forEach((cat: string) => {
                const answer = player.answers[cat]?.trim() || '';

                if (!answer) {
                    // Empty: 0 points
                    return;
                }

                if (!answer.toLowerCase().startsWith(currentLetter.toLowerCase())) {
                    // Doesn't start with letter: 0 points
                    return;
                }

                // Check if answer is unique
                const answerLower = answer.toLowerCase();
                const occurrences = allAnswers[cat].filter(a => a === answerLower).length;

                if (occurrences === 1) {
                    // Unique: 10 points
                    roundScore += 10;
                } else {
                    // Repeated: 5 points
                    roundScore += 5;
                }
            });

            // Funny bonus
            if (funnyVotes.has(playerIndex) && funnyVotes.size >= Math.ceil(numPlayers / 2)) {
                roundScore += 3;
            }

            player.score += roundScore;
        });

        setPlayers(updatedPlayers);
    };

    const handleNextRound = () => {
        if (currentRound < numRounds) {
            setCurrentRound(currentRound + 1);
            setCurrentPhase('letter-spin');
            setCurrentPlayerIndex(0);
            setReviewPlayerIndex(0);
            setCurrentAnswers({});
            setFunnyVotes(new Set());
            // Reset answers for new round
            const resetPlayers = players.map(p => ({ ...p, answers: {} }));
            setPlayers(resetPlayers);
        } else {
            // Game over
            router.push({
                pathname: '/stop-game-over',
                params: {
                    players: JSON.stringify(players),
                    gameMode,
                }
            });
        }
    };

    const handleStopGame = () => {
        router.push('/stop-game-pre-game');
    };

    // Render different phases
    const renderLetterSpin = () => {
        const spin = spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '1080deg'],
        });

        return (
            <View style={styles.phaseContainer}>
                <Text style={styles.phaseTitle}>Round {currentRound}</Text>
                <Text style={styles.phaseSubtitle}>Spinning the Letter Wheel...</Text>

                <Animated.View style={[styles.letterWheel, { transform: [{ rotate: spin }] }]}>
                    <LinearGradient
                        colors={['#ffd32a', '#ff9f1a', '#ffd32a']}
                        style={styles.wheelGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.wheelLetter}>
                            {currentLetter || LETTERS[Math.floor(Math.random() * LETTERS.length)]}
                        </Text>
                    </LinearGradient>
                </Animated.View>

                {currentLetter && (
                    <View style={styles.selectedLetterContainer}>
                        <Text style={styles.selectedLetterLabel}>Letter of the Round:</Text>
                        <Text style={styles.selectedLetter}>{currentLetter}</Text>
                    </View>
                )}

                {!currentLetter && (
                    <TouchableOpacity style={styles.spinButton} onPress={spinWheel}>
                        <Text style={styles.spinButtonText}>SPIN!</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderWriting = () => {
        const currentPlayer = players[currentPlayerIndex];

        return (
            <View style={styles.phaseContainer}>
                <View style={styles.writingHeader}>
                    <View style={styles.playerBadge}>
                        <Text style={styles.playerBadgeText}>{currentPlayer.name}</Text>
                    </View>
                    <View style={styles.letterBadge}>
                        <Text style={styles.letterBadgeText}>Letter: {currentLetter}</Text>
                    </View>
                </View>

                <Animated.View style={[styles.timerContainer, { transform: [{ scale: pulseAnim }] }]}>
                    <Text style={[
                        styles.timerText,
                        timeLeft <= 3 && styles.timerTextUrgent
                    ]}>
                        {timeLeft}s
                    </Text>
                </Animated.View>

                <ScrollView style={styles.categoriesScroll} contentContainerStyle={styles.categoriesContent}>
                    {categories.map((category: string, index: number) => (
                        <View key={index} style={styles.categoryInput}>
                            <Text style={styles.categoryLabel}>{category}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={`Word starting with ${currentLetter}...`}
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                value={currentAnswers[category] || ''}
                                onChangeText={(text) => handleAnswerChange(category, text)}
                                autoCapitalize="words"
                            />
                        </View>
                    ))}
                </ScrollView>

                <TouchableOpacity style={styles.submitButton} onPress={handleTimeUp}>
                    <Text style={styles.submitButtonText}>Submit Early</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderReview = () => {
        const reviewPlayer = players[reviewPlayerIndex];

        return (
            <View style={styles.phaseContainer}>
                <Text style={styles.phaseTitle}>Review Answers</Text>
                <View style={styles.reviewHeader}>
                    <Text style={styles.reviewPlayerName}>{reviewPlayer.name}</Text>
                    <Text style={styles.reviewLetterBadge}>Letter: {currentLetter}</Text>
                </View>

                <ScrollView style={styles.reviewScroll} contentContainerStyle={styles.reviewContent}>
                    {categories.map((category: string, index: number) => {
                        const answer = reviewPlayer.answers[category] || '';
                        const isValid = answer && answer.toLowerCase().startsWith(currentLetter.toLowerCase());

                        return (
                            <View key={index} style={styles.reviewItem}>
                                <Text style={styles.reviewCategory}>{category}</Text>
                                <View style={[
                                    styles.reviewAnswerBox,
                                    !answer && styles.reviewAnswerEmpty,
                                    answer && !isValid && styles.reviewAnswerInvalid,
                                    answer && isValid && styles.reviewAnswerValid,
                                ]}>
                                    <Text style={styles.reviewAnswer}>
                                        {answer || '(No answer)'}
                                    </Text>
                                    {!answer && <Text style={styles.reviewPoints}>0 pts</Text>}
                                    {answer && !isValid && <Text style={styles.reviewPoints}>0 pts ❌</Text>}
                                    {answer && isValid && <Text style={styles.reviewPoints}>✓</Text>}
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>

                <TouchableOpacity
                    style={[
                        styles.funnyButton,
                        funnyVotes.has(reviewPlayerIndex) && styles.funnyButtonActive
                    ]}
                    onPress={() => toggleFunnyVote(reviewPlayerIndex)}
                >
                    <Text style={styles.funnyButtonText}>
                        {funnyVotes.has(reviewPlayerIndex) ? '😂 Funny! (Voted)' : '😂 Vote Funny (+3 pts)'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.nextButton} onPress={handleNextReview}>
                    <Text style={styles.nextButtonText}>
                        {reviewPlayerIndex < numPlayers - 1 ? 'Next Player' : 'Calculate Scores'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderRoundEnd = () => {
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

        return (
            <View style={styles.phaseContainer}>
                <Text style={styles.phaseTitle}>Round {currentRound} Complete!</Text>

                <View style={styles.scoresContainer}>
                    {sortedPlayers.map((player, index) => (
                        <View key={player.id} style={styles.scoreRow}>
                            <View style={styles.scoreRank}>
                                <Text style={styles.scoreRankText}>#{index + 1}</Text>
                            </View>
                            <Text style={styles.scorePlayerName}>{player.name}</Text>
                            <Text style={styles.scorePoints}>{player.score} pts</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.continueButton} onPress={handleNextRound}>
                    <LinearGradient
                        colors={['#1ABC9C', '#16A085']}
                        style={styles.continueButtonGradient}
                    >
                        <Text style={styles.continueButtonText}>
                            {currentRound < numRounds ? 'Next Round' : 'View Final Results'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <LinearGradient
            colors={['#48dbfb', '#0abde3', '#48dbfb']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={handleStopGame} style={styles.stopButton}>
                    <Ionicons name="stop-circle" size={28} color="#fff" />
                    <Text style={styles.stopButtonText}>Stop Game</Text>
                </TouchableOpacity>
                <Text style={styles.roundIndicator}>Round {currentRound}/{numRounds}</Text>
            </View>

            {currentPhase === 'letter-spin' && renderLetterSpin()}
            {currentPhase === 'writing' && renderWriting()}
            {currentPhase === 'review' && renderReview()}
            {currentPhase === 'round-end' && renderRoundEnd()}
        </LinearGradient>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
    },
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(231, 76, 60, 0.9)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        gap: 8,
    },
    stopButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    roundIndicator: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    phaseContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    phaseTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    phaseSubtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 30,
    },
    letterWheel: {
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
        marginVertical: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 12,
    },
    wheelGradient: {
        flex: 1,
        borderRadius: width * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 8,
        borderColor: '#fff',
    },
    wheelLetter: {
        fontSize: 120,
        fontWeight: 'bold',
        color: '#fff',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    selectedLetterContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    selectedLetterLabel: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 8,
    },
    selectedLetter: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#ffd32a',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    spinButton: {
        backgroundColor: '#ffd32a',
        paddingHorizontal: 60,
        paddingVertical: 18,
        borderRadius: 30,
        marginTop: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    },
    spinButtonText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    writingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        gap: 10,
    },
    playerBadge: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    playerBadgeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0abde3',
    },
    letterBadge: {
        backgroundColor: '#ffd32a',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    letterBadgeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    timerContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 5,
        borderColor: '#ffd32a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    timerText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#0abde3',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    timerTextUrgent: {
        color: '#e74c3c',
    },
    categoriesScroll: {
        flex: 1,
        width: '100%',
    },
    categoriesContent: {
        paddingBottom: 20,
    },
    categoryInput: {
        marginBottom: 16,
    },
    categoryLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
        borderWidth: 2,
        borderColor: '#ffd32a',
    },
    submitButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#fff',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewHeader: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    reviewPlayerName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    reviewLetterBadge: {
        backgroundColor: '#ffd32a',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    reviewScroll: {
        flex: 1,
        width: '100%',
    },
    reviewContent: {
        paddingBottom: 20,
    },
    reviewItem: {
        marginBottom: 16,
    },
    reviewCategory: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    reviewAnswerBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 3,
    },
    reviewAnswerEmpty: {
        borderColor: '#95a5a6',
        backgroundColor: 'rgba(149, 165, 166, 0.2)',
    },
    reviewAnswerInvalid: {
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
    },
    reviewAnswerValid: {
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
    },
    reviewAnswer: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    reviewPoints: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    funnyButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 30,
        paddingVertical: 14,
        borderRadius: 25,
        marginTop: 15,
        borderWidth: 2,
        borderColor: '#fff',
        width: '100%',
        alignItems: 'center',
    },
    funnyButtonActive: {
        backgroundColor: '#ffd32a',
        borderColor: '#ffd32a',
    },
    funnyButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    nextButton: {
        backgroundColor: '#2ecc71',
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 30,
        marginTop: 15,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    nextButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    scoresContainer: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
        padding: 20,
        marginVertical: 30,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    scoreRank: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffd32a',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    scoreRankText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    scorePlayerName: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    scorePoints: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0abde3',
    },
    continueButton: {
        borderRadius: 30,
        overflow: 'hidden',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    },
    continueButtonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    continueButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
});
