import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

type GamePhase = 'instructions' | 'memorize' | 'find-change' | 'feedback' | 'round-end';
type Difficulty = 'easy' | 'medium' | 'hard';
type SequenceType = 'shapes' | 'emojis' | 'numbers' | 'emotions' | 'colors' | 'patterns';
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
    lives: number;
    combo: number;
}

interface FloatingScore {
    id: number;
    value: number;
    x: number;
    y: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Content pools
const SHAPES = ['🔺', '🔵', '🟩', '🟡', '🔶', '🟣', '🟤', '⬛', '⬜'];
const EMOJIS = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓', '🍉', '🍑', '🥝'];
const EMOTIONS = ['😊', '😡', '🤣', '😴', '😎', '🥺', '😱', '🤔', '😍'];
const COLORS = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤'];
const PATTERNS = ['◆◆', '◇◇', '○○', '●●', '□□', '■■', '△△', '▲▲', '☆☆'];

// Animated sequence item component
const AnimatedItem = ({
    item,
    index,
    onPress,
    isInteractive,
    isCorrect,
    isSelected,
    animationDelay
}: {
    item: string;
    index: number;
    onPress?: () => void;
    isInteractive: boolean;
    isCorrect?: boolean;
    isSelected?: boolean;
    animationDelay: number;
}) => {
    const scale = useSharedValue(0);
    const bounce = useSharedValue(0);
    const glow = useSharedValue(0);

    useEffect(() => {
        // Entry animation with stagger
        setTimeout(() => {
            scale.value = withSpring(1, { damping: 8, stiffness: 100 });
        }, animationDelay);

        // Gentle floating animation
        bounce.value = withRepeat(
            withSequence(
                withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
                withTiming(5, { duration: 1000, easing: Easing.inOut(Easing.sin) })
            ),
            -1,
            true
        );
    }, []);

    // Pulse when interactive
    useEffect(() => {
        if (isInteractive) {
            glow.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 600 }),
                    withTiming(0.5, { duration: 600 })
                ),
                -1,
                true
            );
        }
    }, [isInteractive]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateY: bounce.value }
        ],
        opacity: glow.value > 0 ? 0.5 + glow.value * 0.5 : 1,
    }));

    const getBorderColor = () => {
        if (isSelected && isCorrect) return '#2ecc71';
        if (isSelected && !isCorrect) return '#e74c3c';
        return '#667eea';
    };

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity
                style={[
                    styles.sequenceItem,
                    { borderColor: getBorderColor() },
                    isSelected && { borderWidth: 4 }
                ]}
                onPress={onPress}
                disabled={!isInteractive}
                activeOpacity={0.7}
            >
                <Text style={styles.sequenceText}>{item}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Floating score animation component
const FloatingScoreAnim = ({ score, x }: { score: FloatingScore; x: number }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(0.5);

    useEffect(() => {
        scale.value = withSpring(1.2, { damping: 5 });
        translateY.value = withTiming(-100, { duration: 1500, easing: Easing.out(Easing.quad) });
        opacity.value = withTiming(0, { duration: 1500 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }, { scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.floatingScore, animatedStyle, { left: x }]}>
            <Text style={[
                styles.floatingScoreText,
                { color: score.value > 0 ? '#2ecc71' : '#e74c3c' }
            ]}>
                {score.value > 0 ? `+${score.value}` : score.value}
            </Text>
        </Animated.View>
    );
};

// Particle effect component
const Particle = ({ delay, startX, startY }: { delay: number; startX: number; startY: number }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(1);
    const color = ['#f093fb', '#f5576c', '#667eea', '#ffd32a', '#2ecc71'][Math.floor(Math.random() * 5)];

    useEffect(() => {
        setTimeout(() => {
            opacity.value = withSequence(
                withTiming(1, { duration: 100 }),
                withTiming(0, { duration: 800 })
            );
            translateX.value = withTiming((Math.random() - 0.5) * 150, { duration: 900 });
            translateY.value = withTiming((Math.random() - 0.5) * 150, { duration: 900 });
            scale.value = withTiming(0, { duration: 900 });
        }, delay);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value }
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[
            styles.particle,
            animatedStyle,
            { left: startX, top: startY, backgroundColor: color }
        ]} />
    );
};

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
        lives: 3,
        combo: 1,
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
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [sequenceType, setSequenceType] = useState<SequenceType>('shapes');

    // New state for enhancements
    const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
    const [showParticles, setShowParticles] = useState(false);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);
    const [hintUsed, setHintUsed] = useState(false);
    const [hintIndex, setHintIndex] = useState<number | null>(null);

    // Animation values
    const glitchX = useSharedValue(0);
    const glitchOpacity = useSharedValue(0);
    const progressAnim = useSharedValue(0);
    const comboScale = useSharedValue(1);

    const currentPlayer = players[currentPlayerIndex];

    // Get sequence parameters based on difficulty and speed multiplier
    const getSequenceParams = () => {
        const baseParams = {
            easy: { count: 3 + Math.floor(Math.random() * 2), displayTime: 3000, reactionTime: 5 },
            medium: { count: 5 + Math.floor(Math.random() * 2), displayTime: 2000, reactionTime: 4 },
            hard: { count: 7 + Math.floor(Math.random() * 3), displayTime: 1500, reactionTime: 3 },
        };
        const params = baseParams[difficulty];
        // Speed round makes things faster
        return {
            ...params,
            displayTime: Math.max(800, params.displayTime / speedMultiplier),
            reactionTime: Math.max(2, Math.floor(params.reactionTime / speedMultiplier))
        };
    };

    // Trigger glitch effect
    const triggerGlitch = () => {
        glitchOpacity.value = withSequence(
            withTiming(0.8, { duration: 50 }),
            withTiming(0, { duration: 100 }),
            withTiming(0.5, { duration: 50 }),
            withTiming(0, { duration: 100 })
        );
        glitchX.value = withSequence(
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(5, { duration: 50 }),
            withTiming(0, { duration: 50 })
        );
    };

    // Generate random sequence
    const generateSequence = () => {
        const types: SequenceType[] = ['shapes', 'emojis', 'numbers', 'emotions', 'colors', 'patterns'];
        const type = types[Math.floor(Math.random() * types.length)];
        setSequenceType(type);
        const params = getSequenceParams();

        let pool: string[] = [];
        switch (type) {
            case 'shapes': pool = SHAPES; break;
            case 'emojis': pool = EMOJIS; break;
            case 'emotions': pool = EMOTIONS; break;
            case 'colors': pool = COLORS; break;
            case 'patterns': pool = PATTERNS; break;
            case 'numbers': pool = Array.from({ length: 10 }, (_, i) => i.toString()); break;
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

        const getPool = () => {
            switch (sequenceType) {
                case 'shapes': return SHAPES;
                case 'emojis': return EMOJIS;
                case 'emotions': return EMOTIONS;
                case 'colors': return COLORS;
                case 'patterns': return PATTERNS;
                case 'numbers': return Array.from({ length: 10 }, (_, i) => i.toString());
            }
        };

        switch (selectedChange) {
            case 'missing':
                changedIdx = Math.floor(Math.random() * modified.length);
                modified.splice(changedIdx, 1);
                break;
            case 'changed':
                changedIdx = Math.floor(Math.random() * modified.length);
                const pool = getPool();
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
                    while (idx2 === idx1) idx2 = Math.floor(Math.random() * modified.length);
                    [modified[idx1], modified[idx2]] = [modified[idx2], modified[idx1]];
                    changedIdx = Math.min(idx1, idx2);
                }
                break;
            case 'added':
                const addPool = getPool();
                const addItem = addPool[Math.floor(Math.random() * addPool.length)];
                changedIdx = Math.floor(Math.random() * (modified.length + 1));
                modified.splice(changedIdx, 0, addItem);
                break;
        }

        setChangeType(selectedChange);
        setChangedIndex(changedIdx);
        return modified;
    };

    // Start memorize phase
    const startMemorizePhase = () => {
        const sequence = generateSequence();
        setOriginalSequence(sequence);
        setCurrentPhase('memorize');
        setSelectedIndex(null);
        setHintUsed(false);
        setHintIndex(null);

        const params = getSequenceParams();

        // Transition to find-change after display time
        setTimeout(() => {
            triggerGlitch();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

            setTimeout(() => {
                const modified = createModifiedSequence(sequence);
                setModifiedSequence(modified);
                setCurrentPhase('find-change');
                setTimeLeft(params.reactionTime);
                setReactionStartTime(Date.now());
            }, 300);
        }, params.displayTime);
    };

    // Timer countdown with animation
    useEffect(() => {
        if (currentPhase === 'find-change' && timeLeft > 0) {
            progressAnim.value = withTiming((timeLeft - 1) / getSequenceParams().reactionTime, { duration: 1000 });
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (currentPhase === 'find-change' && timeLeft === 0) {
            handleTimeout();
        }
    }, [timeLeft, currentPhase]);

    // Add floating score
    const addFloatingScore = (value: number) => {
        const newScore: FloatingScore = {
            id: Date.now(),
            value,
            x: SCREEN_WIDTH / 2 - 30,
            y: SCREEN_HEIGHT / 2
        };
        setFloatingScores(prev => [...prev, newScore]);
        setTimeout(() => {
            setFloatingScores(prev => prev.filter(s => s.id !== newScore.id));
        }, 1500);
    };

    // Use hint
    const useHint = () => {
        if (hintUsed || currentPhase !== 'find-change') return;
        setHintUsed(true);
        setHintIndex(changedIndex);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Hint costs 1 point
        const updatedPlayers = [...players];
        updatedPlayers[currentPlayerIndex].score -= 1;
        setPlayers(updatedPlayers);
        addFloatingScore(-1);
    };

    const handleTimeout = () => {
        const updatedPlayers = [...players];
        const player = updatedPlayers[currentPlayerIndex];
        player.score -= 2;
        player.timeouts += 1;
        player.streak = 0;
        player.combo = 1;
        player.lives -= 1;
        setPlayers(updatedPlayers);
        setIsCorrect(false);
        setCurrentPhase('feedback');
        addFloatingScore(-2);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    };

    const handleItemTap = (index: number) => {
        if (currentPhase !== 'find-change') return;

        const reactionTime = Date.now() - reactionStartTime;
        const updatedPlayers = [...players];
        const player = updatedPlayers[currentPlayerIndex];
        const correct = index === changedIndex;

        setIsCorrect(correct);
        setSelectedIndex(index);

        if (correct) {
            // Calculate score with bonuses
            let points = 1;

            // Speed bonus (under half time = +1)
            const params = getSequenceParams();
            if (reactionTime < (params.reactionTime * 1000) / 2) {
                points += 1;
            }

            // Combo multiplier
            points *= player.combo;

            // Streak bonus
            player.streak += 1;
            if (player.streak >= 3) {
                points += Math.floor(player.streak / 3);
            }

            // Increase combo
            player.combo = Math.min(player.combo + 1, 5);

            player.score += points;
            player.correctAnswers += 1;
            player.reactionTimes.push(reactionTime);

            if (!player.fastestTime || reactionTime < player.fastestTime) {
                player.fastestTime = reactionTime;
            }

            // Animate combo
            comboScale.value = withSequence(
                withSpring(1.5, { damping: 5 }),
                withSpring(1)
            );

            setShowParticles(true);
            setTimeout(() => setShowParticles(false), 1000);
            addFloatingScore(points);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Speed up next round slightly
            setSpeedMultiplier(prev => Math.min(prev + 0.1, 2));
        } else {
            player.score -= 1;
            player.wrongAnswers += 1;
            player.streak = 0;
            player.combo = 1;
            player.lives -= 1;
            addFloatingScore(-1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        setPlayers(updatedPlayers);

        // Short delay to show result
        setTimeout(() => {
            setCurrentPhase('feedback');
        }, 500);
    };

    const handleNextPlayer = () => {
        // Check if player is eliminated
        if (players[currentPlayerIndex].lives <= 0) {
            // Skip this player in future rounds
        }

        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(currentPlayerIndex + 1);
            setIsCorrect(null);
            setSelectedIndex(null);
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
            setSelectedIndex(null);
            setSpeedMultiplier(1);
            setCurrentPhase('instructions');
        } else {
            router.push({
                pathname: '/memory-rush-game-over',
                params: { players: JSON.stringify(players) }
            });
        }
    };

    // Animated styles
    const glitchStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: glitchX.value }],
    }));

    const glitchOverlayStyle = useAnimatedStyle(() => ({
        opacity: glitchOpacity.value,
    }));

    const progressStyle = useAnimatedStyle(() => ({
        width: `${progressAnim.value * 100}%`,
    }));

    const comboStyle = useAnimatedStyle(() => ({
        transform: [{ scale: comboScale.value }],
    }));

    // Generate particles
    const particles = showParticles ? Array.from({ length: 20 }, (_, i) => ({
        id: i,
        delay: i * 30,
        x: SCREEN_WIDTH / 2,
        y: SCREEN_HEIGHT / 2
    })) : [];

    // Render phases
    const renderInstructions = () => (
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.phaseContainer}>
            <Text style={styles.phaseTitle}>⚡ ROUND {currentRound}</Text>

            {/* Progress indicator */}
            <View style={styles.roundProgress}>
                {Array.from({ length: numRounds }, (_, i) => (
                    <View key={i} style={[
                        styles.progressDot,
                        i < currentRound && styles.progressDotFilled,
                        i === currentRound - 1 && styles.progressDotCurrent
                    ]} />
                ))}
            </View>

            <View style={styles.instructionsBox}>
                <Text style={styles.instructionText}>🧠 Memorize the sequence</Text>
                <Text style={styles.instructionText}>👁️ Find what changed</Text>
                <Text style={styles.instructionText}>⚡ Be fast for bonus points!</Text>
            </View>

            <View style={styles.playerTurnCard}>
                <Text style={styles.playerTurnLabel}>Current Player</Text>
                <Text style={styles.playerTurnName}>{currentPlayer.name}</Text>
                <View style={styles.playerStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{currentPlayer.score}</Text>
                        <Text style={styles.statLabel}>Score</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{'❤️'.repeat(Math.max(0, currentPlayer?.lives ?? 3))}</Text>
                        <Text style={styles.statLabel}>Lives</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>🔥{currentPlayer.streak}</Text>
                        <Text style={styles.statLabel}>Streak</Text>
                    </View>
                </View>
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
            <Text style={styles.memoryTitle}>MEMORIZE!</Text>
            <Text style={styles.typeLabel}>{sequenceType.toUpperCase()}</Text>

            <View style={styles.sequenceContainer}>
                {originalSequence.map((item, index) => (
                    <AnimatedItem
                        key={index}
                        item={item}
                        index={index}
                        isInteractive={false}
                        animationDelay={index * 100}
                    />
                ))}
            </View>

            <View style={styles.roundBadge}>
                <Text style={styles.roundBadgeText}>{currentPlayer.name}</Text>
            </View>
        </View>
    );

    const renderFindChange = () => (
        <View style={styles.memoryContainer}>
            {/* Glitch overlay */}
            <Animated.View style={[styles.glitchOverlay, glitchOverlayStyle]} />

            <Animated.View style={[styles.contentWrapper, glitchStyle]}>
                <Text style={styles.changeTitle}>FIND THE CHANGE!</Text>

                {/* Timer with progress bar */}
                <View style={styles.timerSection}>
                    <Text style={[styles.timerText, timeLeft <= 1 && styles.timerUrgent]}>{timeLeft}s</Text>
                    <View style={styles.progressBar}>
                        <Animated.View style={[styles.progressFill, progressStyle]} />
                    </View>
                </View>

                {/* Combo indicator */}
                {currentPlayer.combo > 1 && (
                    <Animated.View style={[styles.comboIndicator, comboStyle]}>
                        <Text style={styles.comboText}>x{currentPlayer.combo} COMBO!</Text>
                    </Animated.View>
                )}

                <View style={styles.sequenceContainer}>
                    {modifiedSequence.map((item, index) => (
                        <AnimatedItem
                            key={index}
                            item={item}
                            index={index}
                            onPress={() => handleItemTap(index)}
                            isInteractive={true}
                            isSelected={selectedIndex === index}
                            isCorrect={selectedIndex === index ? isCorrect ?? undefined : undefined}
                            animationDelay={index * 50}
                        />
                    ))}
                </View>

                {/* Hint button */}
                {!hintUsed && (
                    <TouchableOpacity style={styles.hintButton} onPress={useHint}>
                        <Text style={styles.hintButtonText}>💡 HINT (-1 pt)</Text>
                    </TouchableOpacity>
                )}

                {/* Show hint indicator */}
                {hintIndex !== null && (
                    <Text style={styles.hintText}>Look at position {hintIndex + 1} 👀</Text>
                )}
            </Animated.View>

            {/* Floating scores */}
            {floatingScores.map(score => (
                <FloatingScoreAnim key={score.id} score={score} x={score.x} />
            ))}

            {/* Particles */}
            {particles.map(p => (
                <Particle key={p.id} delay={p.delay} startX={p.x} startY={p.y} />
            ))}
        </View>
    );

    const renderFeedback = () => (
        <LinearGradient
            colors={isCorrect ? ['#2ecc71', '#27ae60'] : ['#e74c3c', '#c0392b']}
            style={styles.feedbackContainer}
        >
            <Text style={styles.feedbackEmoji}>{isCorrect ? '✔️' : '❌'}</Text>
            <Text style={styles.feedbackText}>{isCorrect ? 'CORRECT!' : 'WRONG!'}</Text>

            {isCorrect && (
                <View style={styles.bonusContainer}>
                    {currentPlayer.streak >= 3 && (
                        <Text style={styles.bonusText}>🔥 STREAK x{currentPlayer.streak}!</Text>
                    )}
                    {currentPlayer.combo > 1 && (
                        <Text style={styles.bonusText}>⚡ COMBO x{currentPlayer.combo}!</Text>
                    )}
                </View>
            )}

            {!isCorrect && currentPlayer.lives <= 0 && (
                <Text style={styles.eliminatedText}>💀 ELIMINATED!</Text>
            )}

            <View style={styles.livesDisplay}>
                <Text style={styles.livesText}>Lives: {'❤️'.repeat(Math.max(0, currentPlayer.lives))}{'🖤'.repeat(Math.max(0, 3 - currentPlayer.lives))}</Text>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleNextPlayer}>
                <LinearGradient colors={['#3498db', '#2980b9']} style={styles.buttonGradient}>
                    <Text style={styles.continueButtonText}>NEXT</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Particles on correct */}
            {showParticles && particles.map(p => (
                <Particle key={p.id} delay={p.delay} startX={SCREEN_WIDTH / 2} startY={SCREEN_HEIGHT / 3} />
            ))}
        </LinearGradient>
    );

    const renderRoundEnd = () => {
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
        const activePlayers = sortedPlayers.filter(p => p.lives > 0);

        return (
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.phaseContainer}>
                <Text style={styles.phaseTitle}>🏆 Round {currentRound} Complete!</Text>

                <View style={styles.scoresContainer}>
                    {sortedPlayers.map((player, index) => (
                        <View key={player.id} style={[
                            styles.scoreRow,
                            player.lives <= 0 && styles.eliminatedRow
                        ]}>
                            <Text style={styles.scoreRank}>
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                            </Text>
                            <View style={styles.scorePlayerInfo}>
                                <Text style={styles.scorePlayerName}>{player.name}</Text>
                                <Text style={styles.scorePlayerStats}>
                                    🔥{player.streak} • ❤️{player.lives}
                                </Text>
                            </View>
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    phaseContainer: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
    phaseTitle: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginBottom: 15, textAlign: 'center' },

    // Progress dots
    roundProgress: { flexDirection: 'row', gap: 8, marginBottom: 25 },
    progressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.3)' },
    progressDotFilled: { backgroundColor: '#ffd32a' },
    progressDotCurrent: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#f093fb' },

    // Instructions
    instructionsBox: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 25, marginBottom: 25, width: '100%' },
    instructionText: { fontSize: 17, color: '#fff', marginBottom: 12, textAlign: 'center' },

    // Player card
    playerTurnCard: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 20, marginBottom: 25, width: '100%', alignItems: 'center', borderWidth: 2, borderColor: '#ffd32a' },
    playerTurnLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 5 },
    playerTurnName: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
    playerStats: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 22, fontWeight: 'bold', color: '#ffd32a' },
    statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 3 },

    // Memory phase
    memoryContainer: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center', padding: 20 },
    memoryTitle: { fontSize: 48, fontWeight: 'bold', color: '#f093fb', marginBottom: 10, textShadowColor: 'rgba(240,147,251,0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 },
    typeLabel: { fontSize: 16, color: '#667eea', marginBottom: 30, letterSpacing: 3 },
    changeTitle: { fontSize: 32, fontWeight: 'bold', color: '#f5576c', marginBottom: 15 },

    // Timer
    timerSection: { alignItems: 'center', marginBottom: 20 },
    timerText: { fontSize: 48, fontWeight: 'bold', color: '#fff' },
    timerUrgent: { color: '#e74c3c' },
    progressBar: { width: 200, height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginTop: 10, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: '#ffd32a', borderRadius: 3 },

    // Sequence items
    sequenceContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: SCREEN_WIDTH - 40 },
    sequenceItem: { width: 75, height: 75, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#667eea' },
    sequenceText: { fontSize: 36 },

    // Combo
    comboIndicator: { backgroundColor: '#f5576c', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginBottom: 15 },
    comboText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },

    // Hint
    hintButton: { marginTop: 25, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25 },
    hintButtonText: { fontSize: 14, color: '#ffd32a', fontWeight: 'bold' },
    hintText: { marginTop: 15, fontSize: 16, color: '#ffd32a', fontStyle: 'italic' },

    // Glitch
    glitchOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#f5576c' },
    contentWrapper: { alignItems: 'center' },

    // Floating score
    floatingScore: { position: 'absolute', top: '40%' },
    floatingScoreText: { fontSize: 36, fontWeight: 'bold' },

    // Particles
    particle: { position: 'absolute', width: 8, height: 8, borderRadius: 4 },

    // Badge
    roundBadge: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: '#ffd32a' },
    roundBadgeText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    // Feedback
    feedbackContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    feedbackEmoji: { fontSize: 100, marginBottom: 20 },
    feedbackText: { fontSize: 42, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
    bonusContainer: { marginBottom: 20 },
    bonusText: { fontSize: 22, fontWeight: 'bold', color: '#ffd32a', textAlign: 'center', marginBottom: 5 },
    eliminatedText: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    livesDisplay: { marginBottom: 30 },
    livesText: { fontSize: 20, color: '#fff' },

    // Scores
    scoresContainer: { width: '100%', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 15, marginBottom: 25 },
    scoreRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    eliminatedRow: { opacity: 0.5 },
    scoreRank: { fontSize: 24, width: 50 },
    scorePlayerInfo: { flex: 1 },
    scorePlayerName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    scorePlayerStats: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    scorePoints: { fontSize: 20, fontWeight: 'bold', color: '#f093fb' },

    // Button
    continueButton: { borderRadius: 30, overflow: 'hidden', width: '100%', elevation: 10 },
    buttonGradient: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
    continueButtonText: { fontSize: 22, fontWeight: 'bold', color: '#fff', letterSpacing: 1 },
});
