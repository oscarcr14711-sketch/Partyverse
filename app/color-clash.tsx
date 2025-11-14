import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const deckBackImage = require('../assets/images/Deck.png');
const cardFrontImage = require('../assets/images/Colorclash.png');

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Card = { suit: Suit; rank: string; color: 'red' | 'black'; };

const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'] as const;

function createDeck(): Card[] {
  const suits: Suit[] = ['hearts','diamonds','clubs','spades'];
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
  const [selection, setSelection] = useState<'red'|'black'|null>(null);
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState<string>('ROUND 1: Pick a color!');
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [drinkSeconds, setDrinkSeconds] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [currentCircle, setCurrentCircle] = useState(1); // 1=outer, 2=middle, 3=inner

  // Card distribution: outer=8, middle=6, inner=3
  const outerCards = 8;
  const middleCards = 6;
  const innerCards = 3;
  const totalCards = outerCards + middleCards + innerCards;
  
  const numCards = totalCards;
  const flipAnims = useRef(Array.from({ length: numCards }, () => new Animated.Value(0))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const getCircleForCard = (index: number): number => {
    if (index < outerCards) return 1;
    if (index < outerCards + middleCards) return 2;
    return 3;
  };

  const getRoundMultiplier = () => {
    if (round === 1) return 1;
    if (round === 2) return 2;
    if (round === 3) return 3;
    return 4; // Round 4
  };

  const getRoundTitle = () => {
    const multiplier = getRoundMultiplier();
    if (round === 4) return 'FINAL ROUND: 4x Drinks!';
    return `ROUND ${round}: ${multiplier}x Multiplier`;
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

  const handleColorPick = (pick: 'red'|'black') => {
    if (revealed) return;
    setSelection(pick);
    setMessage('Now pick a card!');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const getCardValue = (rank: string): number => {
    if (rank === 'A') return 11; // Ace = 11 seconds base
    if (rank === 'J' || rank === 'Q' || rank === 'K') return 10;
    return parseInt(rank);
  };

  const handleCardPick = async (cardIndex: number) => {
    const cardCircle = getCircleForCard(cardIndex);
    
    // Only allow picking from current active circle
    if (cardCircle !== currentCircle) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      if (cardCircle > currentCircle) {
        setMessage(`Complete circle ${currentCircle} first!`);
      }
      return;
    }
    
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
        
        // Auto-reset selection after 1.5 seconds
        setTimeout(() => {
          setSelection(null);
          setRevealed(false);
          setSelectedCardIndex(null);
          setCurrent(null);
          setDrinkSeconds(0);
          
          // Check circle completion
          const newFlippedCount = flippedCards.size + 1;
          if (currentCircle === 1 && newFlippedCount >= outerCards) {
            setCurrentCircle(2);
            setMessage(`Circle 1 done! Now pick from Circle 2!`);
          } else if (currentCircle === 2 && newFlippedCount >= outerCards + middleCards) {
            setCurrentCircle(3);
            setMessage(`Circle 2 done! Final Circle 3!`);
          } else if (currentCircle === 3 && newFlippedCount >= totalCards) {
            setMessage(`Round ${round} Complete! Tap Next Round.`);
          } else {
            const cardsLeftInCircle = 
              currentCircle === 1 ? outerCards - newFlippedCount :
              currentCircle === 2 ? (outerCards + middleCards) - newFlippedCount :
              totalCards - newFlippedCount;
            setMessage(`Circle ${currentCircle}: ${cardsLeftInCircle} cards left!`);
          }
        }, 1500);
      });
    }, 50);
  };

  const handleNext = () => {
    // Only advance if all cards have been flipped
    if (flippedCards.size < totalCards) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setMessage(`Flip all ${totalCards} cards first! ${totalCards - flippedCards.size} remaining.`);
      return;
    }
    
    setSelection(null);
    setRevealed(false);
    setSelectedCardIndex(null);
    setCurrent(null);
    setDrinkSeconds(0);
    setFlippedCards(new Set()); // Reset flipped cards for new round
    setCurrentCircle(1); // Reset to outer circle
    
    // Advance to next round (up to round 4)
    if (round < 4) {
      setRound((r) => r + 1);
      setMessage(`ROUND ${round + 1}: Pick a color!`);
    } else {
      // Reset to round 1 after completing round 4
      setRound(1);
      setMessage('ROUND 1: Pick a color!');
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
    <LinearGradient colors={["#18061F", "#2B0B3F"]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.titleNeon}>COLOR CLASH</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.roundIndicator}>
          <Text style={styles.roundTitle}>{getRoundTitle()}</Text>
          <Text style={styles.roundSubtitle}>Round {round} of 4</Text>
        </View>

        <View style={styles.scoreRow}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Correct</Text>
            <Text style={styles.scoreValue}>✅ {correct}</Text>
          </View>
          <View style={styles.messageBox}>
            <Text style={styles.message}>{message}</Text>
            {streak >= 3 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥 {streak} STREAK!</Text>
              </View>
            )}
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Wrong</Text>
            <Text style={styles.scoreValue}>❌ {wrong}</Text>
          </View>
        </View>

        <Animated.View style={[styles.table, { transform: [{ scale: pulseAnim }, { translateX: shakeAnim }] }]}>
          {Array.from({ length: numCards }).map((_, index) => {
            let angle, radius, cardSize;
            
            // Determine which circle and calculate position - optimized for landscape
            if (index < outerCards) {
              // Outer circle - 8 cards
              const circleIndex = index;
              angle = (circleIndex / outerCards) * 2 * Math.PI - Math.PI / 2;
              radius = 160;
              cardSize = { width: 70, height: 100 };
            } else if (index < outerCards + middleCards) {
              // Middle circle - 6 cards
              const circleIndex = index - outerCards;
              angle = (circleIndex / middleCards) * 2 * Math.PI - Math.PI / 2;
              radius = 105;
              cardSize = { width: 65, height: 92 };
            } else {
              // Inner circle - 3 cards
              const circleIndex = index - outerCards - middleCards;
              angle = (circleIndex / innerCards) * 2 * Math.PI - Math.PI / 2;
              radius = 50;
              cardSize = { width: 58, height: 82 };
            }
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            const flipAnim = flipAnims[index];
            const frontRotateY = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
            const backRotateY = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
            
            const isFlipped = flippedCards.has(index);
            const isCurrentCard = selectedCardIndex === index && revealed;
            const cardCircle = getCircleForCard(index);
            const isActiveCircle = cardCircle === currentCircle;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.cardWrapper,
                  {
                    transform: [{ translateX: x }, { translateY: y }],
                  },
                ]}
                onPress={() => handleCardPick(index)}
                disabled={revealed || !selection || isFlipped || !isActiveCircle}
                activeOpacity={0.8}
              >
                <Animated.View style={[
                  styles.card,
                  { 
                    width: cardSize.width,
                    height: cardSize.height,
                    transform: [{ perspective: 600 }],
                    opacity: isActiveCircle ? 1 : 0.4,
                  }
                ]}>
                  {/* Front */}
                  <Animated.View style={[styles.cardFace, styles.cardFront, { transform: [{ rotateY: frontRotateY }] }]}> 
                    {isCurrentCard && current && (
                      <>
                        <View style={styles.cornerTL}>
                          <Text style={[styles.cornerRank, current.color === 'red' ? styles.red : styles.black]}>{current.rank}</Text>
                          <Text style={[styles.cornerSuit, { color: suitColor(current.suit) }]}>{suitSymbol(current.suit)}</Text>
                        </View>
                        <View style={styles.cornerBR}>
                          <Text style={[styles.cornerRank, current.color === 'red' ? styles.red : styles.black]}>
                            {current.rank}
                          </Text>
                          <Text style={[styles.cornerSuit, { color: suitColor(current.suit) }]}>{suitSymbol(current.suit)}</Text>
                        </View>
                        <View style={styles.centerPip}>
                          <Text style={[styles.centerSuit, { color: suitColor(current.suit) }]}>{suitSymbol(current.suit)}</Text>
                        </View>
                      </>
                    )}
                  </Animated.View>
                  {/* Back */}
                  <Animated.View style={[styles.cardFace, styles.cardBack, { transform: [{ rotateY: backRotateY }] }]}> 
                    <View style={styles.deckBackContainer}>
                      <Image source={deckBackImage} style={styles.deckBackImage} resizeMode="cover" />
                    </View>
                  </Animated.View>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.pickButton, styles.redBtn, selection === 'red' && styles.selectedBtn]}
            onPress={() => handleColorPick('red')}
            disabled={revealed}
          >
            <Text style={styles.pickText}>Red ♥️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pickButton, styles.blackBtn, selection === 'black' && styles.selectedBtn]}
            onPress={() => handleColorPick('black')}
            disabled={revealed}
          >
            <Text style={styles.pickText}>Black ♠️</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 12 }} />
        <TouchableOpacity style={[styles.nextButton, !revealed && styles.nextDisabled]} onPress={handleNext} disabled={!revealed}>
          <Text style={styles.nextText}>Next Round</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleNeon: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 3,
    color: '#00F5FF',
    textShadowColor: '#00F5FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  roundIndicator: {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 245, 255, 0.3)',
    alignItems: 'center',
  },
  roundTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#00F5FF',
    letterSpacing: 1,
    textShadowColor: '#00F5FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  roundSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginBottom: 12,
    gap: 8,
  },
  scoreBox: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 12,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  scoreLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  messageBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.95,
    textAlign: 'center',
    fontWeight: '600',
  },
  streakBadge: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  streakText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  score: { color: '#fff', fontWeight: 'bold' },
  table: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    height: 380,
    maxWidth: 520,
    aspectRatio: 1,
    alignSelf: 'center',
    position: 'relative',
  },
  cardWrapper: {
    position: 'absolute',
  },
  card: {
    borderRadius: 10,
    backgroundColor: 'transparent',
    shadowColor: '#FF00FF',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
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
    borderRadius: 14,
  },
  deckBackImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  deckBackContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardBack: {
    overflow: 'hidden',
  },
  cardBackGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBackBorder: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 6,
    right: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  cardBackEmblem: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.06)'
  },
  cardBackEmblemText: { color: '#dfe7ff', textAlign: 'center', lineHeight: 22 },
  cardFront: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  cardFrontImage: {
    width: '100%',
    height: '100%',
  },
  red: { color: '#D11A2A' },
  black: { color: '#111827' },
  cornerTL: {
    position: 'absolute',
    top: 5,
    left: 5,
    alignItems: 'center',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  cornerRank: { fontSize: 14, fontWeight: '700', letterSpacing: 0, fontVariant: ['tabular-nums'] },
  cornerSuit: { fontSize: 11, marginTop: -1 },
  centerPip: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -18,
  },
  centerSuit: { fontSize: 30 },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 6,
  },
  pickButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  redBtn: { backgroundColor: '#8B1E3F' },
  blackBtn: { backgroundColor: '#1B1F3B' },
  selectedBtn: { 
    borderWidth: 3,
    borderColor: '#00F5FF',
    shadowColor: '#00F5FF',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
  },
  pickText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  disabledBtn: { opacity: 0.7 },
  nextButton: {
    marginTop: 8,
    marginHorizontal: 6,
    backgroundColor: '#2A9D8F',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextDisabled: { opacity: 0.5 },
  nextText: { color: '#001219', fontWeight: '900', fontSize: 16 },
});
