import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const deckBackImage = require('../assets/images/deck1.png');

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Card = { suit: Suit; rank: string; value: number; color: 'red' | 'black'; };

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

function createDeck(): Card[] {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const deck: Card[] = [];
    for (const suit of suits) {
        for (const rank of RANKS) {
            const color = suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
            let value = parseInt(rank);
            if (rank === 'A') value = 14;
            if (rank === 'K') value = 13;
            if (rank === 'Q') value = 12;
            if (rank === 'J') value = 11;
            deck.push({ suit, rank, value, color });
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

export default function RideTheBusGame() {
    const router = useRouter();
    const [deck, setDeck] = useState<Card[]>([]);
    const [phase, setPhase] = useState<1 | 2 | 3>(1); // 1: Collection, 2: Pyramid, 3: Ride The Bus

    // Phase 1 State
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [collectionStep, setCollectionStep] = useState(0); // 0-3
    const [currentCard, setCurrentCard] = useState<Card | null>(null);
    const [message, setMessage] = useState('Guess: Red or Black?');
    const [showResult, setShowResult] = useState(false);

    // Phase 2 State
    const [pyramidCards, setPyramidCards] = useState<Card[]>([]);
    const [flippedPyramidIndices, setFlippedPyramidIndices] = useState<Set<number>>(new Set());
    const [currentPyramidRow, setCurrentPyramidRow] = useState(0);

    // Phase 3 State
    const [busCards, setBusCards] = useState<Card[]>([]);
    const [busIndex, setBusIndex] = useState(0);
    const [busFlipped, setBusFlipped] = useState(false);

    // Animations
    const flipAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const newDeck = shuffle(createDeck());
        setDeck(newDeck);
        setPhase(1);
        setPlayerHand([]);
        setCollectionStep(0);
        setMessage('Guess: Red or Black?');
        setShowResult(false);
        flipAnim.setValue(0);
    };

    const drawCard = () => {
        if (deck.length === 0) {
            console.error('Deck is empty!');
            return null;
        }
        const newDeck = [...deck];
        const card = newDeck.shift();
        setDeck(newDeck);
        return card!;
    };

    // --- PHASE 1: COLLECTION ---
    const handleCollectionGuess = (guess: string) => {
        if (showResult) return;

        const card = drawCard();
        if (!card) {
            console.error('Failed to draw card in Phase 1!');
            return;
        }

        setCurrentCard(card);

        let correct = false;
        const lastCard = playerHand[playerHand.length - 1];

        switch (collectionStep) {
            case 0: // Red or Black
                correct = card.color === guess;
                break;
            case 1: // High or Low
                if (guess === 'high') correct = card.value > lastCard.value;
                else if (guess === 'low') correct = card.value < lastCard.value;
                else correct = card.value === lastCard.value; // Tie is usually a push or loss, let's say push/correct for simplicity or loss? Let's say loss for strictness.
                break;
            case 2: // Inside or Outside
                const c1 = playerHand[0].value;
                const c2 = playerHand[1].value;
                const min = Math.min(c1, c2);
                const max = Math.max(c1, c2);
                if (guess === 'inside') correct = card.value > min && card.value < max;
                else correct = card.value <= min || card.value >= max;
                break;
            case 3: // Suit
                correct = card.suit === guess;
                break;
        }

        if (correct) {
            setMessage('Correct! Next card...');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            setMessage('Wrong! Drink!');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        Animated.timing(flipAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        setShowResult(true);

        setTimeout(() => {
            setPlayerHand([...playerHand, card]);
            setCurrentCard(null);
            setShowResult(false);
            flipAnim.setValue(0);

            if (collectionStep < 3) {
                setCollectionStep(collectionStep + 1);
                updateMessage(collectionStep + 1);
            } else {
                startPhase2();
            }
        }, 1500);
    };

    const updateMessage = (step: number) => {
        switch (step) {
            case 0: setMessage('Guess: Red or Black?'); break;
            case 1: setMessage('Guess: Higher or Lower?'); break;
            case 2: setMessage('Guess: Inside or Outside?'); break;
            case 3: setMessage('Guess the Suit!'); break;
        }
    };

    // --- PHASE 2: PYRAMID ---
    const startPhase2 = () => {
        console.log('Starting Phase 2. Deck size:', deck.length);
        console.log('Player hand:', playerHand.map(c => `${c.rank}${c.suit[0]}`));
        setPhase(2);
        setMessage('The Pyramid: Tap to flip!');
        setFlippedPyramidIndices(new Set()); // Reset flipped indices

        // Use functional update to get current deck state
        setDeck(currentDeck => {
            const deckCopy = [...currentDeck];
            const pCards = [];

            for (let i = 0; i < 15; i++) {
                if (deckCopy.length > 0) {
                    const card = deckCopy.shift()!;
                    pCards.push(card);
                    console.log(`Pyramid card ${i}:`, `${card.rank}${card.suit[0]}`);
                } else {
                    console.error('Deck ran out during pyramid!');
                }
            }

            console.log('Pyramid cards generated:', pCards.length);
            console.log('Deck size after pyramid:', deckCopy.length);
            setPyramidCards(pCards);

            return deckCopy;
        });
    };

    const handlePyramidFlip = (index: number) => {
        if (flippedPyramidIndices.has(index)) return;

        const row = getRowForIndex(index);

        const newFlipped = new Set(flippedPyramidIndices);
        newFlipped.add(index);
        setFlippedPyramidIndices(newFlipped);

        const card = pyramidCards[index];
        console.log(`Flipped pyramid card ${index}:`, `${card.rank}${card.suit[0]}`);
        console.log('Player hand:', playerHand.map(c => `${c.rank}${c.suit[0]}`));

        // Check if player has match
        const match = playerHand.find(c => c.rank === card.rank);
        console.log('Match found:', match ? `${match.rank}${match.suit[0]}` : 'none');

        if (match) {
            setMessage(`Match! Give ${row} drinks!`);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            setMessage(`No match. Row ${row}.`);
        }

        if (newFlipped.size === 15) {
            setTimeout(() => {
                startPhase3();
            }, 1000);
        }
    };

    const getRowForIndex = (i: number) => {
        if (i === 0) return 1;
        if (i <= 2) return 2;
        if (i <= 5) return 3;
        if (i <= 9) return 4;
        return 5;
    };

    // --- PHASE 3: RIDE THE BUS ---
    const startPhase3 = () => {
        console.log('Starting Phase 3. Deck size:', deck.length);
        setPhase(3);
        setMessage('RIDE THE BUS! Avoid Face Cards!');

        // Use functional update to get current deck state
        setDeck(currentDeck => {
            const deckCopy = [...currentDeck];
            const bCards = [];

            for (let i = 0; i < 7; i++) {
                if (deckCopy.length > 0) {
                    const card = deckCopy.shift()!;
                    bCards.push(card);
                    console.log(`Bus card ${i}:`, `${card.rank}${card.suit[0]}`);
                } else {
                    console.error('Deck ran out during bus!');
                }
            }

            console.log('Bus cards generated:', bCards.length);
            console.log('Deck size after bus:', deckCopy.length);
            setBusCards(bCards);

            return deckCopy;
        });

        setBusIndex(0);
        setBusFlipped(false);
    };

    const handleBusFlip = () => {
        if (busFlipped) return;

        setBusFlipped(true);
        const card = busCards[busIndex];

        // Face card logic (J, Q, K, A)
        const isFace = ['J', 'Q', 'K', 'A'].includes(card.rank);

        if (isFace) {
            setMessage('FACE CARD! DRINK & RESTART!');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setTimeout(() => {
                // Restart bus with functional update
                setDeck(currentDeck => {
                    const deckCopy = [...currentDeck];
                    const newBus = [];

                    for (let i = 0; i < 7; i++) {
                        if (deckCopy.length > 0) {
                            newBus.push(deckCopy.shift()!);
                        }
                    }

                    setBusCards(newBus);
                    return deckCopy;
                });

                setBusIndex(0);
                setBusFlipped(false);
                setMessage('Restarting... Good luck!');
            }, 2000);
        } else {
            setMessage('Safe! Next card...');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setTimeout(() => {
                if (busIndex < busCards.length - 1) {
                    setBusIndex(busIndex + 1);
                    setBusFlipped(false);
                } else {
                    // Win
                    router.push('/ride-the-bus-game-over');
                }
            }, 1000);
        }
    };

    // --- RENDER HELPERS ---
    const renderCard = (card: Card | null, isFlipped: boolean, size = 'normal') => {
        if (!card || !isFlipped) {
            return <Image source={deckBackImage} style={styles.cardImage} resizeMode="contain" />;
        }
        return (
            <View style={[styles.cardFace, { backgroundColor: 'white' }]}>
                <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.cardRank, { color: card.color === 'red' ? '#D11A2A' : 'black' }]}>{card.rank}</Text>
                    <Text style={[styles.cardSuit, { color: card.color === 'red' ? '#D11A2A' : 'black' }]}>
                        {card.suit === 'hearts' ? '♥' : card.suit === 'diamonds' ? '♦' : card.suit === 'clubs' ? '♣' : '♠'}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#002000', '#005000']} style={styles.background} />
            <SafeAreaView style={styles.safeArea}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.phaseTitle}>
                        {phase === 1 ? 'Phase 1: Collection' : phase === 2 ? 'Phase 2: Pyramid' : 'Phase 3: Ride The Bus'}
                    </Text>
                </View>

                {/* Message */}
                <View style={styles.messageBar}>
                    <Text style={styles.messageText}>{message}</Text>
                </View>

                {/* Game Area */}
                <View style={styles.gameArea}>

                    {phase === 1 && (
                        <View style={styles.phase1Container}>
                            <View style={styles.handContainer}>
                                <Text style={styles.label}>Your Hand:</Text>
                                <View style={styles.miniHand}>
                                    {playerHand.map((c, i) => (
                                        <View key={i} style={styles.miniCard}>{renderCard(c, true)}</View>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.mainCardContainer}>
                                {showResult ? renderCard(currentCard, true) : renderCard(null, false)}
                            </View>

                            <View style={styles.controls}>
                                {collectionStep === 0 && (
                                    <>
                                        <TouchableOpacity style={[styles.btn, styles.redBtn]} onPress={() => handleCollectionGuess('red')}><Text style={styles.btnText}>Red</Text></TouchableOpacity>
                                        <TouchableOpacity style={[styles.btn, styles.blackBtn]} onPress={() => handleCollectionGuess('black')}><Text style={styles.btnText}>Black</Text></TouchableOpacity>
                                    </>
                                )}
                                {collectionStep === 1 && (
                                    <>
                                        <TouchableOpacity style={styles.btn} onPress={() => handleCollectionGuess('high')}><Text style={styles.btnText}>Higher</Text></TouchableOpacity>
                                        <TouchableOpacity style={styles.btn} onPress={() => handleCollectionGuess('low')}><Text style={styles.btnText}>Lower</Text></TouchableOpacity>
                                    </>
                                )}
                                {collectionStep === 2 && (
                                    <>
                                        <TouchableOpacity style={styles.btn} onPress={() => handleCollectionGuess('inside')}><Text style={styles.btnText}>Inside</Text></TouchableOpacity>
                                        <TouchableOpacity style={styles.btn} onPress={() => handleCollectionGuess('outside')}><Text style={styles.btnText}>Outside</Text></TouchableOpacity>
                                    </>
                                )}
                                {collectionStep === 3 && (
                                    <View style={styles.suitGrid}>
                                        {['hearts', 'diamonds', 'clubs', 'spades'].map(s => (
                                            <TouchableOpacity key={s} style={styles.suitBtn} onPress={() => handleCollectionGuess(s)}>
                                                <Text style={styles.suitText}>{s === 'hearts' ? '♥' : s === 'diamonds' ? '♦' : s === 'clubs' ? '♣' : '♠'}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    {phase === 2 && (
                        <View style={styles.pyramidContainer}>
                            <View style={styles.pyramidRow}>
                                <TouchableOpacity onPress={() => handlePyramidFlip(0)} style={styles.pyramidCard}>
                                    {renderCard(pyramidCards[0], flippedPyramidIndices.has(0))}
                                </TouchableOpacity>
                            </View>
                            <View style={styles.pyramidRow}>
                                {[1, 2].map(i => (
                                    <TouchableOpacity key={i} onPress={() => handlePyramidFlip(i)} style={styles.pyramidCard}>
                                        {renderCard(pyramidCards[i], flippedPyramidIndices.has(i))}
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.pyramidRow}>
                                {[3, 4, 5].map(i => (
                                    <TouchableOpacity key={i} onPress={() => handlePyramidFlip(i)} style={styles.pyramidCard}>
                                        {renderCard(pyramidCards[i], flippedPyramidIndices.has(i))}
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.pyramidRow}>
                                {[6, 7, 8, 9].map(i => (
                                    <TouchableOpacity key={i} onPress={() => handlePyramidFlip(i)} style={styles.pyramidCard}>
                                        {renderCard(pyramidCards[i], flippedPyramidIndices.has(i))}
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.pyramidRow}>
                                {[10, 11, 12, 13, 14].map(i => (
                                    <TouchableOpacity key={i} onPress={() => handlePyramidFlip(i)} style={styles.pyramidCard}>
                                        {renderCard(pyramidCards[i], flippedPyramidIndices.has(i))}
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.handContainer}>
                                <Text style={styles.label}>Your Hand (Match these!):</Text>
                                <View style={styles.miniHand}>
                                    {playerHand.map((c, i) => (
                                        <View key={i} style={styles.miniCard}>{renderCard(c, true)}</View>
                                    ))}
                                </View>
                            </View>

                            {flippedPyramidIndices.size === 15 && (
                                <TouchableOpacity style={[styles.btn, { marginTop: 20, backgroundColor: '#FFD700' }]} onPress={startPhase3}>
                                    <Text style={[styles.btnText, { color: 'black' }]}>RIDE THE BUS! 🚌</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {phase === 3 && (
                        <View style={styles.busContainer}>
                            <View style={styles.busRow}>
                                {busCards.map((c, i) => (
                                    <View key={i} style={[styles.busCardWrapper, i === busIndex && styles.activeBusCard]}>
                                        {i === busIndex ? (
                                            <TouchableOpacity onPress={handleBusFlip} style={styles.busCard}>
                                                {renderCard(c, busFlipped)}
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={[styles.busCard, { opacity: i < busIndex ? 0.5 : 1 }]}>
                                                {renderCard(c, i < busIndex)}
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15 },
    backButton: { marginRight: 15 },
    phaseTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    messageBar: { padding: 10, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center' },
    messageText: { color: '#3CB371', fontSize: 18, fontWeight: 'bold' },
    gameArea: { flex: 1, padding: 20, alignItems: 'center' },

    // Phase 1
    phase1Container: { width: '100%', alignItems: 'center', flex: 1 },
    handContainer: { width: '100%', marginBottom: 20 },
    label: { color: 'white', marginBottom: 5, fontSize: 18, fontWeight: 'bold' },
    miniHand: { flexDirection: 'row', gap: 8 },
    miniCard: { width: 50, height: 70, borderRadius: 6, overflow: 'hidden' },
    mainCardContainer: { width: 160, height: 224, marginBottom: 40 },
    controls: { flexDirection: 'row', gap: 20, flexWrap: 'wrap', justifyContent: 'center' },
    btn: { backgroundColor: '#3CB371', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10 },
    redBtn: { backgroundColor: '#D11A2A' },
    blackBtn: { backgroundColor: '#111827' },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
    suitGrid: { flexDirection: 'row', gap: 15 },
    suitBtn: { width: 70, height: 70, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
    suitText: { fontSize: 36, color: 'black' },

    // Card Styles
    cardImage: { width: '100%', height: '100%' },
    cardFace: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 10, overflow: 'hidden' },
    cardRank: { fontSize: 32, fontWeight: 'bold' },
    cardSuit: { fontSize: 42 },

    // Phase 2
    pyramidContainer: { flex: 1, width: '100%', alignItems: 'center' },
    pyramidRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    pyramidCard: { width: 60, height: 84 },

    // Phase 3
    busContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    busRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
    busCardWrapper: { width: 70, height: 98 },
    activeBusCard: { transform: [{ scale: 1.15 }], zIndex: 10 },
    busCard: { width: '100%', height: '100%' },
});
