import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ImageBackground, Platform, Image as RNImage, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRandomPhrase, Phrase } from '../data/phrases';

const { width, height } = Dimensions.get('window');
const TOTAL_ROUNDS = 5;
const ROUND_TIME = 60; // 60 seconds per turn
const MAX_WRONG_PER_TURN = 3; // 3 wrong guesses before switching players

const AVATAR_IMAGES = [
    require('../assets/images/avatars/avatar1.png'),
    require('../assets/images/avatars/avatar2.png'),
    require('../assets/images/avatars/avatar3.png'),
    require('../assets/images/avatars/avatar4.png'),
    require('../assets/images/avatars/avatar5.png'),
    require('../assets/images/avatars/avatar6.png'),
];

interface Player {
    id: string;
    name: string;
    color: string;
    avatarIndex: number;
    score: number;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function PhraseMasterGame() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [players, setPlayers] = useState<Player[]>(() =>
        JSON.parse((params.players as string) || '[]').map((p: any) => ({
            ...p,
            score: 0,
        }))
    );
    const category = params.category as string;

    const [currentRound, setCurrentRound] = useState(1);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [phrase, setPhrase] = useState<Phrase>(() => getRandomPhrase(category));
    const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
    const [wrongGuessesThisTurn, setWrongGuessesThisTurn] = useState(0);
    const [totalWrongGuesses, setTotalWrongGuesses] = useState(0);
    const [roundOver, setRoundOver] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [roundWinner, setRoundWinner] = useState<Player | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(ROUND_TIME);
    const [showClue, setShowClue] = useState(false);
    const [clueUsed, setClueUsed] = useState(false);
    const [showTurnSwitch, setShowTurnSwitch] = useState(false);

    // Animation values
    const timerPulse = useRef(new Animated.Value(1)).current;
    const clueScale = useRef(new Animated.Value(0)).current;
    const switchAnimation = useRef(new Animated.Value(0)).current;

    const currentPlayer = players[currentPlayerIndex];

    // Timer countdown
    useEffect(() => {
        if (roundOver || gameOver || showTurnSwitch) return;

        if (timeRemaining <= 0) {
            handleTimeOut();
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, roundOver, gameOver, showTurnSwitch]);

    // Timer pulse animation when low
    useEffect(() => {
        if (timeRemaining <= 10 && timeRemaining > 0 && !roundOver) {
            Animated.sequence([
                Animated.timing(timerPulse, { toValue: 1.2, duration: 150, useNativeDriver: true }),
                Animated.timing(timerPulse, { toValue: 1, duration: 150, useNativeDriver: true }),
            ]).start();
        }
    }, [timeRemaining]);

    // Check for win condition
    useEffect(() => {
        if (roundOver || gameOver) return;

        const phraseLetters = new Set(phrase.text.replace(/[^A-Z]/g, '').split(''));
        const allLettersGuessed = Array.from(phraseLetters).every(letter =>
            guessedLetters.has(letter)
        );

        if (allLettersGuessed && phraseLetters.size > 0) {
            handleRoundWin();
        }
    }, [guessedLetters]);

    const handleTimeOut = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        // Time ran out for current player - switch to next
        if (players.length > 1) {
            switchToNextPlayer();
        } else {
            // Solo player - round over
            setRoundOver(true);
            setRoundWinner(null);
        }
    };

    const switchToNextPlayer = () => {
        setShowTurnSwitch(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

        Animated.sequence([
            Animated.timing(switchAnimation, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.delay(1500),
            Animated.timing(switchAnimation, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => {
            const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
            setCurrentPlayerIndex(nextPlayerIndex);
            setWrongGuessesThisTurn(0);
            setTimeRemaining(ROUND_TIME); // Reset timer
            setShowTurnSwitch(false);
        });
    };

    const handleRoundWin = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const updatedPlayers = [...players];
        // Bonus points: time left + base points - penalty for clue usage
        const timeBonus = Math.floor(timeRemaining / 2);
        const cluepenalty = clueUsed ? 5 : 0;
        const points = 10 + timeBonus - cluepenalty;
        updatedPlayers[currentPlayerIndex].score += Math.max(points, 5);
        setPlayers(updatedPlayers);
        setRoundWinner(currentPlayer);
        setRoundOver(true);
    };

    const nextRound = () => {
        if (currentRound < TOTAL_ROUNDS) {
            setCurrentRound(currentRound + 1);
            setPhrase(getRandomPhrase(category));
            setGuessedLetters(new Set());
            setWrongGuessesThisTurn(0);
            setTotalWrongGuesses(0);
            setRoundOver(false);
            setRoundWinner(null);
            setTimeRemaining(ROUND_TIME);
            setShowClue(false);
            setClueUsed(false);
            // Next round starts with the player after the current one
            setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        } else {
            setGameOver(true);
        }
    };

    const handleLetterGuess = (letter: string) => {
        if (guessedLetters.has(letter) || roundOver || gameOver || showTurnSwitch) return;

        const newGuessed = new Set(guessedLetters);
        newGuessed.add(letter);
        setGuessedLetters(newGuessed);

        if (phrase.text.includes(letter)) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            // Count occurrences and add points
            const occurrences = phrase.text.split(letter).length - 1;
            const updatedPlayers = [...players];
            updatedPlayers[currentPlayerIndex].score += occurrences;
            setPlayers(updatedPlayers);
            // Reset wrong guesses on correct guess
            setWrongGuessesThisTurn(0);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const newWrongCount = wrongGuessesThisTurn + 1;
            setWrongGuessesThisTurn(newWrongCount);
            setTotalWrongGuesses(prev => prev + 1);

            // Check if player used up their wrong guesses
            if (newWrongCount >= MAX_WRONG_PER_TURN && players.length > 1) {
                switchToNextPlayer();
            }
        }
    };

    const handleShowClue = () => {
        if (clueUsed || roundOver) return;
        setShowClue(true);
        setClueUsed(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        Animated.spring(clueScale, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const renderPhrase = () => {
        const words = phrase.text.split(' ');

        return (
            <View style={styles.boardContainer}>
                <ImageBackground
                    source={require('../assets/images/guess.png')}
                    style={styles.boardImage}
                    resizeMode="contain"
                >
                    <View style={styles.boardContent}>
                        {words.map((word, wordIndex) => (
                            <View key={wordIndex} style={styles.wordRow}>
                                {word.split('').map((char, charIndex) => {
                                    const isLetter = /[A-Z]/.test(char);
                                    const isRevealed = guessedLetters.has(char);

                                    return (
                                        <View
                                            key={`${wordIndex}-${charIndex}`}
                                            style={[
                                                styles.letterTile,
                                                !isLetter && styles.spaceTile,
                                                isRevealed && styles.revealedTile,
                                            ]}
                                        >
                                            {isLetter && (
                                                <Text style={[
                                                    styles.letterText,
                                                    isRevealed && styles.revealedLetterText,
                                                ]}>
                                                    {isRevealed ? char : ''}
                                                </Text>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </ImageBackground>
            </View>
        );
    };

    const renderClueButton = () => {
        if (clueUsed) {
            return (
                <Animated.View style={[styles.clueContainer, { transform: [{ scale: clueScale }] }]}>
                    <Text style={styles.clueLabel}>💡 CLUE:</Text>
                    <Text style={styles.clueText}>{phrase.clue}</Text>
                </Animated.View>
            );
        }

        return (
            <TouchableOpacity style={styles.clueButton} onPress={handleShowClue}>
                <Text style={styles.clueButtonText}>💡 Need a Clue? (-5 pts)</Text>
            </TouchableOpacity>
        );
    };

    const renderWrongGuessIndicator = () => {
        return (
            <View style={styles.wrongGuessIndicator}>
                {Array.from({ length: MAX_WRONG_PER_TURN }).map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.wrongGuessDot,
                            index < wrongGuessesThisTurn && styles.wrongGuessDotFilled
                        ]}
                    />
                ))}
            </View>
        );
    };

    const renderKeyboard = () => {
        return (
            <View style={styles.keyboard}>
                {ALPHABET.map((letter) => {
                    const isGuessed = guessedLetters.has(letter);
                    const isInPhrase = phrase.text.includes(letter);

                    return (
                        <TouchableOpacity
                            key={letter}
                            style={[
                                styles.keyButton,
                                isGuessed && styles.keyButtonUsed,
                                isGuessed && isInPhrase && styles.keyButtonCorrect,
                                isGuessed && !isInPhrase && styles.keyButtonWrong,
                            ]}
                            onPress={() => handleLetterGuess(letter)}
                            disabled={isGuessed || roundOver || gameOver || showTurnSwitch}
                        >
                            <Text style={[
                                styles.keyText,
                                isGuessed && styles.keyTextUsed,
                            ]}>
                                {letter}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Turn switch overlay
    if (showTurnSwitch) {
        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
        const nextPlayer = players[nextPlayerIndex];
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <Animated.View style={[
                        styles.turnSwitchOverlay,
                        { opacity: switchAnimation }
                    ]}>
                        <Text style={styles.turnSwitchTitle}>⏰ TURN SWITCH!</Text>
                        <Text style={styles.turnSwitchText}>
                            {currentPlayer.name} used {MAX_WRONG_PER_TURN} wrong guesses
                        </Text>
                        <View style={styles.turnSwitchArrow}>
                            <View style={styles.turnSwitchPlayerCard}>
                                <RNImage source={AVATAR_IMAGES[currentPlayer.avatarIndex % AVATAR_IMAGES.length]} style={[styles.turnSwitchAvatar, { borderColor: currentPlayer.color }]} />
                                <Text style={[styles.turnSwitchPlayer, { color: currentPlayer.color }]}>
                                    {currentPlayer.name}
                                </Text>
                            </View>
                            <Text style={styles.turnSwitchArrowIcon}>→</Text>
                            <View style={styles.turnSwitchPlayerCard}>
                                <RNImage source={AVATAR_IMAGES[nextPlayer.avatarIndex % AVATAR_IMAGES.length]} style={[styles.turnSwitchAvatar, { borderColor: nextPlayer.color }]} />
                                <Text style={[styles.turnSwitchPlayer, { color: nextPlayer.color }]}>
                                    {nextPlayer.name}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.turnSwitchHint}>Timer will reset to {ROUND_TIME}s</Text>
                    </Animated.View>
                </SafeAreaView>
            </View>
        );
    }

    if (gameOver) {
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.gameOverContainer}>
                        <Text style={styles.gameOverTitle}>🏆 FINAL SCORES 🏆</Text>
                        <View style={styles.leaderboard}>
                            {sortedPlayers.map((player, index) => (
                                <View key={player.id} style={[
                                    styles.leaderboardRow,
                                    index === 0 && styles.winnerRow
                                ]}>
                                    <Text style={styles.rankText}>#{index + 1}</Text>
                                    <RNImage source={AVATAR_IMAGES[player.avatarIndex % AVATAR_IMAGES.length]} style={[styles.leaderboardAvatar, { borderColor: player.color }]} />
                                    <Text style={[styles.playerName, index === 0 && styles.winnerNameText]}>
                                        {player.name}
                                    </Text>
                                    <Text style={styles.playerScore}>{player.score} pts</Text>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.playAgainButton} onPress={() => router.back()}>
                            <Text style={styles.playAgainText}>BACK TO MENU</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    if (roundOver) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.roundOverContainer}>
                        <Text style={styles.roundOverTitle}>
                            {roundWinner ? 'ROUND COMPLETE! 🎉' : 'TIME\'S UP! ⏰'}
                        </Text>
                        {roundWinner ? (
                            <Text style={styles.roundWinner}>
                                Winner: <Text style={{ color: roundWinner?.color }}>{roundWinner?.name}</Text>
                            </Text>
                        ) : (
                            <Text style={styles.roundWinner}>No one solved it in time!</Text>
                        )}
                        <Text style={styles.phraseReveal}>The phrase was:</Text>
                        <Text style={styles.fullPhrase}>{phrase.text}</Text>
                        <Text style={styles.clueReveal}>Clue: {phrase.clue}</Text>
                        <TouchableOpacity style={styles.nextRoundButton} onPress={nextRound}>
                            <Text style={styles.nextRoundText}>
                                {currentRound < TOTAL_ROUNDS ? 'NEXT ROUND' : 'SEE RESULTS'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.roundLabel}>Round {currentRound}/{TOTAL_ROUNDS}</Text>
                        <Animated.View style={[
                            styles.timerContainer,
                            timeRemaining <= 10 && styles.timerDanger,
                            { transform: [{ scale: timerPulse }] }
                        ]}>
                            <Text style={[
                                styles.timerText,
                                timeRemaining <= 10 && styles.timerTextDanger
                            ]}>⏱️ {formatTime(timeRemaining)}</Text>
                        </Animated.View>
                        <View style={[styles.currentPlayerIndicator, {
                            backgroundColor: currentPlayer.color,
                            shadowColor: currentPlayer.color,
                        }]}>
                            <Text style={styles.currentPlayerText}>{currentPlayer.name}'s Turn</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        {renderWrongGuessIndicator()}
                    </View>
                </View>

                {renderClueButton()}
                {renderPhrase()}
                {renderKeyboard()}

                <Text style={styles.instructions}>
                    {wrongGuessesThisTurn > 0
                        ? `⚠️ ${MAX_WRONG_PER_TURN - wrongGuessesThisTurn} wrong guesses left before switch!`
                        : 'Guess letters to reveal the hidden phrase!'}
                </Text>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a1628',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(0, 255, 255, 0.5)',
    },
    backText: {
        fontSize: 24,
        color: '#00ffff',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerRight: {
        width: 50,
        alignItems: 'center',
    },
    roundLabel: {
        fontSize: 14,
        color: '#00ffff',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    timerContainer: {
        backgroundColor: 'rgba(0, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 15,
        marginBottom: 6,
        borderWidth: 2,
        borderColor: 'rgba(0, 255, 255, 0.5)',
    },
    timerDanger: {
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        borderColor: 'rgba(255, 0, 0, 0.8)',
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00ffff',
    },
    timerTextDanger: {
        color: '#ff4444',
    },
    currentPlayerIndicator: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    currentPlayerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0a1628',
    },
    wrongGuessIndicator: {
        flexDirection: 'row',
        gap: 4,
    },
    wrongGuessDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    wrongGuessDotFilled: {
        backgroundColor: '#ff6b6b',
        borderColor: '#ff4444',
    },
    clueButton: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 215, 0, 0.6)',
        alignItems: 'center',
    },
    clueButtonText: {
        color: '#ffd700',
        fontSize: 16,
        fontWeight: 'bold',
    },
    clueContainer: {
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 15,
        marginHorizontal: 20,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 215, 0, 0.4)',
    },
    clueLabel: {
        color: '#ffd700',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    clueText: {
        color: 'white',
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    boardContainer: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    boardImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boardContent: {
        width: '92%',
        height: '65%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    wordRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 2,
        flexWrap: 'wrap',
    },
    letterTile: {
        width: width * 0.06,
        height: width * 0.07,
        backgroundColor: '#2d5a4f',
        borderRadius: 3,
        margin: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#1a3a2f',
    },
    revealedTile: {
        backgroundColor: '#ffffff',
        borderColor: '#d4d4d4',
    },
    spaceTile: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    letterText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'transparent',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    revealedLetterText: {
        color: '#0a1628',
    },
    keyboard: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 8,
        marginTop: 20,
    },
    keyButton: {
        width: width * 0.1,
        height: width * 0.1,
        backgroundColor: 'rgba(0, 255, 255, 0.2)',
        borderRadius: 8,
        margin: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(0, 255, 255, 0.5)',
    },
    keyButtonUsed: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    keyButtonCorrect: {
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        borderColor: 'rgba(0, 255, 0, 0.5)',
    },
    keyButtonWrong: {
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderColor: 'rgba(255, 0, 0, 0.4)',
    },
    keyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00ffff',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    keyTextUsed: {
        color: 'rgba(255, 255, 255, 0.3)',
    },
    instructions: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 5,
        paddingHorizontal: 20,
    },
    turnSwitchOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 40,
    },
    turnSwitchTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ff6b6b',
        marginBottom: 20,
        textAlign: 'center',
    },
    turnSwitchText: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 30,
        textAlign: 'center',
    },
    turnSwitchArrow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    turnSwitchPlayer: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
    turnSwitchPlayerCard: {
        alignItems: 'center',
    },
    turnSwitchAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
    },
    turnSwitchArrowIcon: {
        fontSize: 30,
        color: 'white',
        marginHorizontal: 20,
    },
    turnSwitchHint: {
        fontSize: 16,
        color: '#00ffff',
    },
    leaderboardAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        marginRight: 12,
    },
    gameOverContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        width: '100%',
    },
    gameOverTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#00ffff',
        textShadowColor: '#00ffff',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
        marginBottom: 30,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    leaderboard: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 30,
    },
    leaderboardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    winnerRow: {
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        borderRadius: 8,
        paddingHorizontal: 10,
        borderBottomWidth: 0,
        marginBottom: 5,
    },
    rankText: {
        color: '#00ffff',
        fontSize: 18,
        fontWeight: 'bold',
        width: 40,
    },
    playerColorDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 12,
    },
    playerName: {
        color: 'white',
        fontSize: 18,
        flex: 1,
    },
    winnerNameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00ffff',
    },
    playerScore: {
        color: '#00ffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    roundOverContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    roundOverTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00ffff',
        marginBottom: 20,
        textAlign: 'center',
    },
    roundWinner: {
        fontSize: 22,
        color: 'white',
        marginBottom: 30,
    },
    phraseReveal: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 8,
    },
    fullPhrase: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    clueReveal: {
        fontSize: 14,
        color: '#ffd700',
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 30,
    },
    nextRoundButton: {
        backgroundColor: '#00ffff',
        paddingHorizontal: 50,
        paddingVertical: 18,
        borderRadius: 30,
        shadowColor: '#00ffff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 10,
    },
    nextRoundText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0a1628',
        letterSpacing: 1,
    },
    playAgainButton: {
        backgroundColor: '#00ffff',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: '#00ffff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 10,
    },
    playAgainText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0a1628',
        letterSpacing: 1,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
});
