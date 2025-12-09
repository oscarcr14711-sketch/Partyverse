import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, CATEGORY_INFO, Difficulty, getRandomQuestions, TriviaQuestion } from '../data/trivia-questions-compact';

const { width, height } = Dimensions.get('window');
const buzzerImage = require('../assets/images/redbuzzer.png');

export default function BrainVsBrainGame() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const difficulty = (params.difficulty as Difficulty) || 'easy';

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [showingRoulette, setShowingRoulette] = useState(true);
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [buzzerPressed, setBuzzerPressed] = useState<1 | 2 | null>(null);
    const [showingAnswer, setShowingAnswer] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gamePhase, setGamePhase] = useState<'roulette' | 'question' | 'buzzer' | 'answer'>('roulette');

    const [questionsLoaded, setQuestionsLoaded] = useState<TriviaQuestion[]>([]);

    const rouletteAnim = useRef(new Animated.Value(0)).current;
    const buzzer1Anim = useRef(new Animated.Value(1)).current;
    const buzzer2Anim = useRef(new Animated.Value(1)).current;

    const questionCounts = { easy: 10, medium: 12, hard: 15 };
    const totalQuestions = questionCounts[difficulty];

    useEffect(() => {
        // Initialize questions with progressive difficulty
        const allCategories: Category[] = ['pop_culture', 'geography', 'science', 'art_literature', 'history', 'sports', 'music', 'mixed'];
        const gameQuestions: TriviaQuestion[] = [];

        // Progressive difficulty: first 1/3 easy, middle 1/3 medium, last 1/3 hard
        const easyCount = Math.ceil(totalQuestions / 3);
        const mediumCount = Math.ceil(totalQuestions / 3);
        const hardCount = totalQuestions - easyCount - mediumCount;

        const difficulties: Difficulty[] = [
            ...Array(easyCount).fill('easy'),
            ...Array(mediumCount).fill('medium'),
            ...Array(hardCount).fill('hard'),
        ];

        for (let i = 0; i < totalQuestions; i++) {
            const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
            const questionDifficulty = difficulties[i];
            const categoryQuestions = getRandomQuestions(randomCategory, questionDifficulty, 1);
            if (categoryQuestions.length > 0) {
                gameQuestions.push(categoryQuestions[0]);
            }
        }

        setQuestions(gameQuestions);
        setQuestionsLoaded(gameQuestions);
        // Start roulette with the loaded questions directly
        startRoulette(0, gameQuestions);
    }, []);

    const startRoulette = (questionIndex?: number, preloadedQuestions?: TriviaQuestion[]) => {
        setShowingRoulette(true);
        setGamePhase('roulette');

        // Reset animation value to 0 before starting
        rouletteAnim.setValue(0);

        // Use provided index or current index
        const idx = questionIndex ?? currentQuestionIndex;

        // Use preloaded questions if provided, otherwise use state
        const questionsList = preloadedQuestions || questions;

        // Spin animation
        Animated.timing(rouletteAnim, {
            toValue: 8,
            duration: 3000,
            useNativeDriver: true,
        }).start(() => {
            // Use the actual category from the question
            const question = questionsList[idx];
            if (question) {
                setCurrentCategory(question.category as Category);
            } else {
                // Fallback if question not loaded yet
                const categories: Category[] = ['pop_culture', 'geography', 'science', 'art_literature', 'history', 'sports', 'music', 'mixed'];
                const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
                setCurrentCategory(selectedCategory);
            }

            setTimeout(() => {
                setShowingRoulette(false);
                setGamePhase('question');
                setTimeLeft(15);
            }, 1000);
        });
    };

    useEffect(() => {
        if (gamePhase === 'question' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gamePhase === 'question') {
            handleNextQuestion();
        }
    }, [timeLeft, gamePhase]);

    const handleBuzzerPress = async (player: 1 | 2) => {
        if (buzzerPressed || gamePhase !== 'question') return;

        // Play buzzer sound
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/game/buzzer.mp3'),
                { shouldPlay: true, volume: 0.8 }
            );
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
            });
        } catch (e) { console.log('Buzzer sound error:', e); }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setBuzzerPressed(player);
        setGamePhase('buzzer');

        const anim = player === 1 ? buzzer1Anim : buzzer2Anim;
        Animated.sequence([
            Animated.timing(anim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    const handleAnswer = async (answerIndex: number) => {
        if (!buzzerPressed || !questions[currentQuestionIndex]) return;

        const correct = answerIndex === questions[currentQuestionIndex].correctIndex;

        // Play correct or wrong sound
        try {
            const soundFile = correct
                ? require('../assets/sounds/game/correct.mp3')
                : require('../assets/sounds/game/wrong.mp3');
            const { sound } = await Audio.Sound.createAsync(soundFile, { shouldPlay: true, volume: 0.8 });
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
            });
        } catch (e) { console.log('Answer sound error:', e); }

        if (correct) {
            if (buzzerPressed === 1) setPlayer1Score(s => s + 1);
            else setPlayer2Score(s => s + 1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            if (buzzerPressed === 1) setPlayer1Score(s => s - 1);
            else setPlayer2Score(s => s - 1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        setShowingAnswer(true);
        setGamePhase('answer');

        setTimeout(() => {
            handleNextQuestion();
        }, 2000);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex + 1 >= totalQuestions) {
            // Game over
            router.push({
                pathname: '/brain-vs-brain-game-over',
                params: {
                    player1Score,
                    player2Score,
                    difficulty,
                }
            });
        } else {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setBuzzerPressed(null);
            setShowingAnswer(false);
            startRoulette(nextIndex, questionsLoaded);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const categories: Category[] = ['pop_culture', 'geography', 'science', 'art_literature', 'history', 'sports', 'music', 'mixed'];

    return (
        <LinearGradient colors={['#0A1E3D', '#18304A']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Top Bar */}
                <View style={styles.topBar}>
                    <View style={styles.playerScore}>
                        <View style={[styles.playerScoreAvatar, { backgroundColor: '#E91E63' }]}>
                            <Text style={styles.playerScoreAvatarText}>P1</Text>
                        </View>
                        <Text style={styles.playerScoreText}>{player1Score}</Text>
                    </View>

                    <View style={styles.categoryDisplay}>
                        {currentCategory && (
                            <>
                                <Text style={styles.categoryIcon}>{CATEGORY_INFO[currentCategory].icon}</Text>
                                <Text style={styles.categoryName}>{CATEGORY_INFO[currentCategory].name}</Text>
                            </>
                        )}
                    </View>

                    <View style={styles.playerScore}>
                        <Text style={styles.playerScoreText}>{player2Score}</Text>
                        <View style={[styles.playerScoreAvatar, { backgroundColor: '#2196F3' }]}>
                            <Text style={styles.playerScoreAvatarText}>P2</Text>
                        </View>
                    </View>
                </View>

                {/* Question Progress */}
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }]} />
                    <Text style={styles.progressText}>{currentQuestionIndex + 1}/{totalQuestions}</Text>
                </View>

                {/* Timer */}
                {gamePhase === 'question' && (
                    <View style={styles.timerContainer}>
                        <Text style={[styles.timerText, timeLeft <= 5 && styles.timerWarning]}>{timeLeft}s</Text>
                    </View>
                )}

                {/* Main Content */}
                <View style={styles.mainContent}>
                    {showingRoulette ? (
                        <View style={styles.rouletteContainer}>
                            <Text style={styles.rouletteTitle}>SPINNING CATEGORY...</Text>
                            <View style={styles.rouletteWheel}>
                                {categories.map((cat, index) => (
                                    <Animated.View
                                        key={cat}
                                        style={[
                                            styles.rouletteItem,
                                            {
                                                opacity: rouletteAnim.interpolate({
                                                    inputRange: [index, index + 0.5, index + 1],
                                                    outputRange: [1, 0.5, 1],
                                                }),
                                            }
                                        ]}
                                    >
                                        <Text style={styles.rouletteIcon}>{CATEGORY_INFO[cat].icon}</Text>
                                        <Text style={styles.rouletteName}>{CATEGORY_INFO[cat].name}</Text>
                                    </Animated.View>
                                ))}
                            </View>
                        </View>
                    ) : currentQuestion ? (
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>{currentQuestion.question}</Text>

                            {gamePhase === 'buzzer' || gamePhase === 'answer' ? (
                                <View style={styles.answersGrid}>
                                    {currentQuestion.answers.map((answer, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.answerButton,
                                                showingAnswer && index === currentQuestion.correctIndex && styles.answerCorrect,
                                                showingAnswer && index !== currentQuestion.correctIndex && styles.answerWrong,
                                            ]}
                                            onPress={() => handleAnswer(index)}
                                            disabled={showingAnswer}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.answerLetter}>{String.fromCharCode(65 + index)}</Text>
                                            <Text style={styles.answerText}>{answer}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.waitingForBuzzer}>
                                    <Text style={styles.waitingText}>⚡ PRESS YOUR BUZZER! ⚡</Text>
                                </View>
                            )}
                        </View>
                    ) : null}
                </View>

                {/* Buzzers */}
                <View style={styles.buzzersContainer}>
                    <Animated.View style={{ transform: [{ scale: buzzer1Anim }] }}>
                        <TouchableOpacity
                            style={[styles.buzzer, styles.buzzer1, buzzerPressed === 1 && styles.buzzerActive]}
                            onPress={() => handleBuzzerPress(1)}
                            disabled={gamePhase !== 'question'}
                        >
                            <Image source={buzzerImage} style={styles.buzzerImage} />
                            <Text style={styles.buzzerLabel}>P1</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={{ transform: [{ scale: buzzer2Anim }] }}>
                        <TouchableOpacity
                            style={[styles.buzzer, styles.buzzer2, buzzerPressed === 2 && styles.buzzerActive]}
                            onPress={() => handleBuzzerPress(2)}
                            disabled={gamePhase !== 'question'}
                        >
                            <Image source={buzzerImage} style={styles.buzzerImage} />
                            <Text style={styles.buzzerLabel}>P2</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    playerScore: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    playerScoreAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFC107',
    },
    playerScoreAvatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    playerScoreText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFC107',
    },
    categoryDisplay: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFC107',
    },
    categoryIcon: {
        fontSize: 32,
    },
    categoryName: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 4,
    },
    progressBar: {
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 15,
        borderRadius: 15,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    progressFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#FFC107',
    },
    progressText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        zIndex: 1,
    },
    timerContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    timerWarning: {
        color: '#F44336',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    rouletteContainer: {
        alignItems: 'center',
    },
    rouletteTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFC107',
        marginBottom: 30,
    },
    rouletteWheel: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
    },
    rouletteItem: {
        width: width / 4 - 20,
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
    },
    rouletteIcon: {
        fontSize: 40,
    },
    rouletteName: {
        fontSize: 10,
        color: '#fff',
        textAlign: 'center',
        marginTop: 5,
    },
    questionContainer: {
        alignItems: 'center',
    },
    questionText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 32,
    },
    waitingForBuzzer: {
        padding: 40,
    },
    waitingText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFC107',
        textAlign: 'center',
    },
    answersGrid: {
        width: '100%',
        gap: 12,
    },
    answerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 15,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    answerCorrect: {
        backgroundColor: 'rgba(76, 175, 80, 0.3)',
        borderColor: '#4CAF50',
    },
    answerWrong: {
        backgroundColor: 'rgba(244, 67, 54, 0.3)',
        borderColor: '#F44336',
        opacity: 0.5,
    },
    answerLetter: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFC107',
        marginRight: 15,
        width: 30,
    },
    answerText: {
        fontSize: 18,
        color: '#fff',
        flex: 1,
    },
    buzzersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 10,
    },
    buzzer: {
        alignItems: 'center',
        opacity: 0.7,
    },
    buzzer1: {},
    buzzer2: {},
    buzzerActive: {
        opacity: 1,
    },
    buzzerImage: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    buzzerLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 5,
    },
});
