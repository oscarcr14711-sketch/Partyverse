
import { BackButton } from '@/components/BackButton';
import { playSound } from '@/utils/SoundManager';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const originalTruthImages = [
  require('../assets/images/Truth or bluff images/T1.png'),
  require('../assets/images/Truth or bluff images/T2.png'),
  require('../assets/images/Truth or bluff images/T3.png'),
  require('../assets/images/Truth or bluff images/T4.png'),
  require('../assets/images/Truth or bluff images/T5.png'),
  require('../assets/images/Truth or bluff images/T6.png'),
  require('../assets/images/Truth or bluff images/T7.png'),
  require('../assets/images/Truth or bluff images/T8.png'),
  require('../assets/images/Truth or bluff images/T9.png'),
  require('../assets/images/Truth or bluff images/T10.png'),
  require('../assets/images/Truth or bluff images/T11.png'),
  require('../assets/images/Truth or bluff images/T12.png'),
];

const TOTAL_ROUNDS = 3;

export default function TruthOrBluffGameScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const numPlayers = params.numPlayers ? parseInt(params.numPlayers as string) : 2;

  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [scores, setScores] = useState(Array(6).fill(0));
  // const [correctAnswers, setCorrectAnswers] = useState(Array(6).fill(0));
  const [truthImages, setTruthImages] = useState(() => shuffleArray([...originalTruthImages]));
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [answerSelected, setAnswerSelected] = useState<'right' | 'wrong' | null>(null);

  useEffect(() => {
    if (!isTimerActive) return;
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, isTimerActive]);

  const handleAnswer = (isRight: boolean) => {
    setAnswerSelected(isRight ? 'right' : 'wrong');
    setIsTimerActive(false);
    // Play sound based on answer
    playSound(isRight ? 'game.correct' : 'game.wrong');
    setTimeout(() => {
      if (isRight) {
        setScores((prev) => {
          const updated = [...prev];
          updated[currentPlayer] += 1;
          return updated;
        });
      }
      setAnswerSelected(null);
      nextTurn();
    }, 1200);
  };

  const nextTurn = () => {
    if (currentRound >= TOTAL_ROUNDS && currentPlayer === numPlayers - 1) {
      // Game Over
      // Using router.push instead of navigation.navigate for expo-router consistency
      // Assuming truth-or-bluff-game-over exists or creating a generic result screen?
      // The original code navigated to 'truth-or-bluff-game-over'. Let's check if that exists or if we should use a generic one.
      // For now, I'll assume it exists or I might need to handle it.
      // Wait, looking at file list, I don't see truth-or-bluff-game-over.tsx.
      // It might be a pending refactor.
      // I'll leave the navigation/alert for now or just go back.
      // Actually, let's just go back to menu for now as placeholder for Game Over.
      router.back();
      return;
    }
    let nextPlayer = currentPlayer + 1;
    let nextRound = currentRound;
    if (nextPlayer >= numPlayers) {
      nextPlayer = 0;
      nextRound += 1;
    }
    setCurrentPlayer(nextPlayer);
    setCurrentRound(nextRound);
    setCurrentImageIdx((prevIdx) => (prevIdx + 1) % truthImages.length);
    setTimer(30);
    setIsTimerActive(true);
  };


  return (
    <View style={styles.mockupContainer}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.gameHeader}>
          <BackButton color="white" />
        </View>
      </SafeAreaView>
      <Text style={styles.turnText}>Player {currentPlayer + 1}'s Turn</Text>
      <Text style={styles.roundText}>Round {currentRound} / {TOTAL_ROUNDS}</Text>
      <View style={styles.mockupPhoneFrame}>
        <Image source={truthImages[currentImageIdx]} style={styles.mockupImage} resizeMode="contain" />
        <View style={styles.timerCircleWrapper}>
          <View style={styles.timerCircleOuter}>
            <View style={styles.timerCircleInner}>
              <Text style={styles.timerText}>{timer.toString().padStart(2, '0')}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.mockupButtonsWrapper}>
        <TouchableOpacity
          style={[styles.mockupButton, { backgroundColor: '#00e676', borderColor: '#00e676', borderWidth: 2 }, answerSelected === 'right' && { opacity: 0.7 }]}
          disabled={timer === 0 || !!answerSelected}
          onPress={() => handleAnswer(true)}
        >
          <Text style={[styles.mockupButtonText, { color: '#222', fontWeight: 'bold' }]}>Player {currentPlayer + 1} guessed right!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mockupButton, { backgroundColor: '#ff1744', borderColor: '#ff1744', borderWidth: 2 }, answerSelected === 'wrong' && { opacity: 0.7 }]}
          disabled={timer === 0 || !!answerSelected}
          onPress={() => handleAnswer(false)}
        >
          <Text style={[styles.mockupButtonText, { color: '#fff', fontWeight: 'bold' }]}>Player {currentPlayer + 1} guessed wrong!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  roundText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 1,
    textAlign: 'center',
  },
  mockupContainer: {
    flex: 1,
    backgroundColor: '#a78bfa',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 48,
  },
  turnText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 18,
    letterSpacing: 2,
    textAlign: 'center',
  },
  mockupPhoneFrame: {
    width: 320,
    height: 400,
    borderRadius: 38,
    backgroundColor: '#22223b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
    borderWidth: 6,
    borderColor: '#444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  mockupImage: {
    width: 300,
    height: 300,
    borderRadius: 24,
    marginTop: 18,
    marginBottom: 18,
  },
  timerCircleWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCircleOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffb300',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  timerCircleInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e65100',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  mockupButtonsWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
    gap: 18,
  },
  mockupButton: {
    width: 320,
    height: 62,
    borderRadius: 32,
    backgroundColor: '#3d348b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transitionProperty: 'background-color',
    transitionDuration: '0.2s',
  },
  mockupButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  gameHeader: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
});
