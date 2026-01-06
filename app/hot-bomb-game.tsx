
import Bomb3D from '@/components/Bomb3D';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Optional: remote audio URLs (set to valid URLs or keep null to disable)
const FUSE_SOUND_URL: string | null = null; // e.g., 'https://example.com/fuse-sizzle.mp3'
const EXPLOSION_SOUND_URL: string | null = null; // e.g., 'https://example.com/explosion.mp3'

export default function HotBombGameScreen() {
  // Detect if Lottie native view is available (Expo Go on iOS may not include it)
  const isLottieAvailable = (() => {
    try {
      // @ts-ignore
      const cfg = UIManager.getViewManagerConfig && UIManager.getViewManagerConfig('LottieAnimationView');
      return !!cfg;
    } catch {
      return false;
    }
  })();
  const router = useRouter();
  const params = useLocalSearchParams();
  const numPlayers = params.numPlayers ? parseInt(params.numPlayers as string) : 3;

  const [gameStarted, setGameStarted] = useState(true); // Start immediately
  const [timeLeft, setTimeLeft] = useState(15);
  const [totalTime] = useState(15);
  const [hasExploded, setHasExploded] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [showExplosion, setShowExplosion] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [explosionAnim] = useState<any>(require('../assets/animations/Cartoon explosion.json'));

  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const explosionOpacity = React.useRef(new Animated.Value(0)).current;
  const wickBurnAnim = React.useRef(new Animated.Value(0)).current;
  const breathAnim = React.useRef(new Animated.Value(0)).current;
  const shakeAnim = React.useRef(new Animated.Value(0)).current;
  const fuseSoundRef = React.useRef<Audio.Sound | null>(null);
  const explosionSoundRef = React.useRef<Audio.Sound | null>(null);

  // Start fuse sound on mount
  useEffect(() => {
    handleStartGame();
  }, []);

  useEffect(() => {
    let interval: any;
    if (gameStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 5) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
          return newTime;
        });
      }, 1000);
      Animated.timing(wickBurnAnim, {
        toValue: timeLeft === 0 ? 100 : ((totalTime - timeLeft) / totalTime) * 100,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else if (timeLeft === 0 && gameStarted) {
      triggerExplosion();
    }
    return () => clearInterval(interval);
  }, [gameStarted, timeLeft]);

  const triggerExplosion = () => {
    setHasExploded(true);
    setShowExplosion(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 100);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 200);

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 2, duration: 200, useNativeDriver: true }),
      Animated.timing(explosionOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      setShowExplosion(false);
      setGameStarted(false);
      setGameOver(true);
    }, 2000);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setTimeLeft(totalTime);
    setHasExploded(false);
    setAnimationKey(prev => prev + 1);
    scaleAnim.setValue(1);
    explosionOpacity.setValue(0);
    wickBurnAnim.setValue(0);

    if (FUSE_SOUND_URL) {
      (async () => {
        try {
          if (fuseSoundRef.current) {
            await fuseSoundRef.current.stopAsync();
            await fuseSoundRef.current.unloadAsync();
            fuseSoundRef.current = null;
          }
          const { sound } = await Audio.Sound.createAsync({ uri: FUSE_SOUND_URL }, { shouldPlay: true, isLooping: true, volume: 0.6 });
          fuseSoundRef.current = sound;
        } catch (e) { }
      })();
    }
  };

  const handleRestart = () => {
    setGameOver(false);
    handleStartGame();
  };

  const handleReturnToSetup = () => {
    router.back();
  };

  const handleReset = () => {
    handleRestart();
  };


  useEffect(() => {
    if (gameStarted && !hasExploded) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(breathAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      breathAnim.setValue(0);
    }
  }, [gameStarted, hasExploded]);

  useEffect(() => {
    if (gameStarted && !hasExploded && timeLeft <= 3 && timeLeft > 0) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: -1, duration: 40, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -1, duration: 80, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      shakeAnim.setValue(0);
    }
  }, [timeLeft, gameStarted, hasExploded]);

  useEffect(() => {
    return () => {
      (async () => {
        try {
          if (fuseSoundRef.current) {
            await fuseSoundRef.current.stopAsync();
            await fuseSoundRef.current.unloadAsync();
          }
          if (explosionSoundRef.current) {
            await explosionSoundRef.current.unloadAsync();
          }
        } catch { }
      })();
    };
  }, []);

  const breathScale = breathAnim.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.02] });
  const shakeX = shakeAnim.interpolate({ inputRange: [-1, 1], outputRange: [-6, 6] });

  return (
    <View style={{ flex: 1, backgroundColor: '#FFB300' }}>
      <LinearGradient
        colors={['#D84315', '#FF6F00', '#FFB300']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {gameOver ? (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
          <View style={styles.gameOverContainer}>
            <Image
              source={require('../assets/images/Circus.png')}
              style={styles.gameOverBoomImage}
              resizeMode="contain"
            />
            <Text style={styles.gameOverMessage}>Player with the bomb{"\n"}in hands is OUT!</Text>
            <View style={styles.gameOverButtonContainer}>
              <TouchableOpacity style={styles.gameOverButton} onPress={handleRestart}>
                <Text style={styles.gameOverButtonText}>Restart</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.gameOverButton, styles.gameOverButtonSecondary]} onPress={handleReturnToSetup}>
                <Text style={styles.gameOverButtonText}>Player Selection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      ) : (
        <>
          <ImageBackground
            source={require('../assets/images/citydestroyed.png')}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="white" />
              </TouchableOpacity>
              <View style={{ width: 28 }} />
            </View>
            <View style={styles.content}>
              <View style={styles.bombContainer}>
                <Animated.View style={[styles.bombWrapper, { transform: [{ translateX: shakeX }, { scale: breathScale }] }]}>
                  <Bomb3D
                    timeLeft={timeLeft}
                    totalTime={totalTime}
                    shakeIntensity={timeLeft <= 5 ? (5 - timeLeft) / 5 : 0}
                    size={300}
                  />
                </Animated.View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.buttonReset]} onPress={handleRestart}>
                  <Text style={styles.buttonText}>🔄 Restart</Text>
                </TouchableOpacity>
              </View>
            </View>
            {showExplosion && (
              <View style={styles.explosionOverlay} pointerEvents="none">
                {isLottieAvailable && explosionAnim ? (
                  <LottieView
                    key={`explosion-${animationKey}`}
                    source={explosionAnim}
                    autoPlay
                    loop={false}
                    style={styles.cartoonExplosionLottie}
                  />
                ) : (
                  <Text style={styles.explosionFallback}>💥</Text>
                )}
              </View>
            )}
          </SafeAreaView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ...existing styles above...
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  timerGradientOuter: {
    borderRadius: 40,
    padding: 6,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 20,
  },
  timerGradientInner: {
    borderRadius: 35,
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  timerLabel: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#333',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 20,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  instructionText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 15,
    marginTop: 0,
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStart: {
    backgroundColor: '#00FF00',
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonReset: {
    // Match start/player counter 3D style
    backgroundColor: '#263238',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#1a1f23',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFE0B2',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  // container already defined above, remove duplicate
  bombContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bombWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
  },
  spark: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  wickFlame: {
    marginBottom: 5,
    zIndex: 10,
  },
  flameEmoji: {
    fontSize: 24,
  },
  wickRope: {
    width: 6,
    height: 40,
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'column',
    backgroundColor: '#8B4513',
  },
  wickTrack: {
    position: 'relative',
    width: 20,
    alignItems: 'center',
  },
  wickBurned: {
    backgroundColor: '#2F2F2F',
    width: '100%',
  },
  wickRemaining: {
    backgroundColor: '#D2691E',
    width: '100%',
  },
  bombEmoji: {
    fontSize: 200,
    textShadowColor: 'rgba(255, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  bombImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  cityBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bombTimer: {
    position: 'absolute',
    bottom: 20,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF0000',
    textShadowColor: 'rgba(255, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  explosionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  explosionLottie: {
    width: 500,
    height: 500,
  },
  cartoonExplosionLottie: {
    width: 600,
    height: 600,
  },
  explosionFallback: {
    fontSize: 120,
    textShadowColor: '#FF0000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
  },
  warningText: {
    fontSize: 18,
    color: '#FF0000',
    fontWeight: 'bold',
    marginTop: 10,
  },
  // Setup screen styles
  setupContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  setupTitle: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFB300',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    fontFamily: Platform.select({ ios: 'Chalkduster', android: 'serif' }),
  },
  setupTitleImage: {
    width: 800,
    height: 300,
    marginBottom: 20,
  },
  setupTitleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFE082',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: -2, height: -2 },
    textShadowRadius: 4,
    fontFamily: Platform.select({ ios: 'Chalkduster', android: 'serif' }),
  },
  crackedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crackedCharContainer: {
    position: 'relative',
    marginHorizontal: 2,
  },
  setupBombContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupBombImage: {
    width: 280,
    height: 280,
  },
  setupTimerBadge: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#D84315',
  },
  setupTimerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#D84315',
  },
  playerAvatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginVertical: 20,
    flexWrap: 'wrap',
  },
  playerAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    overflow: 'hidden',
  },
  playerAvatarImage: {
    width: 90,
    height: 90,
  },
  playerAvatarImageAdjusted: {
    transform: [{ scale: 1.22 }],
  },
  playerCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#263238',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#1a1f23',
  },
  playerCounterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFE0B2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#D4A574',
  },
  playerCounterButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#263238',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  playerCounterText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFE0B2',
    minWidth: 140,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  setupStartButton: {
    backgroundColor: '#263238',
    borderRadius: 30,
    paddingHorizontal: 80,
    paddingVertical: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#1a1f23',
  },
  setupStartButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFE0B2',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  setupBackButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    marginTop: 20,
  },
  infoButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#263238',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#1a1f23',
  },
  infoButtonText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFE0B2',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  gameOverContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gameOverTitle: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FF6600',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
  },
  gameOverBoomImage: {
    width: 500,
    height: 300,
    marginBottom: 30,
  },
  gameOverMessage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFE0B2',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 42,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  gameOverButtonContainer: {
    width: '100%',
    gap: 20,
  },
  gameOverButton: {
    backgroundColor: '#263238',
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#1a1f23',
  },
  gameOverButtonSecondary: {
    backgroundColor: '#455A64',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 7,
    elevation: 9,
    borderBottomWidth: 4,
    borderBottomColor: '#2f3d44',
  },
  gameOverButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFE0B2',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#D84315', borderRadius: 20, maxHeight: '65%', borderWidth: 2, borderColor: '#FFB300' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,179,0,0.3)' },
  modalTitle: { color: '#FFB300', fontSize: 22, fontWeight: 'bold' },
  modalScroll: { padding: 20 },
  sectionTitle: { color: '#FFB300', fontSize: 18, fontWeight: 'bold', marginTop: 8, marginBottom: 5 },
  ruleText: { color: '#fff', fontSize: 15, lineHeight: 21, marginBottom: 6 },
});
