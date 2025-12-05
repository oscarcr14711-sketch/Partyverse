import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRandomPhrase } from '../data/phrases';

const { width } = Dimensions.get('window');
const TOTAL_ROUNDS = 3;

interface Player {
    id: string;
    name: string;
    color: string;
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
    const [phrase, setPhrase] = useState(() => getRandomPhrase(category));
    const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
    const [roundOver, setRoundOver] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [roundWinner, setRoundWinner] = useState<Player | null>(null);

    const currentPlayer = players[currentPlayerIndex];

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

    const handleRoundWin = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const updatedPlayers = [...players];
        updatedPlayers[currentPlayerIndex].score += 10;
        setPlayers(updatedPlayers);
        setRoundWinner(currentPlayer);
        setRoundOver(true);
    };

    const nextRound = () => {
        if (currentRound < TOTAL_ROUNDS) {
            setCurrentRound(currentRound + 1);
            setPhrase(getRandomPhrase(category));
            setGuessedLetters(new Set());
            setRoundOver(false);
            setRoundWinner(null);
            setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        } else {
            setGameOver(true);
        }
    };

    const handleLetterGuess = (letter: string) => {
        if (guessedLetters.has(letter) || roundOver || gameOver) return;

        const newGuessed = new Set(guessedLetters);
        newGuessed.add(letter);
        setGuessedLetters(newGuessed);

        if (phrase.text.includes(letter)) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            const updatedPlayers = [...players];
            updatedPlayers[currentPlayerIndex].score += 1;
            setPlayers(updatedPlayers);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        }
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
                            ]}
                            onPress={() => handleLetterGuess(letter)}
                            disabled={isGuessed || roundOver || gameOver}
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
                                    <View style={[styles.playerColorDot, { backgroundColor: player.color }]} />
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
                        <Text style={styles.roundOverTitle}>ROUND {currentRound} COMPLETE!</Text>
                        <Text style={styles.roundWinner}>
                            Winner: <Text style={{ color: roundWinner?.color }}>{roundWinner?.name}</Text>
                        </Text>
                        <Text style={styles.phraseReveal}>The phrase was:</Text>
                        <Text style={styles.fullPhrase}>{phrase.text}</Text>
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
                        <Text style={styles.categoryLabel}>{category}</Text>
                        <View style={[styles.currentPlayerIndicator, {
                            backgroundColor: currentPlayer.color,
                            shadowColor: currentPlayer.color,
                        }]}>
                            <Text style={styles.currentPlayerText}>{currentPlayer.name}'s Turn</Text>
                        </View>
                    </View>
                    <View style={styles.placeholder} />
                </View>

                {renderPhrase()}
                {renderKeyboard()}
                <Text style={styles.instructions}>Tap a letter to guess!</Text>
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
        paddingVertical: 10,
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
    roundLabel: {
        fontSize: 14,
        color: '#00ffff',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    categoryLabel: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 5,
        fontWeight: '600',
    },
    currentPlayerIndicator: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    currentPlayerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0a1628',
    },
    placeholder: {
        width: 40,
    },
    boardContainer: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
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
        width: width * 0.065,
        height: width * 0.075,
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
        fontSize: 16,
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
        paddingHorizontal: 10,
        marginTop: 10,
    },
    keyButton: {
        width: width * 0.11,
        height: width * 0.11,
        backgroundColor: 'rgba(0, 255, 255, 0.2)',
        borderRadius: 8,
        margin: 3,
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
    keyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00ffff',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    keyTextUsed: {
        color: 'rgba(255, 255, 255, 0.3)',
    },
    instructions: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 10,
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
        fontSize: 32,
        fontWeight: 'bold',
        color: '#00ffff',
        marginBottom: 20,
        textAlign: 'center',
    },
    roundWinner: {
        fontSize: 24,
        color: 'white',
        marginBottom: 40,
    },
    phraseReveal: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 10,
    },
    fullPhrase: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
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
