import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCardBack } from '../utils/CardBackContext';

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

// Pyramid row drink seconds: Row 1 (bottom) = 6, Row 5 (top) = 10
const PYRAMID_DRINK_SECONDS = [6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 10];
const getRowForIndex = (i: number): number => {
    if (i < 5) return 1;  // Bottom row: indices 0-4
    if (i < 9) return 2;  // Row 2: indices 5-8
    if (i < 12) return 3; // Row 3: indices 9-11
    if (i < 14) return 4; // Row 4: indices 12-13
    return 5;             // Top row: index 14
};

export default function RideTheBusGame() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { selectedCardBack } = useCardBack();
    const deckBackImage = selectedCardBack.image;

    // Parse player names from params
    const players: string[] = useMemo(() => {
        try {
            return JSON.parse(params.players as string) || ['Player 1', 'Player 2'];
        } catch {
            return ['Player 1', 'Player 2'];
        }
    }, [params.players]);

    const [deck, setDeck] = useState<Card[]>([]);
    const [phase, setPhase] = useState<1 | 2 | 3>(1);

    // Player tracking
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [playerHands, setPlayerHands] = useState<{ [key: string]: Card[] }>({});

    // Phase 1 State
    const [collectionStep, setCollectionStep] = useState(0);
    const [currentCard, setCurrentCard] = useState<Card | null>(null);
    const [message, setMessage] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [tempHand, setTempHand] = useState<Card[]>([]);

    // Phase 2 State
    const [pyramidCards, setPyramidCards] = useState<Card[]>([]);
    const [flippedPyramidIndices, setFlippedPyramidIndices] = useState<Set<number>>(new Set());
    const [playerAttempts, setPlayerAttempts] = useState<{ [key: string]: number }>({});
    const [showDrinkModal, setShowDrinkModal] = useState(false);
    const [drinkSeconds, setDrinkSeconds] = useState(0);
    const [matchedCard, setMatchedCard] = useState<Card | null>(null);

    // Phase 3 State
    const [busCards, setBusCards] = useState<Card[]>([]);
    const [busIndex, setBusIndex] = useState(0);
    const [busFlipped, setBusFlipped] = useState(false);
    const [survivors, setSurvivors] = useState<string[]>([]);
    const [eliminated, setEliminated] = useState<string[]>([]);
    const [showSurvivorModal, setShowSurvivorModal] = useState(false);

    // Animations
    const flipAnim = useRef(new Animated.Value(0)).current;

    const currentPlayer = players[currentPlayerIndex];

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const newDeck = shuffle(createDeck());
        setDeck(newDeck);
        setPhase(1);
        setCurrentPlayerIndex(0);
        setPlayerHands({});
        setCollectionStep(0);
        setTempHand([]);
        setMessage(`${players[0]}: Red or Black?`);
        setShowResult(false);
        flipAnim.setValue(0);

        // Initialize player attempts for Phase 2
        const attempts: { [key: string]: number } = {};
        players.forEach(p => { attempts[p] = 5; });
        setPlayerAttempts(attempts);
    };

    const drawCard = () => {
        if (deck.length === 0) {
            const newDeck = shuffle(createDeck());
            setDeck(newDeck);
            return newDeck.shift()!;
        }
        const newDeck = [...deck];
        const card = newDeck.shift()!;
        setDeck(newDeck);
        return card;
    };

    // --- PHASE 1: COLLECTION ---
    const handleCollectionGuess = (guess: string) => {
        if (showResult) return;

        const card = drawCard();
        setCurrentCard(card);

        let correct = false;
        const lastCard = tempHand[tempHand.length - 1];

        switch (collectionStep) {
            case 0: // Red or Black
                correct = card.color === guess;
                break;
            case 1: // High or Low
                if (guess === 'high') correct = card.value > lastCard.value;
                else if (guess === 'low') correct = card.value < lastCard.value;
                else correct = card.value === lastCard.value;
                break;
            case 2: // Inside or Outside
                const c1 = tempHand[0].value;
                const c2 = tempHand[1].value;
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
            setMessage('Correct! ✓');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            setMessage('Wrong! Drink! 🍺');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        Animated.timing(flipAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        setShowResult(true);

        setTimeout(() => {
            const newHand = [...tempHand, card];
            setTempHand(newHand);
            setCurrentCard(null);
            setShowResult(false);
            flipAnim.setValue(0);

            if (collectionStep < 3) {
                setCollectionStep(collectionStep + 1);
                updateMessage(collectionStep + 1);
            } else {
                // Save this player's hand and move to next player
                const newHands = { ...playerHands, [currentPlayer]: newHand };
                setPlayerHands(newHands);

                if (currentPlayerIndex < players.length - 1) {
                    // Next player
                    setCurrentPlayerIndex(currentPlayerIndex + 1);
                    setCollectionStep(0);
                    setTempHand([]);
                    setMessage(`${players[currentPlayerIndex + 1]}: Red or Black?`);
                } else {
                    // All players done, start Phase 2
                    startPhase2(newHands);
                }
            }
        }, 1500);
    };

    const updateMessage = (step: number) => {
        switch (step) {
            case 0: setMessage(`${currentPlayer}: Red or Black?`); break;
            case 1: setMessage(`${currentPlayer}: Higher or Lower?`); break;
            case 2: setMessage(`${currentPlayer}: Inside or Outside?`); break;
            case 3: setMessage(`${currentPlayer}: Guess the Suit!`); break;
        }
    };

    // --- PHASE 2: PYRAMID ---
    const startPhase2 = (hands: { [key: string]: Card[] }) => {
        setPhase(2);
        setCurrentPlayerIndex(0);
        setMessage(`${players[0]}'s turn - Pick a pyramid card!`);
        setFlippedPyramidIndices(new Set());

        setDeck(currentDeck => {
            const deckCopy = [...currentDeck];
            const pCards = [];
            for (let i = 0; i < 15 && deckCopy.length > 0; i++) {
                pCards.push(deckCopy.shift()!);
            }
            setPyramidCards(pCards);
            return deckCopy;
        });
    };

    const handlePyramidFlip = (index: number) => {
        if (flippedPyramidIndices.has(index)) return;
        if (playerAttempts[currentPlayer] <= 0) return;

        // Flip the card
        const newFlipped = new Set(flippedPyramidIndices);
        newFlipped.add(index);
        setFlippedPyramidIndices(newFlipped);

        const card = pyramidCards[index];
        const row = getRowForIndex(index);
        const seconds = 5 + row; // Row 1 = 6 sec, Row 5 = 10 sec

        // Check if player has matching card
        const playerCards = playerHands[currentPlayer] || [];
        const matchIndex = playerCards.findIndex(c => c.rank === card.rank);

        // Reduce attempts
        const newAttempts = { ...playerAttempts, [currentPlayer]: playerAttempts[currentPlayer] - 1 };
        setPlayerAttempts(newAttempts);

        if (matchIndex >= 0) {
            // Match! Remove card from hand, show drink modal
            const newHand = [...playerCards];
            newHand.splice(matchIndex, 1);
            setPlayerHands({ ...playerHands, [currentPlayer]: newHand });

            setMatchedCard(card);
            setDrinkSeconds(seconds);
            setShowDrinkModal(true);
            setMessage(`MATCH! ${currentPlayer} chooses who drinks ${seconds} seconds!`);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            // No match, player drinks
            setMessage(`No match! ${currentPlayer} drinks ${seconds} seconds! 🍺`);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            setTimeout(() => {
                advancePhase2Player(newAttempts);
            }, 2000);
        }
    };

    const handleDrinkAssign = (targetPlayer: string) => {
        setShowDrinkModal(false);
        setMessage(`${targetPlayer} drinks ${drinkSeconds} seconds! 🍺`);

        setTimeout(() => {
            advancePhase2Player(playerAttempts);
        }, 2000);
    };

    const advancePhase2Player = (attempts: { [key: string]: number }) => {
        // Check if current player still has attempts
        if (attempts[currentPlayer] > 0) {
            setMessage(`${currentPlayer}'s turn - ${attempts[currentPlayer]} attempts left`);
            return;
        }

        // Move to next player with attempts remaining
        let nextIndex = (currentPlayerIndex + 1) % players.length;
        let checked = 0;
        while (checked < players.length) {
            if (attempts[players[nextIndex]] > 0) {
                setCurrentPlayerIndex(nextIndex);

                // Reset pyramid for new player - generate fresh cards
                setFlippedPyramidIndices(new Set());
                setDeck(currentDeck => {
                    let deckToUse = currentDeck.length >= 15 ? [...currentDeck] : shuffle(createDeck());
                    const pCards = [];
                    for (let i = 0; i < 15 && deckToUse.length > 0; i++) {
                        pCards.push(deckToUse.shift()!);
                    }
                    setPyramidCards(pCards);
                    return deckToUse;
                });

                setMessage(`${players[nextIndex]}'s turn - ${attempts[players[nextIndex]]} attempts left`);
                return;
            }
            nextIndex = (nextIndex + 1) % players.length;
            checked++;
        }

        // All players done with Phase 2, start Phase 3
        startPhase3();
    };

    // --- PHASE 3: RIDE THE BUS ---
    const generateBalancedBusCards = (deckCopy: Card[]): Card[] => {
        const faceCards = deckCopy.filter(c => ['J', 'Q', 'K', 'A'].includes(c.rank));
        const safeCards = deckCopy.filter(c => !['J', 'Q', 'K', 'A'].includes(c.rank));

        // Randomly decide if this round should be winnable (50% chance)
        const isWinnable = Math.random() < 0.5;

        if (isWinnable) {
            // All 7 cards are safe - player can survive!
            const shuffledSafe = shuffle(safeCards);
            return shuffledSafe.slice(0, 7);
        } else {
            // Put 1-2 face cards ONLY in positions 5, 6, or 7
            // First 4 cards are ALWAYS safe
            const numFaceCards = Math.floor(Math.random() * 2) + 1; // 1-2 face cards

            const first4Safe = shuffle(safeCards).slice(0, 4);
            const remaining = shuffle(safeCards.slice(4));

            // For positions 5-7, mix some safe with face cards
            const lastPositions: Card[] = [];
            const shuffledFace = shuffle(faceCards);
            const lastSafeCards = remaining.slice(0, 3 - numFaceCards);

            for (let i = 0; i < numFaceCards && i < shuffledFace.length; i++) {
                lastPositions.push(shuffledFace[i]);
            }
            for (let i = 0; i < lastSafeCards.length; i++) {
                lastPositions.push(lastSafeCards[i]);
            }

            // Shuffle only the last 3 positions
            const shuffledLast = shuffle(lastPositions);

            return [...first4Safe, ...shuffledLast];
        }
    };

    const startPhase3 = () => {
        setPhase(3);
        setCurrentPlayerIndex(0);
        setSurvivors([]);
        setEliminated([]);
        setBusIndex(0);
        setBusFlipped(false);
        setMessage(`${players[0]} rides the bus! Tap to flip cards.`);

        setDeck(currentDeck => {
            let deckToUse = currentDeck.length >= 15 ? [...currentDeck] : shuffle(createDeck());
            const bCards = generateBalancedBusCards(deckToUse);
            setBusCards(bCards);
            const usedCards = new Set(bCards);
            return deckToUse.filter(c => !usedCards.has(c));
        });
    };

    const handleBusFlip = () => {
        if (busFlipped) return;

        setBusFlipped(true);
        const card = busCards[busIndex];
        const isFace = ['J', 'Q', 'K', 'A'].includes(card.rank);

        if (isFace) {
            // Face card - eliminated
            const faceSeconds = card.value; // J=11, Q=12, K=13, A=14
            setMessage(`${currentPlayer} hit ${card.rank}! Drink ${faceSeconds} seconds! ELIMINATED! 💀`);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            setEliminated([...eliminated, currentPlayer]);

            setTimeout(() => {
                advancePhase3Player();
            }, 3000);
        } else {
            // Safe card
            setMessage(`${currentPlayer} is safe! Card ${busIndex + 1}/7`);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            if (busIndex >= 6) {
                // Survived all 7!
                setSurvivors([...survivors, currentPlayer]);
                setShowSurvivorModal(true);
                setMessage(`${currentPlayer} SURVIVED! 🎉 Choose who drinks!`);
            } else {
                setTimeout(() => {
                    setBusIndex(busIndex + 1);
                    setBusFlipped(false);
                }, 1000);
            }
        }
    };

    const handleSurvivorDrinkAssign = (targetPlayer: string, seconds: number) => {
        setShowSurvivorModal(false);
        setMessage(`${targetPlayer} drinks ${seconds} seconds! 🍺`);

        setTimeout(() => {
            advancePhase3Player();
        }, 2000);
    };

    const advancePhase3Player = () => {
        if (currentPlayerIndex < players.length - 1) {
            const nextIndex = currentPlayerIndex + 1;
            setCurrentPlayerIndex(nextIndex);
            setBusIndex(0);
            setBusFlipped(false);

            setDeck(currentDeck => {
                let deckToUse = currentDeck.length >= 15 ? [...currentDeck] : shuffle(createDeck());
                const bCards = generateBalancedBusCards(deckToUse);
                setBusCards(bCards);
                const usedCards = new Set(bCards);
                return deckToUse.filter(c => !usedCards.has(c));
            });

            setMessage(`${players[nextIndex]} rides the bus!`);
        } else {
            // Game over
            router.push({
                pathname: '/ride-the-bus-game-over',
                params: {
                    survivors: JSON.stringify(survivors),
                    eliminated: JSON.stringify(eliminated)
                }
            });
        }
    };

    // --- RENDER HELPERS ---
    const getSuitSymbol = (suit: Suit) => suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : suit === 'clubs' ? '♣' : '♠';

    const renderCard = (card: Card | null, isFlipped: boolean) => {
        if (!card || !isFlipped) {
            return <Image source={deckBackImage} style={styles.cardImage} resizeMode="contain" />;
        }
        const suitSymbol = getSuitSymbol(card.suit);
        const textColor = card.color === 'red' ? '#D11A2A' : '#1a1a1a';

        return (
            <View style={[styles.cardFace, { backgroundColor: 'white' }]}>
                <View style={styles.cardCornerTopLeft}>
                    <Text style={[styles.cornerRank, { color: textColor }]}>{card.rank}</Text>
                    <Text style={[styles.cornerSuit, { color: textColor }]}>{suitSymbol}</Text>
                </View>
                <Text style={[styles.centerSuit, { color: textColor }]}>{suitSymbol}</Text>
                <View style={styles.cardCornerBottomRight}>
                    <Text style={[styles.cornerRank, { color: textColor }]}>{card.rank}</Text>
                    <Text style={[styles.cornerSuit, { color: textColor }]}>{suitSymbol}</Text>
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

                {/* Current Player Indicator */}
                <View style={styles.playerIndicator}>
                    <Text style={styles.playerIndicatorText}>{currentPlayer}</Text>
                    {phase === 2 && <Text style={styles.attemptsText}>{playerAttempts[currentPlayer]} attempts left</Text>}
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
                                    {tempHand.map((c, i) => (
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
                                                <Text style={[styles.suitText, { color: s === 'hearts' || s === 'diamonds' ? '#D11A2A' : '#1a1a1a' }]}>
                                                    {s === 'hearts' ? '♥' : s === 'diamonds' ? '♦' : s === 'clubs' ? '♣' : '♠'}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Bus Animation */}
                            <View style={styles.busLoaderContainer}>
                                <LottieView
                                    source={require('../assets/animations/Bus Loader.json')}
                                    autoPlay
                                    loop
                                    style={styles.busLoader}
                                />
                            </View>
                        </View>
                    )}
                    {phase === 2 && (
                        <ScrollView contentContainerStyle={styles.pyramidScrollContainer}>
                            {/* Player's hand */}
                            <View style={styles.handContainer}>
                                <Text style={styles.label}>{currentPlayer}'s Hand:</Text>
                                <View style={styles.miniHand}>
                                    {(playerHands[currentPlayer] || []).map((c, i) => (
                                        <View key={i} style={styles.miniCard}>{renderCard(c, true)}</View>
                                    ))}
                                </View>
                            </View>

                            {/* Pyramid */}
                            <View style={styles.pyramidContainer}>
                                {/* Row 5 (top) - 1 card */}
                                <View style={styles.pyramidRow}>
                                    <TouchableOpacity onPress={() => handlePyramidFlip(14)} style={styles.pyramidCard}>
                                        {renderCard(pyramidCards[14], flippedPyramidIndices.has(14))}
                                    </TouchableOpacity>
                                </View>
                                {/* Row 4 - 2 cards */}
                                <View style={styles.pyramidRow}>
                                    {[12, 13].map(i => (
                                        <TouchableOpacity key={i} onPress={() => handlePyramidFlip(i)} style={styles.pyramidCard}>
                                            {renderCard(pyramidCards[i], flippedPyramidIndices.has(i))}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                {/* Row 3 - 3 cards */}
                                <View style={styles.pyramidRow}>
                                    {[9, 10, 11].map(i => (
                                        <TouchableOpacity key={i} onPress={() => handlePyramidFlip(i)} style={styles.pyramidCard}>
                                            {renderCard(pyramidCards[i], flippedPyramidIndices.has(i))}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                {/* Row 2 - 4 cards */}
                                <View style={styles.pyramidRow}>
                                    {[5, 6, 7, 8].map(i => (
                                        <TouchableOpacity key={i} onPress={() => handlePyramidFlip(i)} style={styles.pyramidCard}>
                                            {renderCard(pyramidCards[i], flippedPyramidIndices.has(i))}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                {/* Row 1 (bottom) - 5 cards */}
                                <View style={styles.pyramidRow}>
                                    {[0, 1, 2, 3, 4].map(i => (
                                        <TouchableOpacity key={i} onPress={() => handlePyramidFlip(i)} style={styles.pyramidCard}>
                                            {renderCard(pyramidCards[i], flippedPyramidIndices.has(i))}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>
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
                            <Text style={styles.busProgress}>Card {busIndex + 1} of 7</Text>

                            {/* Bus Animation */}
                            <View style={styles.busLoaderContainer}>
                                <LottieView
                                    source={require('../assets/animations/Bus Loader.json')}
                                    autoPlay
                                    loop
                                    style={styles.busLoader}
                                />
                            </View>
                        </View>
                    )}

                </View>

                {/* Drink Assignment Modal (Phase 2) */}
                <Modal visible={showDrinkModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>🍺 Choose who drinks {drinkSeconds} seconds!</Text>
                            <ScrollView style={styles.playerList}>
                                {players.filter(p => p !== currentPlayer).map(p => (
                                    <TouchableOpacity key={p} style={styles.playerOption} onPress={() => handleDrinkAssign(p)}>
                                        <Text style={styles.playerOptionText}>{p}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* Survivor Drink Modal (Phase 3) */}
                <Modal visible={showSurvivorModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>🎉 You survived! Choose who drinks!</Text>
                            <View style={styles.drinkOptions}>
                                {[11, 12, 13, 14].map(sec => (
                                    <TouchableOpacity key={sec} style={styles.drinkOption} onPress={() => {
                                        // Show player selection for this amount
                                    }}>
                                        <Text style={styles.drinkOptionText}>{sec} sec</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <ScrollView style={styles.playerList}>
                                {players.filter(p => p !== currentPlayer).map(p => (
                                    <TouchableOpacity key={p} style={styles.playerOption} onPress={() => handleSurvivorDrinkAssign(p, 12)}>
                                        <Text style={styles.playerOptionText}>{p}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

            </SafeAreaView >
        </View >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15 },
    backButton: { marginRight: 15 },
    phaseTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    playerIndicator: {
        backgroundColor: '#FFD700',
        paddingVertical: 8,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 10,
    },
    playerIndicatorText: {
        color: '#1a1a1a',
        fontSize: 22,
        fontWeight: 'bold',
    },
    attemptsText: {
        color: '#333',
        fontSize: 14,
    },
    messageBar: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#FFD700',
    },
    messageText: {
        color: '#FFD700',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    gameArea: { flex: 1, padding: 10, alignItems: 'center' },
    phase1Container: { width: '100%', alignItems: 'center', flex: 1 },
    handContainer: { width: '100%', marginBottom: 10 },
    label: {
        color: '#FFD700',
        marginBottom: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
    miniHand: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    miniCard: {
        width: 55,
        height: 77,
        borderRadius: 6,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    mainCardContainer: {
        width: 160,
        height: 224,
        marginBottom: 20,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 15,
    },
    controls: { flexDirection: 'row', gap: 15, flexWrap: 'wrap', justifyContent: 'center' },
    btn: {
        backgroundColor: '#3CB371',
        paddingVertical: 16,
        paddingHorizontal: 36,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    },
    redBtn: { backgroundColor: '#FF1744' },
    blackBtn: { backgroundColor: '#263238' },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    suitGrid: { flexDirection: 'row', gap: 12 },
    suitBtn: {
        width: 60,
        height: 60,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    suitText: { fontSize: 32 },
    cardImage: { width: '100%', height: '100%' },
    cardFace: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    cardCornerTopLeft: { position: 'absolute', top: 3, left: 3, alignItems: 'center' },
    cardCornerBottomRight: { position: 'absolute', bottom: 3, right: 3, alignItems: 'center', transform: [{ rotate: '180deg' }] },
    cornerRank: { fontSize: 10, fontWeight: 'bold', lineHeight: 12 },
    cornerSuit: { fontSize: 10, lineHeight: 12 },
    centerSuit: { fontSize: 24 },
    pyramidScrollContainer: { alignItems: 'center', paddingBottom: 20 },
    pyramidContainer: { alignItems: 'center' },
    pyramidRow: { flexDirection: 'row', gap: 5, marginBottom: 5 },
    pyramidCard: {
        width: 58,
        height: 81,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
    busContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    busRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
    busCardWrapper: { width: 80, height: 112 },
    activeBusCard: {
        transform: [{ scale: 1.15 }],
        zIndex: 10,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 15,
    },
    busCard: { width: '100%', height: '100%' },
    busProgress: { color: '#FFD700', fontSize: 18, fontWeight: 'bold', marginTop: 20 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 25,
        width: '85%',
        maxHeight: '70%',
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    modalTitle: {
        color: '#FFD700',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    playerList: { maxHeight: 300 },
    playerOption: {
        backgroundColor: '#3CB371',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    playerOptionText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    drinkOptions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 15,
    },
    drinkOption: {
        backgroundColor: '#FF1744',
        padding: 10,
        borderRadius: 10,
    },
    drinkOptionText: {
        color: 'white',
        fontWeight: 'bold',
    },
    busLoaderContainer: {
        position: 'absolute',
        bottom: -30,
        left: 0,
        right: 0,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
    },
    busLoader: {
        width: 250,
        height: 125,
    },
});
