import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Image, UIManager, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';
// Optional: remote audio URLs (set to valid URLs or keep null to disable)
const FUSE_SOUND_URL: string | null = null; // e.g., 'https://example.com/fuse-sizzle.mp3'
const EXPLOSION_SOUND_URL: string | null = null; // e.g., 'https://example.com/explosion.mp3'

// Confetti particle component
const Confetti = ({ delay }: { delay: number }) => {
  const animY = React.useRef(new Animated.Value(-20)).current;
  const animX = React.useRef(new Animated.Value(Math.random() * 400 - 200)).current;
  const animRotate = React.useRef(new Animated.Value(0)).current;
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF006E', '#FFA500', '#00FF00', '#FF1493'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(animY, {
          toValue: 800,
          duration: 4000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animRotate, {
          toValue: 360,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotate = animRotate.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          backgroundColor: color,
          left: Math.random() * 400,
          transform: [{ translateY: animY }, { translateX: animX }, { rotate }],
        },
      ]}
    />
  );
};


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
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [totalTime] = useState(15);
  const [hasExploded, setHasExploded] = useState(false);
  
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const explosionOpacity = React.useRef(new Animated.Value(0)).current;
  const wickBurnAnim = React.useRef(new Animated.Value(0)).current;
  // New animation refs for breathing and shaking
  const breathAnim = React.useRef(new Animated.Value(0)).current; // 0..1 -> scale 0.98..1.02
  const shakeAnim = React.useRef(new Animated.Value(0)).current; // -1..1 -> translateX
  const crackOpacity = React.useRef(new Animated.Value(0)).current; // 0..1 flicker near end
  const bgPulse = React.useRef(new Animated.Value(0)).current; // background danger pulse
  // Audio refs
  const fuseSoundRef = React.useRef<Audio.Sound | null>(null);
  const explosionSoundRef = React.useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let interval: any;
    if (gameStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          // Trigger haptic feedback as time gets lower
          if (newTime <= 5) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
          return newTime;
        });
      }, 1000);
      // Wick burn progress value (kept for future visual effects if needed)
      Animated.timing(wickBurnAnim, {
        toValue: timeLeft === 0 ? 100 : ((totalTime - timeLeft) / totalTime) * 100,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else if (timeLeft === 0 && gameStarted) {
      // Bomb explodes!
      triggerExplosion();
    }

    return () => clearInterval(interval);
  }, [gameStarted, timeLeft]);

  const triggerExplosion = () => {
    setGameStarted(false);
    setHasExploded(true);
    
    // Multiple intense haptic pulses
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 100);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 200);
    
    // Explosion animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 2, duration: 200, useNativeDriver: true }),
      Animated.timing(explosionOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      handleReset();
    }, 2000);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setTimeLeft(totalTime);
    setHasExploded(false);
    scaleAnim.setValue(1);
    explosionOpacity.setValue(0);
    wickBurnAnim.setValue(0);
    // Start fuse sound if URL provided
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
        } catch (e) {
          // ignore load errors silently
        }
      })();
    }
  };

  const handleReset = () => {
    setGameStarted(false);
    setTimeLeft(totalTime);
    setHasExploded(false);
    scaleAnim.setValue(1);
    explosionOpacity.setValue(0);
    wickBurnAnim.setValue(0);
    // Stop/unload fuse sound
    (async () => {
      try {
        if (fuseSoundRef.current) {
          await fuseSoundRef.current.stopAsync();
          await fuseSoundRef.current.unloadAsync();
          fuseSoundRef.current = null;
        }
      } catch {}
    })();
  };

  // Breathing animation (subtle pulse while running)
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

  // Shake animation in the last 3 seconds
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

  // Cleanup sounds on unmount
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
        } catch {}
      })();
    };
  }, []);

  // Cracks flicker and background pulse in final seconds
  useEffect(() => {
    if (gameStarted && !hasExploded && timeLeft <= 3 && timeLeft > 0) {
      const crackLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(crackOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
          Animated.timing(crackOpacity, { toValue: 0.4, duration: 180, useNativeDriver: true }),
        ])
      );
      const bgLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(bgPulse, { toValue: 1, duration: 220, useNativeDriver: true }),
          Animated.timing(bgPulse, { toValue: 0, duration: 220, useNativeDriver: true }),
        ])
      );
      crackLoop.start();
      bgLoop.start();
      return () => {
        crackLoop.stop();
        bgLoop.stop();
      };
    } else {
      crackOpacity.setValue(0);
      bgPulse.setValue(0);
    }
  }, [timeLeft, gameStarted, hasExploded]);

  // Determine color gradient based on time remaining
  const getGradientColors = (): [string, string] => {
    const percentage = timeLeft / totalTime;
    if (percentage > 0.66) return ['#00FF00', '#00AA00']; // Green
    if (percentage > 0.33) return ['#FFFF00', '#FF8800']; // Yellow to Orange
    return ['#FF0000', '#AA0000']; // Red
  };

  const timerPercentage = (timeLeft / totalTime) * 100;
  const breathScale = breathAnim.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.02] });
  const shakeX = shakeAnim.interpolate({ inputRange: [-1, 1], outputRange: [-6, 6] });
  const bgPulseOpacity = bgPulse.interpolate({ inputRange: [0, 1], outputRange: [0, 0.35] });
  const burnedRatio = (totalTime - timeLeft) / totalTime;

  // Lottie progress mapped from existing wickBurnAnim (0..100 -> 0..1)
  const lottieProgress = wickBurnAnim.interpolate({ inputRange: [0, 100], outputRange: [0, 1] });

  return (
    <LinearGradient
      colors={['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF006E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Animated Confetti */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Confetti key={i} delay={i} />
      ))}

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
            <Text style={styles.title}>🔥 Hot Bomb</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          {!gameStarted ? (
            <>
              <View style={styles.timerContainer}>
                <LinearGradient
                  colors={getGradientColors()}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={[styles.timerGradientOuter, { shadowColor: getGradientColors()[0] }]}
                >
                  <LinearGradient
                    colors={getGradientColors()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.timerGradientInner}
                  >
                    <Text style={styles.timerText}>{timeLeft}</Text>
                    <Text style={styles.timerLabel}>seconds</Text>
                  </LinearGradient>
                </LinearGradient>
                <View style={styles.progressBarContainer}>
                  <LinearGradient
                    colors={getGradientColors()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressBar, { width: `${timerPercentage}%` }]}
                  />
                </View>
              </View>
              <Text style={styles.instructionText}>🎮 Tap Start to begin</Text>
            </>
          ) : (
            <>
              <View style={styles.bombContainer}>
                <Animated.View style={[styles.bombWrapper, { transform: [{ translateX: shakeX }, { scale: breathScale }] }]}>
                  {isLottieAvailable ? (
                    <LottieView
                      source={require('../assets/animations/bomb.json')}
                      style={{ width: 260, height: 260 }}
                      progress={(totalTime - timeLeft) / totalTime}
                      autoPlay={false}
                      loop={false}
                    />
                  ) : (
                    <Image
                      source={require('../assets/images/bomb1.png')}
                      style={{ width: 260, height: 260, resizeMode: 'contain' }}
                    />
                  )}
                </Animated.View>
                
                {/* Cracks overlay when time is low */}
                {timeLeft <= 3 && (
                  <Animated.View style={[styles.cracksLayer, { opacity: crackOpacity }]} pointerEvents="none">
                    <View style={[styles.crack, { top: 95, left: 70, width: 60, transform: [{ rotate: '18deg' }] }]} />
                    <View style={[styles.crack, { top: 115, left: 110, width: 40, transform: [{ rotate: '-12deg' }] }]} />
                    <View style={[styles.crack, { top: 135, left: 80, width: 55, transform: [{ rotate: '6deg' }] }]} />
                  </Animated.View>
                )}

                <Animated.View
                  style={[
                    styles.explosionEffect,
                    {
                      opacity: explosionOpacity,
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  <Text style={styles.explosionText}>💥 BOOM! 💥</Text>
                </Animated.View>
                <Text style={styles.bombTimer}>{timeLeft}s</Text>
              </View>
              <Text style={styles.instructionText}>⚠️ PASS THE PHONE!</Text>
              <Text style={styles.warningText}>{timeLeft <= 5 ? '🔴 HURRY UP!' : `${timeLeft} seconds left`}</Text>
            </>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, gameStarted ? styles.buttonDisabled : styles.buttonStart]}
              onPress={handleStartGame}
              disabled={gameStarted}
            >
              <Text style={styles.buttonText}>{gameStarted ? '⏸️ Running...' : '▶️ Start Game'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonReset]} onPress={handleReset}>
              <Text style={styles.buttonText}>🔄 Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      {/* Background danger pulse overlay */}
      {gameStarted && timeLeft <= 3 && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FF0000',
            opacity: bgPulseOpacity,
          }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    top: -20,
  },
  header: {
    flexDirection: 'row',
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
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 50,
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
    justifyContent: 'space-around',
    width: '100%',
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
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
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  bombContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    position: 'relative',
    height: 350,
  },
  bombWrapper: {
    alignItems: 'center',
  },
  wickContainer: {
    alignItems: 'center',
    marginBottom: 10,
    height: 60,
  },
  sparkContainer: {
    position: 'absolute',
    top: 0,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
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
  cracksLayer: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: 75,
    left: '50%',
    marginLeft: -100,
    overflow: 'hidden',
  },
  crack: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#FFEEEE',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
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
  explosionEffect: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  explosionText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FF6600',
    textShadowColor: '#FF0000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  warningText: {
    fontSize: 18,
    color: '#FF0000',
    fontWeight: 'bold',
    marginTop: 10,
  },
});
