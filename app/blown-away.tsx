import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MAX_BALLOON_SIZE = 500; // Size at which balloon pops
const MIN_BALLOON_SIZE = 100;
const BLOW_THRESHOLD = -40; // Audio level threshold (more sensitive)

export default function BlownAwayScreen() {
  const router = useRouter();
  const [showSetup, setShowSetup] = useState(true); // Pre-game screen gate
  const [numPlayers, setNumPlayers] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [balloonSize, setBalloonSize] = useState(MIN_BALLOON_SIZE);
  const [hasPopped, setHasPopped] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerScores, setPlayerScores] = useState<{ [key: number]: number }>({});
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per turn
  const [balloons, setBalloons] = useState<Array<{ popped: boolean }>>([]); // Track all balloons

  const balloonScale = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const popOpacity = useRef(new Animated.Value(0)).current;

  // Request microphone permissions and start listening
  const startListening = async () => {
    try {
      // Stop and unload any existing recording first
      if (recording) {
        try {
          await recording.stopAndUnloadAsync();
          setRecording(null);
          setIsListening(false);
        } catch (e) {
          console.log('Error stopping existing recording:', e);
        }
      }

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
                
                // Check if balloon should pop
                if (newSize >= MAX_BALLOON_SIZE) {
                  popBalloon();
                  return MAX_BALLOON_SIZE;
                }
                
                // Shake more intensely as balloon gets bigger
                if (newSize > MAX_BALLOON_SIZE * 0.7) {
                  Animated.sequence([
                    Animated.timing(shakeAnim, { toValue: -8, duration: 30, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue: 0, duration: 30, useNativeDriver: true }),
                  ]).start();
                }
                
                // If balloon is inflated (not popped), add to array
                if (newSize > prev && newSize < MAX_BALLOON_SIZE) {
                  setBalloons((old) => [...old, { popped: false }]);
                }
                return newSize;
              });
            }
          }
        },
        100 // Update every 100ms
      );

      setRecording(newRecording);
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopListening = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        setRecording(null);
        setIsListening(false);
      } catch (err) {
        console.error('Failed to stop recording', err);
      }
    }
  };

  const popBalloon = () => {
    setHasPopped(true);
    stopListening();
    
    // Pop animation
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Animated.parallel([
      Animated.timing(balloonScale, { toValue: 1.5, duration: 100, useNativeDriver: true }),
      Animated.timing(popOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      Animated.timing(balloonScale, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    });

    // Player loses - score is 0
    setPlayerScores((prev) => ({ ...prev, [currentPlayer]: 0 }));
    
    setTimeout(() => {
      nextPlayer();
    }, 2000);
  };

  const handleStartTurn = () => {
  setGameStarted(true);
  setBalloonSize(MIN_BALLOON_SIZE);
  setHasPopped(false);
  setTimeLeft(15);
  setBalloons([]);
  balloonScale.setValue(1);
  popOpacity.setValue(0);
  startListening();
  };

  const handleStopBlowing = () => {
    if (!hasPopped) {
      // Save the score for this player
      setPlayerScores((prev) => ({ ...prev, [currentPlayer]: balloonSize }));
      stopListening();
      setGameStarted(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        nextPlayer();
      }, 1500);
    }
  };

  // Timer effect for each turn
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !hasPopped) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (gameStarted && timeLeft === 0) {
      handleStopBlowing();
    }
  }, [gameStarted, timeLeft, hasPopped]);

  const nextPlayer = () => {
    setCurrentPlayer((prev) => prev + 1);
    setBalloonSize(MIN_BALLOON_SIZE);
    setHasPopped(false);
    setGameStarted(false);
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
    balloonScale.setValue(1);
    popOpacity.setValue(0);
  };

  // Determine winner
  const getWinner = () => {
    const scores = Object.entries(playerScores);
    if (scores.length === 0) return null;
    
    const winner = scores.reduce((max, current) => 
      current[1] > max[1] ? current : max
    );
    
    return { player: parseInt(winner[0]), size: winner[1] };
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

  return (
    showSetup ? (
      // PRE-GAME SETUP SCREEN (similar to Hot Bomb), using Blownaway.png as the title image
      <LinearGradient
        colors={['#5DADE2', '#5DADE2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.setupContainer}>
            {/* Title Image */}
            <Image
              source={require('../assets/images/Blownavatar.png')}
              style={styles.setupTitleImage}
              resizeMode="contain"
            />
            
            {/* Player avatars */}
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

            {/* Player counter */}
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
                onPress={() => setNumPlayers(Math.min(8, numPlayers + 1))}
              >
                <Text style={styles.playerCounterButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Start */}
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
          {/* Info button (placeholder) */}
          <View style={styles.infoButtonWrapper}>
            <TouchableOpacity style={styles.infoButton}>
              <Text style={styles.infoButtonText}>i</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    ) : (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>🎈 Blown Away</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text style={styles.playerText}>Player {currentPlayer}</Text>
            <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>
            <View style={styles.balloonsRow}>
              {balloons.map((b, idx) => (
                <Text key={idx} style={{ fontSize: 40 }}>
                  {b.popped ? '🪁' : '🎈'}
                </Text>
              ))}
            </View>
          </View>
          {/* Balloon */}
          <View style={styles.balloonContainer}>
            <Animated.View
              style={[styles.balloon, { transform: [{ scale: balloonScale }, { translateX: shakeAnim }] }]}
            >
              <Text style={[styles.balloonEmoji, { fontSize: balloonSize }]}>
                {hasPopped ? '💥' : '🎈'}
              </Text>
            </Animated.View>
            
            {/* Balloon string */}
            {!hasPopped && (
              <View style={styles.balloonString} />
            )}
          </View>

          {gameStarted && !hasPopped && (
            <Text style={styles.instructionText}>🎤 Blow into the microphone!</Text>
          )}

          {/* Scores */}
          {Object.keys(playerScores).length > 0 && (
            <View style={styles.scoresContainer}>
              <Text style={styles.scoresTitle}>Scores:</Text>
              {Object.entries(playerScores).map(([player, size]) => (
                <Text key={player} style={styles.scoreText}>
                  Player {player}: {size === 0 ? '💥 POPPED!' : `${Math.round(size as number)}`}
                  {winner && winner.player === parseInt(player) && winner.size > 0 && ' 🏆'}
                </Text>
              ))}
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {!gameStarted ? (
              <TouchableOpacity
                style={[styles.button, styles.buttonStart]}
                onPress={handleStartTurn}
              >
                <Text style={styles.buttonText}>
                  {playerScores[currentPlayer] !== undefined ? '▶️ Next Player' : '▶️ Start Turn'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.buttonStop]}
                onPress={handleStopBlowing}
                disabled={hasPopped}
              >
                <Text style={styles.buttonText}>🛑 Stop Blowing</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={[styles.button, styles.buttonReset]} onPress={handleReset}>
              <Text style={styles.buttonText}>🔄 Reset Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  setupTitleImage: {
    width: '85%',
    maxWidth: 800,
    aspectRatio: 8/3,
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
  timerText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  balloonsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
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
});
