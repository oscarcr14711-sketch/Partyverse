import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';

type GamePhase = 'instructions' | 'placement' | 'countdown' | 'photo-review' | 'round-end';
type GameMode = 'freeze' | 'hide' | 'chaos' | 'creep';

const GAME_MODES: { mode: GameMode; name: string; description: string; emoji: string }[] = [
    { mode: 'freeze', name: 'Freeze Mode', description: 'Freeze when countdown stops!', emoji: '🥶' },
    { mode: 'hide', name: 'Hide Mode', description: '3 seconds to hide!', emoji: '🙈' },
    { mode: 'chaos', name: 'Chaos Mode', description: 'Total confusion!', emoji: '🌪️' },
    { mode: 'creep', name: 'Creep Mode', description: 'Camera zooms in...', emoji: '👁️' },
];

interface Player {
    id: number;
    name: string;
    avatarIndex: number;
    strikes: number;
    caughtInRounds: number[];
}

export default function DontLetItPicYouGame() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const cameraRef = useRef<CameraView>(null);

    const initialPlayers: Player[] = JSON.parse(params.players as string || '[]').map((p: any) => ({
        ...p,
        strikes: 0,
        caughtInRounds: [],
    }));
    const numRounds = parseInt(params.numRounds as string) || 5;
    const cameraType: CameraType = (params.cameraType as string) === 'front' ? 'front' : 'back';

    const [permission, requestPermission] = useCameraPermissions();
    const [currentPhase, setCurrentPhase] = useState<GamePhase>('instructions');
    const [currentRound, setCurrentRound] = useState(1);
    const [currentMode, setCurrentMode] = useState<GameMode>('freeze');
    const [players, setPlayers] = useState<Player[]>(initialPlayers);
    const [countdownText, setCountdownText] = useState('');
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [detectedFaces, setDetectedFaces] = useState<number>(0);
    const [isCapturing, setIsCapturing] = useState(false);

    const flashAnim = useRef(new Animated.Value(0)).current;
    const zoomAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Select mode for current round
    useEffect(() => {
        const modeIndex = (currentRound - 1) % GAME_MODES.length;
        setCurrentMode(GAME_MODES[modeIndex].mode);
    }, [currentRound]);

    // Request camera permissions
    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    const startCountdown = async () => {
        setCurrentPhase('countdown');

        if (currentMode === 'freeze') {
            await freezeModeCountdown();
        } else if (currentMode === 'hide') {
            await hideModeCountdown();
        } else if (currentMode === 'chaos') {
            await chaosModeCountdown();
        } else if (currentMode === 'creep') {
            await creepModeCountdown();
        }
    };

    const freezeModeCountdown = async () => {
        const delays = [1000, 1200, 1500, 800, 2000];
        const randomDelay = delays[Math.floor(Math.random() * delays.length)];

        setCountdownText('3');
        await sleep(1000);
        setCountdownText('2');
        await sleep(1000);
        setCountdownText('1');
        await sleep(randomDelay);
        setCountdownText('FREEZE!');
        await sleep(500);
        await capturePhoto();
    };

    const hideModeCountdown = async () => {
        setCountdownText('GET READY...');
        await sleep(2000);
        setCountdownText('3');
        await sleep(1000);
        setCountdownText('2');
        await sleep(1000);
        setCountdownText('1');
        await sleep(1000);
        setCountdownText('HIDE NOW!');
        await sleep(500);
        await capturePhoto();
    };

    const chaosModeCountdown = async () => {
        const fakeOuts = [
            ['3', '2', 'JUST KIDDING!'],
            ['READY?', 'SET...', 'NOT YET!'],
            ['5', '4', '3', 'NOPE!'],
        ];
        const randomFake = fakeOuts[Math.floor(Math.random() * fakeOuts.length)];

        for (const text of randomFake) {
            setCountdownText(text);
            await sleep(800);
        }

        await sleep(Math.random() * 2000 + 1000);
        setCountdownText('NOW!');
        await sleep(300);
        await capturePhoto();
    };

    const creepModeCountdown = async () => {
        setCountdownText('STAY STILL...');

        // Zoom animation
        Animated.timing(zoomAnim, {
            toValue: 1.5,
            duration: 3000,
            useNativeDriver: true,
        }).start();

        await sleep(3000);
        setCountdownText('SNAP!');
        await sleep(200);
        await capturePhoto();

        // Reset zoom
        zoomAnim.setValue(1);
    };

    const capturePhoto = async () => {
        if (!cameraRef.current || isCapturing) return;

        setIsCapturing(true);

        try {
            // Flash effect
            Animated.sequence([
                Animated.timing(flashAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
                Animated.timing(flashAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]).start();

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Vibration.vibrate(200);

            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                base64: false,
            });

            if (photo) {
                setCapturedPhoto(photo.uri);
                // Simulate face detection (random 0-3 faces for now)
                const facesDetected = Math.floor(Math.random() * 4);
                setDetectedFaces(facesDetected);

                // Update player strikes
                if (facesDetected > 0) {
                    const updatedPlayers = players.map(p => ({
                        ...p,
                        strikes: p.strikes + 1,
                        caughtInRounds: [...p.caughtInRounds, currentRound],
                    }));
                    setPlayers(updatedPlayers);
                }

                setCurrentPhase('photo-review');
            }
        } catch (error) {
            console.error('Error capturing photo:', error);
        } finally {
            setIsCapturing(false);
        }
    };

    const handleNextRound = () => {
        if (currentRound < numRounds) {
            setCurrentRound(currentRound + 1);
            setCapturedPhoto(null);
            setDetectedFaces(0);
            setCountdownText('');
            setCurrentPhase('placement');
        } else {
            // Game over
            router.push({
                pathname: '/dont-let-it-pic-you-game-over',
                params: {
                    players: JSON.stringify(players),
                }
            });
        }
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Render different phases
    const renderInstructions = () => (
        <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460']}
            style={styles.phaseContainer}
        >
            <Text style={styles.phaseTitle}>🕵️ MISSION BRIEFING</Text>

            <View style={styles.instructionsBox}>
                <Text style={styles.instructionText}>Move around… but don't get caught.</Text>
                <Text style={styles.instructionText}>The camera will take a photo at a random moment.</Text>
                <Text style={styles.instructionText}>Be fast. Be sneaky. 🤫</Text>
            </View>

            <View style={styles.modeCard}>
                <Text style={styles.modeEmoji}>{GAME_MODES.find(m => m.mode === currentMode)?.emoji}</Text>
                <Text style={styles.modeName}>{GAME_MODES.find(m => m.mode === currentMode)?.name}</Text>
                <Text style={styles.modeDescription}>{GAME_MODES.find(m => m.mode === currentMode)?.description}</Text>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={() => setCurrentPhase('placement')}>
                <LinearGradient colors={['#e74c3c', '#c0392b']} style={styles.buttonGradient}>
                    <Text style={styles.continueButtonText}>CONTINUE</Text>
                </LinearGradient>
            </TouchableOpacity>
        </LinearGradient>
    );

    const renderPlacement = () => (
        <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460']}
            style={styles.phaseContainer}
        >
            <Text style={styles.phaseTitle}>📱 PHONE PLACEMENT</Text>

            <View style={styles.placementBox}>
                <Ionicons name="phone-portrait" size={80} color="#ffd32a" />
                <Text style={styles.placementText}>Place the phone in a stable position:</Text>
                <Text style={styles.placementOption}>• On a table</Text>
                <Text style={styles.placementOption}>• Leaning against a cup</Text>
                <Text style={styles.placementOption}>• Held by someone</Text>
            </View>

            <Text style={styles.placementHint}>
                Make sure the camera can see the playing area!
            </Text>

            <TouchableOpacity style={styles.continueButton} onPress={startCountdown}>
                <LinearGradient colors={['#2ecc71', '#27ae60']} style={styles.buttonGradient}>
                    <Text style={styles.continueButtonText}>START ROUND {currentRound}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </LinearGradient>
    );

    const renderCountdown = () => {
        if (!permission?.granted) {
            return (
                <View style={styles.phaseContainer}>
                    <Text style={styles.errorText}>Camera permission required</Text>
                    <TouchableOpacity style={styles.continueButton} onPress={requestPermission}>
                        <Text style={styles.continueButtonText}>Grant Permission</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.cameraContainer}>
                <Animated.View style={[styles.cameraView, { transform: [{ scale: zoomAnim }] }]}>
                    <CameraView
                        ref={cameraRef}
                        style={styles.camera}
                        facing={cameraType}
                    />
                </Animated.View>

                <Animated.View style={[styles.flashOverlay, { opacity: flashAnim }]} />

                <View style={styles.countdownOverlay}>
                    <Animated.Text style={[styles.countdownText, { transform: [{ scale: pulseAnim }] }]}>
                        {countdownText}
                    </Animated.Text>
                </View>

                <View style={styles.roundBadge}>
                    <Text style={styles.roundBadgeText}>Round {currentRound}/{numRounds}</Text>
                </View>
            </View>
        );
    };

    const renderPhotoReview = () => (
        <View style={styles.phaseContainer}>
            <Text style={styles.phaseTitle}>📸 PHOTO CAPTURED!</Text>

            {capturedPhoto && (
                <View style={styles.photoContainer}>
                    <Image source={{ uri: capturedPhoto }} style={styles.capturedPhoto} />
                    {detectedFaces > 0 && (
                        <View style={styles.faceDetectionOverlay}>
                            {[...Array(detectedFaces)].map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.faceCircle,
                                        {
                                            left: `${20 + i * 25}%`,
                                            top: `${30 + i * 15}%`,
                                        }
                                    ]}
                                />
                            ))}
                        </View>
                    )}
                </View>
            )}

            <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>
                    {detectedFaces === 0 ? '✅ NOBODY CAUGHT!' : `❌ ${detectedFaces} FACE${detectedFaces > 1 ? 'S' : ''} DETECTED!`}
                </Text>
                <Text style={styles.resultSubtitle}>
                    {detectedFaces === 0 ? 'Perfect round! Everyone escaped!' : `${detectedFaces} player${detectedFaces > 1 ? 's' : ''} got caught!`}
                </Text>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleNextRound}>
                <LinearGradient colors={['#3498db', '#2980b9']} style={styles.buttonGradient}>
                    <Text style={styles.continueButtonText}>
                        {currentRound < numRounds ? 'NEXT ROUND' : 'VIEW RESULTS'}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {currentPhase === 'instructions' && renderInstructions()}
            {currentPhase === 'placement' && renderPlacement()}
            {currentPhase === 'countdown' && renderCountdown()}
            {currentPhase === 'photo-review' && renderPhotoReview()}
        </View>
    );
}

const { width, height } = Dimensions.get('window');

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
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    instructionsBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 30,
        marginBottom: 30,
        borderWidth: 2,
        borderColor: 'rgba(255, 211, 42, 0.3)',
    },
    instructionText: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 15,
        textAlign: 'center',
        lineHeight: 26,
    },
    modeCard: {
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 2,
        borderColor: '#e74c3c',
        width: '100%',
    },
    modeEmoji: {
        fontSize: 60,
        marginBottom: 10,
    },
    modeName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    modeDescription: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
    placementBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    placementText: {
        fontSize: 18,
        color: '#fff',
        marginTop: 20,
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    placementOption: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 8,
    },
    placementHint: {
        fontSize: 14,
        color: '#ffd32a',
        marginBottom: 30,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    cameraContainer: {
        flex: 1,
        position: 'relative',
    },
    cameraView: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    flashOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
    },
    countdownOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    countdownText: {
        fontSize: 80,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 10,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
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
    photoContainer: {
        width: width - 40,
        height: (width - 40) * 1.33,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#ffd32a',
        position: 'relative',
    },
    capturedPhoto: {
        width: '100%',
        height: '100%',
    },
    faceDetectionOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    faceCircle: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#ffd32a',
        backgroundColor: 'rgba(255, 211, 42, 0.2)',
    },
    resultCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 25,
        marginBottom: 30,
        width: '100%',
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    resultSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    errorText: {
        fontSize: 18,
        color: '#e74c3c',
        marginBottom: 20,
        textAlign: 'center',
    },
});
