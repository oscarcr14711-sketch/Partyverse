import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Difficulty, getTrickyQuestions, TrickyQuestion } from '../data/tricky-questions';

const { width } = Dimensions.get('window');
const buzzerImage = require('../assets/images/redbuzzer.png');
const thinkBackground = require('../assets/images/think.png');

export default function BrainBuzzerGame() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const difficulty = (params.difficulty as Difficulty) || 'easy';

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState<TrickyQuestion[]>([]);
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [buzzerPressed, setBuzzerPressed] = useState<1 | 2 | null>(null);
    const [showingAnswer, setShowingAnswer] = useState(false);
    const [gamePhase, setGamePhase] = useState<'question' | 'buzzer' | 'answer'>('question');

    const buzzer1Anim = useRef(new Animated.Value(1)).current;
    const buzzer2Anim = useRef(new Animated.Value(1)).current;
    const lottieRef = useRef<LottieView>(null);

    const questionCounts = { easy: 5, medium: 5, hard: 5 };
    const totalQuestions = questionCounts[difficulty];

    useEffect(() => {
        // Initialize tricky questions
        const gameQuestions = getTrickyQuestions(difficulty, totalQuestions);
        setQuestions(gameQuestions);
    }, []);

    useEffect(() => {
        // Play Lottie animation when showing question
        if (gamePhase === 'question' && lottieRef.current) {
            lottieRef.current.play();
        }
    }, [gamePhase, currentQuestionIndex]);

    const handleBuzzerPress = (player: 1 | 2) => {
        if (buzzerPressed || gamePhase !== 'question') return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setBuzzerPressed(player);
        setGamePhase('buzzer');

        const anim = player === 1 ? buzzer1Anim : buzzer2Anim;
        Animated.sequence([
            Animated.timing(anim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    const handleAnswer = (answerIndex: number) => {
        if (!buzzerPressed || !questions[currentQuestionIndex]) return;

        const correct = answerIndex === questions[currentQuestionIndex].correctIndex;

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

        // Show explanation for a bit longer
        setTimeout(() => {
            handleNextQuestion();
        }, 4000);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex + 1 >= questions.length) {
            // Game over
            router.push({
                pathname: '/brain-buzzer-game-over',
                params: {
                    player1Score,
                    player2Score,
                    difficulty,
                }
            });
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setBuzzerPressed(null);
            setShowingAnswer(false);
            setGamePhase('question');
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <ImageBackground source={thinkBackground} style={styles.container} resizeMode="cover">
            <View style={styles.overlay}>
                <SafeAreaView style={styles.safeArea}>
                    {/* Top Bar */}
                    <View style={styles.topBar}>
                        <View style={styles.playerScore}>
                            <View style={[styles.playerScoreAvatar, { backgroundColor: '#E91E63' }]}>
                                <Text style={styles.playerScoreAvatarText}>P1</Text>
                            </View>
                            <Text style={styles.playerScoreText}>{player1Score}</Text>
                        </View>

                        <View style={styles.roundInfo}>
                            <Text style={styles.roundText}>Q: {currentQuestionIndex + 1}/{questions.length}</Text>
                            <Text style={styles.difficultyText}>{difficulty.toUpperCase()}</Text>
                        </View>

                        <View style={styles.playerScore}>
                            <Text style={styles.playerScoreText}>{player2Score}</Text>
                            <View style={[styles.playerScoreAvatar, { backgroundColor: '#2196F3' }]}>
                                <Text style={styles.playerScoreAvatarText}>P2</Text>
                            </View>
                        </View>
                    </View>

                    {/* Main Content */}
                    <View style={styles.mainContent}>
                        {currentQuestion ? (
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
                                            >
                                                <Text style={styles.answerLetter}>{String.fromCharCode(65 + index)}</Text>
                                                <Text style={styles.answerText}>{answer}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                ) : (
                                    <View style={styles.waitingForBuzzer}>
                                        <Text style={styles.waitingText}>⚡ PRESS BUZZER! ⚡</Text>
                                    </View>
                                )}

                                {showingAnswer && (
                                    <View style={styles.explanationContainer}>
                                        <Text style={styles.explanationTitle}>💡 DID YOU KNOW?</Text>
                                        <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <Text style={styles.loadingText}>Loading Tricky Questions...</Text>
                        )}
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

                        {/* Lottie Animation - Center */}
                        {gamePhase === 'question' && (
                            <View style={styles.lottieContainer}>
                                <LottieView
                                    ref={lottieRef}
                                    source={require('../assets/animations/Thinking.json')}
                                    style={styles.lottieAnimation}
                                    autoPlay
                                    loop
                                />
                            </View>
                        )}

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
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(13, 37, 63, 0.75)',
    },
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
        borderColor: '#FFE0B2',
    },
    playerScoreAvatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    playerScoreText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFE0B2',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    roundInfo: {
        backgroundColor: 'rgba(255, 224, 178, 0.15)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 224, 178, 0.3)',
    },
    roundText: {
        color: '#FFE0B2',
        fontWeight: 'bold',
        fontSize: 16,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    difficultyText: {
        color: '#FFE0B2',
        fontWeight: 'bold',
        fontSize: 12,
        marginTop: 2,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    questionContainer: {
        alignItems: 'center',
        width: '100%',
    },
    questionText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFE0B2',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 36,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 8,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    loadingText: {
        color: '#FFE0B2',
        fontSize: 18,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Medium' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    waitingForBuzzer: {
        padding: 40,
    },
    waitingText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFE0B2',
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    answersGrid: {
        width: '100%',
        gap: 12,
    },
    answerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 77, 64, 0.9)',
        padding: 15,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 224, 178, 0.3)',
    },
    answerCorrect: {
        backgroundColor: 'rgba(76, 175, 80, 0.9)',
        borderColor: '#4CAF50',
    },
    answerWrong: {
        backgroundColor: 'rgba(244, 67, 54, 0.6)',
        borderColor: '#F44336',
        opacity: 0.5,
    },
    answerLetter: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFE0B2',
        marginRight: 15,
        width: 30,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    answerText: {
        fontSize: 18,
        color: '#fff',
        flex: 1,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Medium' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    explanationContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: 'rgba(255, 224, 178, 0.2)',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 224, 178, 0.4)',
        width: '100%',
    },
    explanationTitle: {
        color: '#FFE0B2',
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 14,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    explanationText: {
        color: '#fff',
        fontSize: 16,
        fontStyle: 'italic',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Medium' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    buzzersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        color: '#FFE0B2',
        marginTop: 5,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    lottieContainer: {
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottieAnimation: {
        width: '100%',
        height: '100%',
    },
});
