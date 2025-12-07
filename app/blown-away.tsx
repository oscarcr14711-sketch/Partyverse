import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MAX_BALLOON_SIZE = 500; // Size at which balloon pops
const MIN_BALLOON_SIZE = 100;
const BLOW_THRESHOLD = -40; // Audio level threshold (more sensitive)

export default function BlownAwayScreen() {
  const router = useRouter();
  const [showSetup, setShowSetup] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [numPlayers, setNumPlayers] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [balloonSize, setBalloonSize] = useState(MIN_BALLOON_SIZE);
  const [hasPopped, setHasPopped] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerScores, setPlayerScores] = useState<{ [key: number]: { score: number; balloons: number[] } }>({});
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20); // 20 seconds per round
  const [roundInflated, setRoundInflated] = useState(0); // Current round inflated count
  const [roundPopped, setRoundPopped] = useState(0); // Current round popped count
  const [roundScore, setRoundScore] = useState(0); // Current round total score
  const [roundBalloons, setRoundBalloons] = useState<number[]>([]); // Sizes of balloons inflated this round

  const balloonScale = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const popOpacity = useRef(new Animated.Value(0)).current;
  const recordingRef = useRef<Audio.Recording | null>(null);

  // Request microphone permissions and start listening
  const startListening = async () => {
    try {
      // Stop and unload any existing recording first from both state and ref
      const currentRecording = recordingRef.current || recording;
      if (currentRecording) {
        try {
          await currentRecording.stopAndUnloadAsync();
        } catch (e) {
          console.log('Error stopping existing recording:', e);
        }
      }

      // Clear both state and ref
      recordingRef.current = null;
      setRecording(null);
      setIsListening(false);

      // Wait longer to ensure complete cleanup
      await new Promise(resolve => setTimeout(resolve, 400));

      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        alert('Microphone permission is required to play this game!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          if (status.isRecording && status.metering !== undefined) {
            const audioLevel = status.metering; // Raw metering value (-160 to 0)

            // Only inflate if audio level is above threshold (louder = more negative number becomes less negative)
            if (audioLevel > BLOW_THRESHOLD && !hasPopped) {
              // Calculate inflation amount based on how loud the blow is
              const blowStrength = Math.max(0, (audioLevel - BLOW_THRESHOLD) / 10);

              setBalloonSize((prev) => {
                const newSize = Math.min(MAX_BALLOON_SIZE, prev + blowStrength * 2);
                if (newSize >= MAX_BALLOON_SIZE) {
                  popBalloon();
                  return MAX_BALLOON_SIZE;
                }
                if (newSize > MAX_BALLOON_SIZE * 0.7) {
                  Animated.sequence([
                    Animated.timing(shakeAnim, { toValue: -8, duration: 30, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue: 0, duration: 30, useNativeDriver: true }),
                  ]).start();
                }
                return newSize;
              });
            }
          }
        },
        100 // Update every 100ms
      );

      recordingRef.current = newRecording;
      setRecording(newRecording);
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      alert('Failed to start recording. Please try again.');
    }
  };

  const stopListening = async () => {
    const currentRecording = recordingRef.current || recording;
    if (currentRecording) {
      try {
        await currentRecording.stopAndUnloadAsync();
        recordingRef.current = null;
        setRecording(null);
        setIsListening(false);
      } catch (err) {
        console.error('Failed to stop recording', err);
      }
    }
  };

  const popBalloon = async () => {
    setHasPopped(true);
    await stopListening();
    setRoundPopped((prev) => prev + 1);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Animated.parallel([
      Animated.timing(balloonScale, { toValue: 1.5, duration: 100, useNativeDriver: true }),
      Animated.timing(popOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      Animated.timing(balloonScale, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    });
    // Reset balloon for next attempt in same round
    setTimeout(async () => {
      setBalloonSize(MIN_BALLOON_SIZE);
      setHasPopped(false);
      balloonScale.setValue(1);
      popOpacity.setValue(0);
      if (timeLeft > 0) {
        await new Promise(resolve => setTimeout(resolve, 400));
        startListening();
      }
    }, 1000);
  };

  const handleStartTurn = () => {
    setGameStarted(true);
    setBalloonSize(MIN_BALLOON_SIZE);
    setHasPopped(false);
    setTimeLeft(20);
    setRoundInflated(0);
    setRoundPopped(0);
    setRoundScore(0);
    setRoundBalloons([]);
    balloonScale.setValue(1);
    popOpacity.setValue(0);
    startListening();
  };

  const handleStopBlowing = async () => {
    if (!hasPopped) {
      await stopListening();
      const points = Math.round(balloonSize);
      setRoundInflated((prev) => prev + 1);
      setRoundScore((prev) => prev + points);
      setRoundBalloons((prev) => [...prev, points]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Reset balloon for next attempt in same round
      setBalloonSize(MIN_BALLOON_SIZE);
      setHasPopped(false);
      balloonScale.setValue(1);
      popOpacity.setValue(0);
      if (timeLeft > 0) {
        await new Promise(resolve => setTimeout(resolve, 400));
        startListening();
      }
    }
  };

  // Timer effect for each round
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (gameStarted && timeLeft === 0) {
      stopListening();
      setGameStarted(false);
      // Save round stats and move to next player
      setPlayerScores((prev) => ({
        ...prev,
        [currentPlayer]: { score: roundScore, balloons: roundBalloons },
      }));
      // Check if all players finished
      if (currentPlayer >= numPlayers) {
        setTimeout(() => {
          setShowResults(true);
        }, 1500);
      } else {
        setTimeout(() => {
          nextPlayer();
        }, 1500);
      }
    }
  }, [gameStarted, timeLeft]);

  const nextPlayer = () => {
    setCurrentPlayer((prev) => prev + 1);
    setBalloonSize(MIN_BALLOON_SIZE);
    setHasPopped(false);
    setGameStarted(false);
    setRoundInflated(0);
    setRoundPopped(0);
    setRoundScore(0);
    setRoundBalloons([]);
    balloonScale.setValue(1);
    popOpacity.setValue(0);
  };

  const handleReset = () => {
    stopListening();
    setCurrentPlayer(1);
    setPlayerScores({});
    setBalloonSize(MIN_BALLOON_SIZE);
    setHasPopped(false);
    setGameStarted(false);
    setRoundInflated(0);
    setRoundPopped(0);
    setRoundScore(0);
    setRoundBalloons([]);
    balloonScale.setValue(1);
    popOpacity.setValue(0);
  };

  // Determine winner (highest total score)
  const getWinner = () => {
    const scores = Object.entries(playerScores);
    if (scores.length === 0) return null;

    const winner = scores.reduce((max, current) =>
      current[1].score > max[1].score ? current : max
    );

    return { player: parseInt(winner[0]), score: winner[1].score };
  };

  const winner = getWinner();

  // Cleanup recording on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  // Breathing animation for balloon - only when not actively blowing
  useEffect(() => {
    if (gameStarted && !hasPopped && balloonSize > MIN_BALLOON_SIZE && !isListening) {
      const breathe = Animated.loop(
        Animated.sequence([
          Animated.timing(balloonScale, { toValue: 1.03, duration: 400, useNativeDriver: true }),
          Animated.timing(balloonScale, { toValue: 0.97, duration: 400, useNativeDriver: true }),
        ])
      );
      breathe.start();
      return () => breathe.stop();
    } else {
      balloonScale.setValue(1);
    }
  }, [gameStarted, hasPopped, balloonSize, isListening]);

  const getBalloonColor = () => {
    const percentage = balloonSize / MAX_BALLOON_SIZE;
    if (percentage < 0.5) return '#4A90E2'; // Blue
    if (percentage < 0.7) return '#F5A623'; // Orange
    return '#E74C3C'; // Red (danger)
  };

  if (showSetup) {
    return (
      <LinearGradient
        colors={['#5DADE2', '#5DADE2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.setupContainer}>
            <View style={styles.setupTopSection}>
              <Image
                source={require('../assets/images/Blownavatar.png')}
                style={styles.setupTitleImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.setupMiddleSection}>
              <View style={styles.playerAvatarsContainer}>
                {Array.from({ length: Math.min(numPlayers, 6) }, (_, i) => {
                  const avatarImages = [
                    require('../assets/images/avatars/avatar1.png'),
                    require('../assets/images/avatars/avatar2.png'),
                    require('../assets/images/avatars/avatar3.png'),
                    require('../assets/images/avatars/avatar4.png'),
                    require('../assets/images/avatars/avatar5.png'),
                    require('../assets/images/avatars/avatar6.png'),
                  ];
                  return (
                    <View key={i} style={styles.playerAvatar}>
                      <Image
                        source={avatarImages[i]}
                        style={[styles.playerAvatarImage, i === 5 && styles.playerAvatarImageAdjusted]}
                        resizeMode={i === 5 ? 'cover' : 'contain'}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
            <View style={styles.setupBottomSection}>
              <View style={styles.playerCounterContainer}>
                <TouchableOpacity
                  style={styles.playerCounterButton}
                  onPress={() => setNumPlayers(Math.max(2, numPlayers - 1))}
                >
                  <Text style={styles.playerCounterButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.playerCounterText}>{numPlayers} Players</Text>
                <TouchableOpacity
                  style={styles.playerCounterButton}
                  onPress={() => setNumPlayers(Math.min(6, numPlayers + 1))}
                >
                  <Text style={styles.playerCounterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.setupStartButton}
                onPress={() => {
                  setCurrentPlayer(1);
                  setPlayerScores({});
                  setShowSetup(false);
                }}
              >
                <Text style={styles.setupStartButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.infoButtonWrapper}>
            <TouchableOpacity style={styles.infoButton} onPress={() => setShowRules(true)}>
              <Text style={styles.infoButtonText}>i</Text>
            </TouchableOpacity>
          </View>

          {/* Rules Modal */}
          <Modal visible={showRules} transparent animationType="slide" onRequestClose={() => setShowRules(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>How to Play</Text>
                  <TouchableOpacity onPress={() => setShowRules(false)}>
                    <Ionicons name="close" size={24} color="#5DADE2" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalScroll}>
                  <Text style={styles.sectionTitle}>🎯 Objective</Text>
                  <Text style={styles.ruleText}>Blow up balloons as much as you can without popping!</Text>
                  <Text style={styles.sectionTitle}>🎈 How It Works</Text>
                  <Text style={styles.ruleText}>• Blow into the microphone{'\n'}• Bigger balloon = more points{'\n'}• Press "Stop Blowing" to lock in points{'\n'}• If it pops, you lose those points!</Text>
                  <Text style={styles.sectionTitle}>🏆 Tips</Text>
                  <Text style={styles.ruleText}>Risk vs reward - know when to stop!</Text>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (showResults) {
    const avatarImages = [
      require('../assets/images/avatars/avatar1.png'),
      require('../assets/images/avatars/avatar2.png'),
      require('../assets/images/avatars/avatar3.png'),
      require('../assets/images/avatars/avatar4.png'),
      require('../assets/images/avatars/avatar5.png'),
      require('../assets/images/avatars/avatar6.png'),
    ];

    return (
      <ImageBackground
        source={require('../assets/images/Circus.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.backgroundOverlay} />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>RESULT</Text>
            <View style={styles.playerCardsContainer}>
              {Object.entries(playerScores)
                .sort((a, b) => b[1].score - a[1].score)
                .map(([player, stats], index) => {
                  const playerNum = parseInt(player);
                  const isWinner = index === 0;
                  return (
                    <View key={player} style={styles.playerCard}>
                      <Image
                        source={avatarImages[playerNum - 1]}
                        style={styles.resultAvatar}
                        resizeMode="contain"
                      />
                      <View style={styles.playerCardContent}>
                        <Text style={styles.playerCardName}>PLAYER {player}</Text>
                        {isWinner && <Text style={styles.youWinText}>YOU WIN!</Text>}
                        <Text style={styles.playerCardScore}>{stats.score}</Text>
                      </View>
                    </View>
                  );
                })}
            </View>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                setShowResults(false);
                setShowSetup(true);
                handleReset();
              }}
            >
              <Text style={styles.continueButtonText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/images/Circus.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.backgroundOverlay} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.gameContent}>
          {/* Top-left small balloons with counters */}
          <View style={styles.topLeftStats} pointerEvents="none">
            <View style={styles.statRow}>
              <Image
                source={require('../assets/images/Balloon.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
              <Text style={styles.statNumber}>{roundInflated}</Text>
            </View>
            <View style={styles.statRow}>
              <Image
                source={require('../assets/images/BalloonPopped.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
              <Text style={styles.statNumber}>{roundPopped}</Text>
            </View>
          </View>
          {/* Top-right timer */}
          {gameStarted && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{timeLeft}</Text>
            </View>
          )}
          <View style={styles.balloonCenter}>
            {/* Wind animation behind balloon */}
            <View style={styles.windAnimationContainer} pointerEvents="none">
              <LottieView
                source={require('../assets/animations/Wind.json')}
                autoPlay
                loop
                style={{ width: 400, height: 400 }}
              />
            </View>
            <View style={styles.balloonContainer}>
              <Animated.View
                style={[styles.balloon, { transform: [{ scale: balloonScale }, { translateX: shakeAnim }] }]}
              >
                {!hasPopped ? (
                  <Animated.Image
                    source={require('../assets/images/Balloon.png')}
                    resizeMode="contain"
                    style={[styles.balloonImage, { width: balloonSize, height: balloonSize }]}
                  />
                ) : (
                  <Animated.Image
                    source={require('../assets/images/BalloonPopped.png')}
                    resizeMode="contain"
                    style={[styles.balloonImage, { width: 150, height: 150, opacity: popOpacity }]}
                  />
                )}
              </Animated.View>
              {!hasPopped && <View style={styles.balloonString} />}
            </View>
            {gameStarted && !hasPopped && (
              <Text style={styles.instructionText}>🎤 Blow into the microphone!</Text>
            )}
          </View>
          <View style={styles.gameButtonsWrapper}>
            {!gameStarted ? (
              <TouchableOpacity
                style={styles.gameButton}
                onPress={handleStartTurn}
              >
                <Text style={[styles.gameButtonText, { color: '#8B0000' }]}>
                  {playerScores[currentPlayer] !== undefined ? 'Next Player' : 'Start Turn'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.gameButton}
                onPress={handleStopBlowing}
                disabled={hasPopped}
              >
                <Text style={styles.gameButtonText}>Stop Blowing</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.gameButton} onPress={handleReset}>
              <Text style={[styles.gameButtonText, { color: '#8B0000' }]}>Reset Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  setupImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  // PRE-GAME styles
  setupContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  setupTopSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    flex: 4,
    width: '100%',
  },
  setupMiddleSection: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  setupBottomSection: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
    flex: 2,
    width: '100%',
  },
  setupTitleImage: {
    width: '100%',
    height: '100%',
  },
  playerAvatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  playerAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    overflow: 'hidden',
  },
  playerAvatarImage: {
    width: 80,
    height: 80,
  },
  playerAvatarImageAdjusted: {
    transform: [{ scale: 1.22 }],
  },
  playerCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E74C3C',
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
    borderBottomColor: '#C0392B',
  },
  playerCounterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#C0392B',
  },
  playerCounterButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    backgroundColor: '#E74C3C',
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
    borderBottomColor: '#C0392B',
  },
  setupStartButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  infoButtonWrapper: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 100,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gameContent: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topLeftStats: {
    position: 'absolute',
    top: 0,
    left: 10,
    gap: 14,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 28,
    height: 28,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  timerContainer: {
    position: 'absolute',
    top: 0,
    right: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  timerText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  balloonCenter: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  windAnimationContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  gameButtonsWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 200,
    paddingBottom: 20,
  },
  gameButton: {
    flex: 1,
    backgroundColor: '#5DADE2',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#2874A6',
  },
  gameButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  // ...existing code...
  playerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  balloonContainer: {
    alignItems: 'center',
    marginVertical: 30,
    height: 450,
    justifyContent: 'center',
  },
  balloon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  balloonEmoji: {
    textAlign: 'center',
  },
  balloonImage: {
    alignSelf: 'center',
  },
  balloonString: {
    width: 2,
    height: 100,
    backgroundColor: '#fff',
    marginTop: -10,
  },
  sizeText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  scoresContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 15,
    marginVertical: 20,
    width: '100%',
  },
  scoresTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 15,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonStart: {
    backgroundColor: '#00FF00',
  },
  buttonStop: {
    backgroundColor: '#FF6B6B',
  },
  buttonReset: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  // RESULTS SCREEN STYLES
  resultsContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  resultsTitle: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FF6B35',
    marginBottom: 30,
    textShadowColor: '#8B2F00',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 0,
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  playerCardsContainer: {
    width: '100%',
    gap: 20,
    marginBottom: 30,
  },
  playerCard: {
    flexDirection: 'row',
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#8B2F00',
  },
  resultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFE0B2',
    borderWidth: 3,
    borderColor: '#8B2F00',
  },
  playerCardContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  playerCardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  youWinText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFD700',
    marginVertical: 2,
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  playerCardScore: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    position: 'absolute',
    right: 20,
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  continueButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 30,
    paddingHorizontal: 60,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#8B2F00',
  },
  continueButtonText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#5DADE2', borderRadius: 20, maxHeight: '65%', borderWidth: 2, borderColor: '#E74C3C' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(231,76,60,0.3)' },
  modalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  modalScroll: { padding: 20 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 8, marginBottom: 5 },
  ruleText: { color: '#fff', fontSize: 15, lineHeight: 21, marginBottom: 6 },
});
