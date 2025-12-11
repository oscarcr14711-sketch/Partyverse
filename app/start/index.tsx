import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCardBack } from '../../utils/CardBackContext';

export default function StartScreen() {
  const router = useRouter();
  const { selectedCardBack } = useCardBack();
  const deckBackImage = selectedCardBack.image;
  const { playerNames } = useLocalSearchParams();
  const parsedPlayerNames = playerNames ? JSON.parse(playerNames as string) : ["Player 1", "Player 2", "Player 3"];

  const lottieRef = useRef<LottieView>(null);
  const singingRef = useRef<LottieView>(null);
  const [gameState, setGameState] = useState<'IDLE' | 'COUNTDOWN' | 'REVEAL' | 'SINGING' | 'PLAYBACK' | 'SCORING'>('IDLE');
  const [currentImage, setCurrentImage] = useState<any>(null);
  const singingLoopCount = useRef(0);

  // Score tracking
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [currentRound, setCurrentRound] = useState(1);
  const MAX_ROUNDS = 10;

  // Initialize scores
  useEffect(() => {
    const initialScores: { [key: string]: number } = {};
    parsedPlayerNames.forEach((name: string) => {
      initialScores[name] = 0;
    });
    setScores(initialScores);
  }, []);

  // Audio refs
  const recording = useRef<Audio.Recording | null>(null);
  const sound = useRef<Audio.Sound | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  // Animation values
  const flipValue = useRef(new Animated.Value(0)).current;

  const images = [
    require("../../assets/images/mic madness/Drink.png"),
    require("../../assets/images/mic madness/car.png"),
    require("../../assets/images/mic madness/coffee.png"),
    require("../../assets/images/mic madness/dance.png"),
    require("../../assets/images/mic madness/dog.png"),
    require("../../assets/images/mic madness/eyes.png"),
    require("../../assets/images/mic madness/feel.png"),
    require("../../assets/images/mic madness/fire.png"),
    require("../../assets/images/mic madness/fish.png"),
    require("../../assets/images/mic madness/friend.png"),
    require("../../assets/images/mic madness/heart.png"),
    require("../../assets/images/mic madness/life.png"),
    require("../../assets/images/mic madness/love.png"),
    require("../../assets/images/mic madness/night.png"),
    require("../../assets/images/mic madness/party.png"),
    require("../../assets/images/mic madness/phone.png"),
    require("../../assets/images/mic madness/road.png"),
    require("../../assets/images/mic madness/shoe.png"),
    require("../../assets/images/mic madness/story.png"),
    require("../../assets/images/mic madness/water.png"),
  ];

  // Permission check only (requested in pre-game)
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (recording.current) {
        recording.current.stopAndUnloadAsync();
      }
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);

  // Effect to manage SINGING phase duration (Time-based instead of Animation-based)
  useEffect(() => {
    let timer: NodeJS.Timeout | number; // Fix type for React Native

    const runSingingPhase = async () => {
      if (gameState === 'SINGING') {
        // Start recording
        await startRecording();

        // Sing for 10 seconds (approx 3 loops of 3.3s)
        // This decouples game logic from animation glitches
        timer = setTimeout(async () => {
          await stopRecording();
          playRecording();
        }, 10000);
      }
    };

    runSingingPhase();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gameState]);

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        const permission = await requestPermission();
        if (permission.status !== 'granted') {
          console.error('Permission not granted');
          return;
        }
      }

      // Ensure previous recording is cleaned up
      if (recording.current) {
        await recording.current.stopAndUnloadAsync();
        recording.current = null;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recording.current = newRecording;
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording.current) return;
    try {
      await recording.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording.current.getURI();

      if (uri) {
        // Unload previous sound if exists
        if (sound.current) {
          await sound.current.unloadAsync();
          sound.current = null;
        }
        const { sound: newSound } = await Audio.Sound.createAsync({ uri });
        sound.current = newSound;
      }
      recording.current = null;
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const playRecording = async () => {
    if (!sound.current) {
      // If no sound, wait a moment then go to scoring
      setTimeout(() => setGameState('SCORING'), 2000);
      return;
    }
    try {
      setGameState('PLAYBACK');
      await sound.current.replayAsync();
      sound.current.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          setGameState('SCORING');
          try {
            await sound.current?.unloadAsync();
          } catch (e) { /* ignore unload error */ }
          sound.current = null;
        }
      });
    } catch (error) {
      console.error("Playback failed", error);
      setGameState('SCORING');
    }
  };

  const handlePlayerSelect = (index: number) => {
    // Add points to selected player
    const playerName = parsedPlayerNames[index];
    const newScores = {
      ...scores,
      [playerName]: (scores[playerName] || 0) + 100 // Add 100 points per win
    };
    setScores(newScores);

    if (currentRound >= MAX_ROUNDS) {
      // Game Over
      router.push({
        pathname: '/micgameover',
        params: {
          playerNames: JSON.stringify(parsedPlayerNames),
          finalScores: JSON.stringify(newScores)
        }
      });
    } else {
      // Next Round
      setCurrentRound(prev => prev + 1);
      setGameState('IDLE');
      // Reset flip
      flipValue.setValue(0);
    }
  };


  const handleSingPress = () => {
    setGameState('COUNTDOWN');
  };

  const runRevealAnimation = () => {
    Animated.timing(flipValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleCountdownFinish = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setCurrentImage(images[randomIndex]);
    setGameState('REVEAL');
    runRevealAnimation();

    // Transition to SINGING after 1 second
    setTimeout(() => {
      setGameState('SINGING');
      // Recording starts in useEffect
    }, 1000);
  };

  // Interpolations for Flip
  const frontInterpolate = flipValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <ImageBackground
      source={require("../../assets/images/concert.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>

        {/* Round Indicator */}
        <View style={styles.roundContainer}>
          <Text style={styles.roundText}>Round {currentRound}/{MAX_ROUNDS}</Text>
        </View>

        {/* COUNTDOWN (Above the card) - Absolute Position to prevent layout shift */}
        {gameState === 'COUNTDOWN' && (
          <View style={styles.countdownContainer}>
            <LottieView
              ref={lottieRef}
              source={require("../../assets/animations/Countdown.json")}
              autoPlay={true}
              loop={false}
              style={styles.countdown}
              onAnimationFinish={handleCountdownFinish}
            />
          </View>
        )}

        {/* CARD CONTAINER (Deck + Random Card) */}
        {gameState !== 'SCORING' && (
          <View style={styles.cardContainer}>
            {/* FRONT (Deck) */}
            <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
              <Image
                source={deckBackImage}
                style={styles.deckImage}
                resizeMode="contain"
              />
            </Animated.View>

            {/* BACK (Random Card) */}
            <Animated.View style={[styles.cardFace, styles.cardBack, backAnimatedStyle]}>
              {currentImage && (
                <Image
                  source={currentImage}
                  style={styles.randomImage}
                  resizeMode="contain"
                />
              )}
            </Animated.View>
          </View>
        )}

        {/* SINGING ANIMATION */}
        {gameState === 'SINGING' && (
          <LottieView
            source={require("../../assets/animations/sing a song.json")}
            autoPlay={true}
            loop={true} // Loop continuously during the time window
            style={styles.singingAnimation}
          />
        )}

        {/* PLAYBACK INDICATOR */}
        {gameState === 'PLAYBACK' && (
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>Playback...</Text>
        )}

        {/* SCORING PHASE */}
        {gameState === 'SCORING' && (
          <View style={styles.scoringContainer}>
            <Text style={styles.scoringTitle}>Who grabbed the mic?</Text>
            {parsedPlayerNames.map((name: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.playerButton}
                onPress={() => handlePlayerSelect(index)}
              >
                <Text style={styles.playerButtonText}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* SING BUTTON (Only in IDLE) */}
        {gameState === 'IDLE' && (
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.singButton}
              onPress={handleSingPress}
            >
              <Text style={styles.singButtonText}>Sing</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  roundContainer: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 20,
  },
  roundText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  singButton: {
    backgroundColor: '#263238',
    borderRadius: 30,
    paddingHorizontal: 80,
    paddingVertical: 16,
    marginTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#000',
    alignSelf: 'center',
  },
  singButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  finishButton: {
    backgroundColor: '#E53935', // Red color for finish
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    borderBottomWidth: 3,
    borderBottomColor: '#B71C1C',
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17,77,45,0.5)',
  },
  countdownContainer: {
    position: 'absolute',
    top: 100, // Adjust as needed to be "above" the card
    zIndex: 10,
  },
  countdown: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  singingAnimation: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginTop: 20,
  },
  // Card Styles
  cardContainer: {
    width: 380,
    height: 380,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFace: {
    width: 380,
    height: 380,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    // This is the back face (Random Card)
  },
  deckImage: {
    width: 380,
    height: 380,
  },
  randomImage: {
    width: 380,
    height: 380,
  },
  scoringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  scoringTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  playerButton: {
    backgroundColor: '#263238',
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 12,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  playerButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
});
