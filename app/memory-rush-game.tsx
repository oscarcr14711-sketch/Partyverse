import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';

type GamePhase = 'instructions' | 'memorize' | 'find-change' | 'feedback' | 'round-end';
type Difficulty = 'easy' | 'medium' | 'hard';
type SequenceType = 'shapes' | 'emojis' | 'numbers' | 'emotions';
type ChangeType = 'missing' | 'changed' | 'order' | 'added';

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

const SHAPES = ['🔺', '🔵', '🟩', '🟡', '🔶', '🟣', '🟤', '⬛', '⬜'];
const EMOJIS = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓', '🍉', '🍑', '🥝'];
const EMOTIONS = ['😊', '😡', '🤣', '😴', '😎', '🥺', '😱', '🤔', '😍'];

export default function MemoryRushGame() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const initialPlayers: Player[] = JSON.parse(params.players as string || '[]').map((p: any) => ({
        ...p,
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        timeouts: 0,
        streak: 0,
        fastestTime: null,
        reactionTimes: [],
    }));
    const numRounds = parseInt(params.numRounds as string) || 5;
    const difficulty = (params.difficulty as Difficulty) || 'medium';

    const [currentPhase, setCurrentPhase] = useState<GamePhase>('instructions');
    const [currentRound, setCurrentRound] = useState(1);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [players, setPlayers] = useState<Player[]>(initialPlayers);

    const [originalSequence, setOriginalSequence] = useState<string[]>([]);
    const [modifiedSequence, setModifiedSequence] = useState<string[]>([]);
    const [changeType, setChangeType] = useState<ChangeType>('missing');
    const [changedIndex, setChangedIndex] = useState<number>(-1);
    const [timeLeft, setTimeLeft] = useState(5);
    const [reactionStartTime, setReactionStartTime] = useState<number>(0);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const flashAnim = useRef(new Animated.Value(0)).current;
    const glitchAnim = useRef(new Animated.Value(0)).current;

    const currentPlayer = players[currentPlayerIndex];

    // Get sequence parameters based on difficulty
    const getSequenceParams = () => {
        switch (difficulty) {
            case 'easy':
                return { count: 3 + Math.floor(Math.random() * 2), displayTime: 3000, reactionTime: 5 };
            case 'medium':
                return { count: 5 + Math.floor(Math.random() * 2), displayTime: 2000, reactionTime: 4 };
            case 'hard':
                return { count: 7 + Math.floor(Math.random() * 3), displayTime: 1500, reactionTime: 3 };
        }
    };

    // Generate random sequence
    const generateSequence = () => {
        const types: SequenceType[] = ['shapes', 'emojis', 'numbers', 'emotions'];
        const type = types[Math.floor(Math.random() * types.length)];
        const params = getSequenceParams();

        let pool: string[] = [];
        switch (type) {
            case 'shapes':
                pool = SHAPES;
                break;
            case 'emojis':
                pool = EMOJIS;
                break;
            case 'emotions':
                pool = EMOTIONS;
                break;
            case 'numbers':
                pool = Array.from({ length: 10 }, (_, i) => i.toString());
                break;
        }

        const sequence: string[] = [];
        for (let i = 0; i < params.count; i++) {
            const randomItem = pool[Math.floor(Math.random() * pool.length)];
            sequence.push(randomItem);
        }

        return sequence;
    };

    // Create modified sequence with a change
    const createModifiedSequence = (original: string[]) => {
        const modified = [...original];
        const changeTypes: ChangeType[] = ['missing', 'changed', 'order', 'added'];
        const selectedChange = changeTypes[Math.floor(Math.random() * changeTypes.length)];

        let changedIdx = -1;

        switch (selectedChange) {
            case 'missing':
                changedIdx = Math.floor(Math.random() * modified.length);
                modified.splice(changedIdx, 1);
                break;

            case 'changed':
                changedIdx = Math.floor(Math.random() * modified.length);
                const pool = original[0].match(/\d/) ? Array.from({ length: 10 }, (_, i) => i.toString()) :
                    SHAPES.includes(original[0]) ? SHAPES :
                        EMOJIS.includes(original[0]) ? EMOJIS : EMOTIONS;
                let newItem = pool[Math.floor(Math.random() * pool.length)];
                while (newItem === modified[changedIdx]) {
                    newItem = pool[Math.floor(Math.random() * pool.length)];
                }
                modified[changedIdx] = newItem;
                break;

            case 'order':
                if (modified.length >= 2) {
                    const idx1 = Math.floor(Math.random() * modified.length);
                    let idx2 = Math.floor(Math.random() * modified.length);
                    while (idx2 === idx1) {
                        idx2 = Math.floor(Math.random() * modified.length);
                    }
                    [modified[idx1], modified[idx2]] = [modified[idx2], modified[idx1]];
                    changedIdx = Math.min(idx1, idx2);
                }
                break;

            case 'added':
                const addPool = original[0].match(/\d/) ? Array.from({ length: 10 }, (_, i) => i.toString()) :
                    SHAPES.includes(original[0]) ? SHAPES :
                        EMOJIS.includes(original[0]) ? EMOJIS : EMOTIONS;
                const addItem = addPool[Math.floor(Math.random() * addPool.length)];
                changedIdx = Math.floor(Math.random() * (modified.length + 1));
                modified.splice(changedIdx, 0, addItem);
                break;
        }

        setChangeType(selectedChange);
        setChangedIndex(changedIdx);
        return modified;
    };

    // Start new round
    const startMemorizePhase = () => {
        const sequence = generateSequence();
        setOriginalSequence(sequence);
        setCurrentPhase('memorize');

        const params = getSequenceParams();

        // Flash animation
        Animated.sequence([
            Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(flashAnim, { toValue: 0, duration: params.displayTime - 200, useNativeDriver: true }),
        ]).start(() => {
            const modified = createModifiedSequence(sequence);
            setModifiedSequence(modified);
            setCurrentPhase('find-change');
            setTimeLeft(params.reactionTime);
            setReactionStartTime(Date.now());
            Vibration.vibrate(100);
        });
    };

    // Timer countdown
    useEffect(() => {
        if (currentPhase === 'find-change' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (currentPhase === 'find-change' && timeLeft === 0) {
            handleTimeout();
        }
    }, [timeLeft, currentPhase]);

    const handleTimeout = () => {
        const updatedPlayers = [...players];
        updatedPlayers[currentPlayerIndex].score -= 1;
        updatedPlayers[currentPlayerIndex].timeouts += 1;
        updatedPlayers[currentPlayerIndex].streak = 0;
        setPlayers(updatedPlayers);
        setIsCorrect(false);
        setCurrentPhase('feedback');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    };

    const handleItemTap = (index: number) => {
        if (currentPhase !== 'find-change') return;

        const reactionTime = Date.now() - reactionStartTime;
        const updatedPlayers = [...players];
        const player = updatedPlayers[currentPlayerIndex];

        // Check if correct
        const correct = index === changedIndex;
        setIsCorrect(correct);

        if (correct) {
            player.score += 1;
            player.correctAnswers += 1;
            player.streak += 1;
            player.reactionTimes.push(reactionTime);

            if (!player.fastestTime || reactionTime < player.fastestTime) {
                player.fastestTime = reactionTime;
            }

            // Streak bonus
            if (player.streak === 3) {
                player.score += 2;
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            player.score -= 1;
            player.wrongAnswers += 1;
            player.streak = 0;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        setPlayers(updatedPlayers);
        setCurrentPhase('feedback');
    };

    const handleNextPlayer = () => {
        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(currentPlayerIndex + 1);
            setIsCorrect(null);
            startMemorizePhase();
        } else {
            setCurrentPhase('round-end');
        }
    };

    const handleNextRound = () => {
        if (currentRound < numRounds) {
            setCurrentRound(currentRound + 1);
            setCurrentPlayerIndex(0);
            setIsCorrect(null);
            setCurrentPhase('instructions');
        } else {
            router.push({
                pathname: '/memory-rush-game-over',
                params: {
                    players: JSON.stringify(players),
                }
            });
        }
    };

    // Render phases
    const renderInstructions = () => (
        <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.phaseContainer}
        >
            <Text style={styles.phaseTitle}>⚡ ROUND {currentRound}</Text>

            <View style={styles.instructionsBox}>
                <Text style={styles.instructionText}>Stay focused.</Text>
                <Text style={styles.instructionText}>Memorize the sequence… fast.</Text>
                <Text style={styles.instructionText}>One thing will change — find it before time runs out.</Text>
            </View>

            <View style={styles.playerTurnCard}>
                <Text style={styles.playerTurnLabel}>Current Player:</Text>
                <Text style={styles.playerTurnName}>{currentPlayer.name}</Text>
                <Text style={styles.playerTurnScore}>Score: {currentPlayer.score}</Text>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={startMemorizePhase}>
                <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.buttonGradient}>
                    <Text style={styles.continueButtonText}>START</Text>
                </LinearGradient>
            </TouchableOpacity>
        </LinearGradient>
    );

    const renderMemorize = () => (
        <View style={styles.memoryContainer}>
            <Animated.View style={[styles.flashOverlay, { opacity: flashAnim }]} />

            <Text style={styles.memoryTitle}>MEMORIZE!</Text>

            <View style={styles.sequenceContainer}>
                {originalSequence.map((item, index) => (
                    <View key={index} style={styles.sequenceItem}>
                        <Text style={styles.sequenceText}>{item}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.roundBadge}>
                <Text style={styles.roundBadgeText}>Round {currentRound}/{numRounds}</Text>
            </View>
        </View>
    );

    const renderFindChange = () => (
        <View style={styles.memoryContainer}>
            <Text style={styles.changeTitle}>WHAT'S WRONG?</Text>
            <Text style={styles.changeSubtitle}>FIND THE DIFFERENCE!</Text>

            <View style={styles.timerContainer}>
                <Text style={[styles.timerText, timeLeft <= 1 && styles.timerUrgent]}>{timeLeft}s</Text>
            </View>

            <View style={styles.sequenceContainer}>
                {modifiedSequence.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.sequenceItem}
                        onPress={() => handleItemTap(index)}
                    >
                        <Text style={styles.sequenceText}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.roundBadge}>
                <Text style={styles.roundBadgeText}>{currentPlayer.name}</Text>
            </View>
        </View>
    );

    const renderFeedback = () => (
        <LinearGradient
            colors={isCorrect ? ['#2ecc71', '#27ae60'] : ['#e74c3c', '#c0392b']}
            style={styles.feedbackContainer}
        >
            <Text style={styles.feedbackEmoji}>{isCorrect ? '✔' : '✖'}</Text>
            <Text style={styles.feedbackText}>{isCorrect ? 'NICE!' : 'WRONG!'}</Text>

            {isCorrect && players[currentPlayerIndex].streak === 3 && (
                <Text style={styles.streakBonus}>🔥 STREAK BONUS! +2</Text>
            )}

            <TouchableOpacity style={styles.continueButton} onPress={handleNextPlayer}>
                <LinearGradient colors={['#3498db', '#2980b9']} style={styles.buttonGradient}>
                    <Text style={styles.continueButtonText}>NEXT PLAYER</Text>
                </LinearGradient>
            </TouchableOpacity>
        </LinearGradient>
    );

    const renderRoundEnd = () => {
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

        return (
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.phaseContainer}>
                <Text style={styles.phaseTitle}>Round {currentRound} Complete!</Text>

                <View style={styles.scoresContainer}>
                    {sortedPlayers.map((player, index) => (
                        <View key={player.id} style={styles.scoreRow}>
                            <Text style={styles.scoreRank}>#{index + 1}</Text>
                            <Text style={styles.scorePlayerName}>{player.name}</Text>
                            <Text style={styles.scorePoints}>{player.score} pts</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.continueButton} onPress={handleNextRound}>
                    <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.buttonGradient}>
                        <Text style={styles.continueButtonText}>
                            {currentRound < numRounds ? 'NEXT ROUND' : 'VIEW RESULTS'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>
        );
    };

    return (
        <View style={styles.container}>
            {currentPhase === 'instructions' && renderInstructions()}
            {currentPhase === 'memorize' && renderMemorize()}
            {currentPhase === 'find-change' && renderFindChange()}
            {currentPhase === 'feedback' && renderFeedback()}
            {currentPhase === 'round-end' && renderRoundEnd()}
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    phaseContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    phaseTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    instructionsBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        padding: 30,
        marginBottom: 30,
        width: '100%',
    },
    instructionText: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 15,
        textAlign: 'center',
        lineHeight: 26,
    },
    playerTurnCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        padding: 25,
        marginBottom: 30,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ffd32a',
    },
    playerTurnLabel: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 8,
    },
    playerTurnName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    playerTurnScore: {
        fontSize: 20,
        color: '#ffd32a',
        fontWeight: 'bold',
    },
    memoryContainer: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    flashOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
    },
    memoryTitle: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#f093fb',
        marginBottom: 40,
        textShadowColor: 'rgba(240, 147, 251, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    changeTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#f5576c',
        marginBottom: 10,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    changeSubtitle: {
        fontSize: 24,
        color: '#ffd32a',
        marginBottom: 30,
    },
    timerContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 3,
        borderColor: '#ffd32a',
    },
    timerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    timerUrgent: {
        color: '#e74c3c',
    },
    sequenceContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
        maxWidth: width - 40,
    },
    sequenceItem: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#667eea',
    },
    sequenceText: {
        fontSize: 40,
    },
    roundBadge: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#ffd32a',
    },
    roundBadgeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    feedbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    feedbackEmoji: {
        fontSize: 120,
        marginBottom: 20,
    },
    feedbackText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    streakBonus: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffd32a',
        marginBottom: 30,
    },
    scoresContainer: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    scoreRank: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffd32a',
        width: 50,
    },
    scorePlayerName: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    scorePoints: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f093fb',
    },
    continueButton: {
        borderRadius: 30,
        overflow: 'hidden',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
    buttonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
});
