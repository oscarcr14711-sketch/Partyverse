import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const deckBackImage = require('../assets/images/Deck.png');
const cardFrontImage = require('../assets/images/Colorclash.png');
const pokerTableImage = require('../assets/images/poker_table_bg.jpg');

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Card = { suit: Suit; rank: string; color: 'red' | 'black'; };

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

function createDeck(): Card[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of RANKS) {
      const color: 'red' | 'black' = suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
      deck.push({ suit, rank, color });
    }
  }
  return deck;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ColorClashScreen() {
  const router = useRouter();
  const initialDeck = useMemo(() => shuffle(createDeck()), []);
  const [deck, setDeck] = useState<Card[]>(initialDeck);
  const [current, setCurrent] = useState<Card | null>(null);
  const [selection, setSelection] = useState<'red' | 'black' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState<string>('ROUND 1: Pick a color!');
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [drinkSeconds, setDrinkSeconds] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [showEnlargedView, setShowEnlargedView] = useState(false);

  // Single Ellipse: 16 cards to match reference style roughly (or just use a fixed number)
  // Reference image has about 16 cards. Let's use 16.
  const numCards = 16;

  const flipAnims = useRef(Array.from({ length: numCards }, () => new Animated.Value(0))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const getRoundMultiplier = () => {
    if (round === 1) return 1;
    if (round === 2) return 2;
    if (round === 3) return 3;
    return 4; // Round 4
  };

  const getRoundTitle = () => {
    const multiplier = getRoundMultiplier();
    if (round === 4) return 'FINAL ROUND\n4x Drinks!';
    return `ROUND ${round}\n${multiplier}x Multiplier`;
  };

  const drawCard = () => {
    if (deck.length === 0) {
      const reshuffled = shuffle(createDeck());
      setDeck(reshuffled);
      return reshuffled[0];
    }
    const nextDeck = deck.length ? [...deck] : shuffle(createDeck());
    const next = nextDeck.shift()!;
    setDeck(nextDeck);
    return next;
  };

  const handleColorPick = (pick: 'red' | 'black') => {
    if (revealed) return;
    setSelection(pick);
    setMessage('Now pick a card!');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const getCardValue = (rank: string): number => {
    if (rank === 'A') return 1; // Ace = 1 second
    if (rank === 'J') return 11; // Jack = 11 seconds
    if (rank === 'Q') return 12; // Queen = 12 seconds
    if (rank === 'K') return 13; // King = 13 seconds
    return parseInt(rank);
  };

  const handleCardPick = async (cardIndex: number) => {
    if (revealed || !selection || flippedCards.has(cardIndex)) return;

    setSelectedCardIndex(cardIndex);
    const cardToFlip = drawCard();
    setCurrent(cardToFlip);

    const multiplier = getRoundMultiplier();
    const baseValue = getCardValue(cardToFlip.rank);
    const totalDrinks = baseValue * multiplier;

    // Mark this card as flipped
    setFlippedCards(prev => new Set(prev).add(cardIndex));

    // small delay so state sets before animation
    setTimeout(() => {
      Animated.timing(flipAnims[cardIndex], { toValue: 1, duration: 400, useNativeDriver: true }).start(() => {
        const result = cardToFlip.color === selection! ? 'correct' : 'wrong';
        if (result === 'correct') {
          setMessage(`Correct! Choose someone to drink ${totalDrinks} secs!`);
          setCorrect((c) => c + 1);
          setStreak((s) => s + 1);
          setDrinkSeconds(totalDrinks);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          // Pulse animation for correct
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.15, duration: 150, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
          ]).start();
        } else {
          setMessage(`Wrong! You drink ${totalDrinks} seconds!`);
          setWrong((w) => w + 1);
          setStreak(0);
          setDrinkSeconds(totalDrinks);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          // Shake animation for wrong
          Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
          ]).start();
        }
        setRevealed(true);
        setShowEnlargedView(true); // Show the enlarged card view

        // Auto-reset selection after 2 seconds (increased for enlarged view)
        setTimeout(() => {
          setShowEnlargedView(false);
          setSelection(null);
          setRevealed(false);
          setSelectedCardIndex(null);
          setCurrent(null);
          setDrinkSeconds(0);

          // Check round completion
          const newFlippedCount = flippedCards.size + 1;
          if (newFlippedCount >= numCards) {
            setMessage(`Round ${round} Complete! Tap Next Round.`);
          } else {
            setMessage(`Pick a color! ${numCards - newFlippedCount} cards left.`);
          }
        }, 2000);
      });
    }, 50);
  };

  const handleNext = () => {
    // Only advance if all cards have been flipped
    if (flippedCards.size < numCards) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setMessage(`Flip all ${numCards} cards first! ${numCards - flippedCards.size} remaining.`);
      return;
    }

    setSelection(null);
    setRevealed(false);
    setSelectedCardIndex(null);
    setCurrent(null);
    setDrinkSeconds(0);
    setFlippedCards(new Set()); // Reset flipped cards for new round

    // Advance to next round (up to round 4)
    if (round < 4) {
      setRound((r) => r + 1);
      setMessage(`ROUND ${round + 1}: Pick a color!`);
    } else {
      // Game Over - Navigate to results
      router.push({
        pathname: '/color-clash-game-over',
        params: {
          correct,
          wrong,
          bestStreak: streak
        }
      });
    }

    flipAnims.forEach(anim => anim.setValue(0));
    pulseAnim.setValue(1);
    shakeAnim.setValue(0);
  };

  // ensure we have a card ready at first render
  React.useEffect(() => {
    if (!current) {
      drawCard();
    }
  }, []);

  const suitSymbol = (s: Suit) => (s === 'hearts' ? '♥' : s === 'diamonds' ? '♦' : s === 'clubs' ? '♣' : '♠');
  const suitColor = (s: Suit) => (s === 'hearts' || s === 'diamonds' ? '#D11A2A' : '#111827');

  return (
    <ImageBackground source={pokerTableImage} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>

        {/* Top Bar: Back Button, Round Info, and Stats */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>

          <View style={styles.roundInfo}>
            <Text style={styles.roundTitle}>{getRoundTitle()}</Text>
          </View>

          <View style={styles.topRightStats}>
            <Text style={styles.miniStat}>✅ {correct}  ❌ {wrong}</Text>
            {streak >= 3 && <Text style={styles.miniStreak}>🔥 {streak}</Text>}
          </View>
        </View>

        {/* Message Bar */}
        <View style={styles.messageBar}>
          <Text style={styles.messageText}>{message}</Text>
        </View>

        {/* Center: Card Table */}
        <View style={styles.gameArea}>
          <Animated.View style={[styles.cardTable, { transform: [{ scale: pulseAnim }, { translateX: shakeAnim }] }]}>
            {Array.from({ length: numCards }).map((_, index) => {
              // Single Ellipse distribution - Vertical (Portrait)
              // To make it vertical, we use a larger radiusY than radiusX
              const angle = (index / numCards) * 2 * Math.PI - Math.PI / 2; // Start from top (-PI/2)
              const radiusX = 160; // Narrower
              const radiusY = 280; // Taller
              const cardSize = { width: 50, height: 70 };

              const x = Math.cos(angle) * radiusX;
              const y = Math.sin(angle) * radiusY;

              // Rotate card to face center
              const rotateAngle = angle + Math.PI / 2;
              const rotateString = `${rotateAngle}rad`;

              const flipAnim = flipAnims[index];
              const frontRotateY = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
              const backRotateY = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

              const isFlipped = flippedCards.has(index);
              const isCurrentCard = selectedCardIndex === index && revealed;

              const isActive = !isFlipped;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.cardWrapper,
                    {
                      transform: [
                        { translateX: x },
                        { translateY: y },
                        { rotate: rotateString }
                      ],
                      zIndex: isActive ? 10 : 1,
                    },
                  ]}
                  onPress={() => handleCardPick(index)}
                  disabled={revealed || !selection || isFlipped}
                  activeOpacity={0.8}
                >
                  <Animated.View style={[
                    styles.card,
                    {
                      width: cardSize.width,
                      height: cardSize.height,
                      transform: [{ perspective: 600 }],
                      opacity: isActive ? 1 : 0.5,
                      // Removed border/glow for cleaner look matching reference
                    }
                  ]}>
                    {/* Front */}
                    <Animated.View style={[styles.cardFace, styles.cardFront, { transform: [{ rotateY: frontRotateY }] }]}>
                      {isCurrentCard && current && (
                        <>
                          <Text style={[styles.centerRank, current.color === 'red' ? styles.red : styles.black, { fontSize: cardSize.width * 0.4 }]}>{current.rank}</Text>
                          <Text style={[styles.centerSuitSmall, { color: suitColor(current.suit), fontSize: cardSize.width * 0.5 }]}>{suitSymbol(current.suit)}</Text>
                        </>
                      )}
                    </Animated.View>
                    {/* Back */}
                    <Animated.View style={[styles.cardFace, styles.cardBack, { transform: [{ rotateY: backRotateY }] }]}>
                      <Image source={deckBackImage} style={styles.deckBackImage} resizeMode="cover" />
                    </Animated.View>
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={[styles.colorButton, styles.redButton, selection === 'red' && styles.selectedColorBtn]}
            onPress={() => handleColorPick('red')}
            disabled={revealed}
          >
            <Text style={styles.colorButtonText}>RED ♥️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.colorButton, styles.blackButton, selection === 'black' && styles.selectedColorBtn]}
            onPress={() => handleColorPick('black')}
            disabled={revealed}
          >
            <Text style={styles.colorButtonText}>BLACK ♠️</Text>
          </TouchableOpacity>
        </View>

        {/* Enlarged Card Modal */}
        <Modal
          visible={showEnlargedView && current !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowEnlargedView(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowEnlargedView(false)}
          >
            <View style={styles.enlargedCardContainer}>
              {current && (
                <View style={[styles.enlargedCard, { backgroundColor: '#fff' }]}>
                  {/* Top-left corner */}
                  <View style={styles.cardCorner}>
                    <Text style={[styles.cornerRank, current.color === 'red' ? styles.red : styles.black]}>
                      {current.rank}
                    </Text>
                    <Text style={[styles.cornerSuit, { color: suitColor(current.suit) }]}>
                      {suitSymbol(current.suit)}
                    </Text>
                  </View>

                  {/* Center suit */}
                  <Text style={[styles.enlargedSuit, { color: suitColor(current.suit) }]}>
                    {suitSymbol(current.suit)}
                  </Text>

                  {/* Bottom-right corner (rotated) */}
                  <View style={[styles.cardCorner, styles.cardCornerBottomRight]}>
                    <Text style={[styles.cornerRank, current.color === 'red' ? styles.red : styles.black]}>
                      {current.rank}
                    </Text>
                    <Text style={[styles.cornerSuit, { color: suitColor(current.suit) }]}>
                      {suitSymbol(current.suit)}
                    </Text>
                  </View>

                  <View style={styles.drinkInfo}>
                    <Text style={styles.drinkLabel}>
                      {current.color === selection ? '✅ CORRECT!' : '❌ WRONG!'}
                    </Text>
                    <Text style={styles.drinkValue}>{drinkSeconds} seconds</Text>
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Modal>

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    padding: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    height: 45,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
  },
  roundInfo: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  roundTitle: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  topRightStats: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignItems: 'center',
  },
  miniStat: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  miniStreak: {
    color: '#FF6B00',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
  },
  messageBar: {
    backgroundColor: 'rgba(0, 245, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.4)',
  },
  messageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    position: 'absolute',
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 8,
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardBack: {
    backgroundColor: '#fff',
  },
  deckBackImage: {
    width: '100%',
    height: '100%',
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  centerRank: {
    fontWeight: 'bold',
  },
  centerSuitSmall: {
    marginTop: -2,
  },
  red: { color: '#D11A2A' },
  black: { color: '#111827' },

  // Bottom Controls
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  colorButton: {
    flex: 1,
    maxWidth: 200,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  redButton: {
    backgroundColor: '#C41E3A',
  },
  blackButton: {
    backgroundColor: '#1a1a1a',
  },
  selectedColorBtn: {
    borderColor: '#00F5FF',
    borderWidth: 4,
    shadowColor: '#00F5FF',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 12,
    transform: [{ scale: 1.05 }],
  },
  colorButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },

  // Enlarged Card Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enlargedCardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  enlargedCard: {
    width: 220,
    height: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  enlargedRank: {
    fontSize: 80,
    fontWeight: 'bold',
  },
  enlargedSuit: {
    fontSize: 100,
    marginTop: -10,
  },
  cardCorner: {
    position: 'absolute',
    top: 10,
    left: 10,
    alignItems: 'center',
  },
  cardCornerBottomRight: {
    top: undefined,
    left: undefined,
    bottom: 10,
    right: 10,
    transform: [{ rotate: '180deg' }],
  },
  cornerRank: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cornerSuit: {
    fontSize: 24,
  },
  drinkInfo: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 10,
    borderRadius: 10,
    width: '90%',
  },
  drinkLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  drinkValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#D11A2A',
  },
});
