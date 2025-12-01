import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Dark humor jokes for Round 1
const FUNNY_SCENARIOS = [
    "My friend said he has the maturity of a grown man… which explains why he disappears when there's responsibility.",
    "I don't need enemies. My friends roast me for free.",
    "If common sense were money, some of my friends would be bankrupt.",
    "My luck is so bad, I'd probably lose a coin toss… with a two-headed coin.",
    "If laziness was a sport, I'd still not show up to compete.",
    "I tried to be a better person today… but the world started it first.",
    "I'm not saying I'm stupid… but my GPS recalculates a lot.",
    "I'm the friend who gives good advice… and then does the opposite.",
    "My friend said 'trust the process.' Bro, the process is drunk.",
    "If karma doesn't hit you, don't worry—life has good aim.",
    "Whenever I say 'it can't get worse,' life says 'challenge accepted.'",
    "I don't make mistakes. I create opportunities… for people to laugh at me.",
    "If you ever feel useless, remember someone invented the 'scented trash bag.'",
    "I'm not unlucky… I just attract chaos like WiFi.",
    "We all have that one friend who's the bad influence… and if you don't, it's you.",
    "My brain: 'Be responsible.' Also my brain: 'Let's do something stupid.'",
    "You know things are bad when your own shadow leaves early.",
    "The only thing I'm committed to is… being uncommitted.",
    "Some people have inner peace. I have inner sarcasm.",
    "If stupidity was contagious, my group chat would be a pandemic.",
    "I don't know if I need coffee, therapy, a nap, or new friends. Probably all four.",
    "My diet is like my self-control: I start strong, then crash immediately.",
    "Sometimes I shock myself with the smart things I say. Other times, I look for my phone… while I'm on a call.",
    "I'm not anti-social. I'm 'selectively social'… and the selection is very strict.",
    "I don't have resting bitch face. It's active. Very active.",
];

// Laugh Trap content for Round 3
const LAUGH_TRAPS = {
    animations: [
        "Dancing Monkey 🐵",
        "Confused Cat 🐱",
        "Laughing Baby 👶",
        "Goofy Bouncing Face 😜",
        "Slipping Penguin 🐧",
    ],
    sounds: [
        "Fart Sound 💨",
        "Baby Laugh 👶",
        "Duck Quack 🦆",
        "BRUH Sound 😑",
        "Chipmunk Scream 🐿️",
        "Evil Villain Laugh 😈",
    ],
    challenges: [
        "Say your full name like a dramatic villain",
        "Act like a robot without laughing",
        "Bite your lip and don't smile",
        "Try not to blink for 5 seconds",
        "Pretend you're a confused GPS",
        "Do your best impression of a broken washing machine",
    ],
    phrases: [
        "My spirit animal is a depressed tamale.",
        "I am 95% water and 5% bad decisions.",
        "I am not laughing, I'm just breathing weird.",
        "My brain is buffering, please wait…",
        "I identify as a confused potato.",
        "I'm not short, I'm just vertically efficient.",
        "My life is like a romantic comedy, minus the romance and the comedy.",
        "I put the 'pro' in procrastination.",
    ],
};

// Combine all traps into one array
const ALL_TRAPS = [
    ...LAUGH_TRAPS.animations.map(text => ({ type: 'animation', content: text })),
    ...LAUGH_TRAPS.sounds.map(text => ({ type: 'sound', content: text })),
    ...LAUGH_TRAPS.challenges.map(text => ({ type: 'challenge', content: text })),
    ...LAUGH_TRAPS.phrases.map(text => ({ type: 'phrase', content: text })),
];

export default function IfYouLaughGame() {
    const router = useRouter();
    const { numPlayers } = useLocalSearchParams();
    const playerCount = numPlayers ? parseInt(numPlayers as string) : 3;

    const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(1);
    const [gamePhase, setGamePhase] = useState<'ROUND_INTRO' | 'ROUND_1_GAMEPLAY' | 'ROUND_2_SETUP' | 'ROUND_2_BATTLE' | 'ROUND_3_GAMEPLAY' | 'ROUND_RESULTS'>('ROUND_INTRO');
    const [activePlayers, setActivePlayers] = useState<number[]>([]);
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [battlePlayer1, setBattlePlayer1] = useState<number | null>(null);
    const [battlePlayer2, setBattlePlayer2] = useState<number | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [playerNames, setPlayerNames] = useState<string[]>([]);

    const soundRef = useRef<Audio.Sound | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Shuffle array function
    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const [shuffledJokes] = useState(() => shuffleArray(FUNNY_SCENARIOS));
    const [shuffledTraps] = useState(() => shuffleArray(ALL_TRAPS));

    // Round 3 specific state
    const [round3PlayerIndex, setRound3PlayerIndex] = useState(0);
    const [trapPhase, setTrapPhase] = useState<'PASS_PHONE' | 'VIEW_TRAP' | 'RESULT'>('PASS_PHONE');

    // Round 2 specific state (Non-elimination)
    const [scores, setScores] = useState<Record<number, number>>({});
    const [matchups, setMatchups] = useState<Array<[number, number]>>([]);
    const [currentMatchupIndex, setCurrentMatchupIndex] = useState(0);

    useEffect(() => {
        // Initialize players
        const players = Array.from({ length: playerCount }, (_, i) => i);
        setActivePlayers(players);
        setPlayerNames(players.map((_, i) => `Player ${i + 1}`));
    }, []);

    useEffect(() => {
        if ((gamePhase === 'ROUND_2_BATTLE' || (gamePhase === 'ROUND_3_GAMEPLAY' && trapPhase === 'VIEW_TRAP')) && timeRemaining > 0) {
            timerRef.current = setTimeout(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else if (gamePhase === 'ROUND_3_GAMEPLAY' && trapPhase === 'VIEW_TRAP' && timeRemaining === 0) {
            setTrapPhase('RESULT');
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [timeRemaining, gamePhase, trapPhase]);

    const eliminatePlayer = (playerIndex: number) => {
        setActivePlayers(prev => prev.filter(p => p !== playerIndex));
    };

    const handleStartRound = () => {
        if (currentRound === 1) {
            setGamePhase('ROUND_1_GAMEPLAY');
            setCurrentScenarioIndex(0);
        } else if (currentRound === 2) {
            setGamePhase('ROUND_2_SETUP');
            setupNextBattle();
        } else if (currentRound === 3) {
            setGamePhase('ROUND_3_GAMEPLAY');
            setRound3PlayerIndex(0);
            setTrapPhase('PASS_PHONE');
        }
    };

    const setupNextBattle = () => {
        // Initialize scores if empty
        if (Object.keys(scores).length === 0) {
            const initialScores: Record<number, number> = {};
            activePlayers.forEach(p => initialScores[p] = 0);
            setScores(initialScores);
        }

        // Create matchups if not already done
        if (matchups.length === 0) {
            const shuffled = shuffleArray([...activePlayers]);
            const newMatchups: Array<[number, number]> = [];

            // Pair up players
            for (let i = 0; i < shuffled.length - 1; i += 2) {
                newMatchups.push([shuffled[i], shuffled[i + 1]]);
            }

            // Handle odd player out (Bye)
            if (shuffled.length % 2 !== 0) {
                const oddPlayer = shuffled[shuffled.length - 1];
                // Give point to odd player automatically
                setScores(prev => ({
                    ...prev,
                    [oddPlayer]: (prev[oddPlayer] || 0) + 1
                }));
                // We don't add them to matchups, they just sit out this round
            }

            setMatchups(newMatchups);
            setCurrentMatchupIndex(0);

            if (newMatchups.length > 0) {
                setBattlePlayer1(newMatchups[0][0]);
                setBattlePlayer2(newMatchups[0][1]);
                setTimeRemaining(60);
            } else {
                // Should not happen unless 0 or 1 player, but handle it
                handleRoundComplete();
            }
        } else {
            // Setup next matchup from existing list
            if (currentMatchupIndex < matchups.length) {
                setBattlePlayer1(matchups[currentMatchupIndex][0]);
                setBattlePlayer2(matchups[currentMatchupIndex][1]);
                setTimeRemaining(60);
            } else {
                handleRoundComplete();
            }
        }
    };

    const handleNextScenario = () => {
        if (currentScenarioIndex < shuffledJokes.length - 1) {
            setCurrentScenarioIndex(prev => prev + 1);
        } else {
            handleRoundComplete();
        }
    };

    const handleBattleResult = (loser: 'player1' | 'player2' | 'both' | 'none') => {
        if (battlePlayer1 === null || battlePlayer2 === null) return;

        // Update scores
        setScores(prev => {
            const newScores = { ...prev };

            if (loser === 'player1') {
                // Player 1 laughed: 0 pts. Player 2 didn't: 1 pt.
                newScores[battlePlayer2!] = (newScores[battlePlayer2!] || 0) + 1;
            } else if (loser === 'player2') {
                // Player 2 laughed: 0 pts. Player 1 didn't: 1 pt.
                newScores[battlePlayer1!] = (newScores[battlePlayer1!] || 0) + 1;
            } else if (loser === 'none') {
                // Neither laughed: Both get 1 pt (Draw)
                newScores[battlePlayer1!] = (newScores[battlePlayer1!] || 0) + 1;
                newScores[battlePlayer2!] = (newScores[battlePlayer2!] || 0) + 1;
            }
            // If 'both' laughed: 0 pts for both (no change)

            return newScores;
        });

        // Move to next matchup
        const nextIndex = currentMatchupIndex + 1;
        setCurrentMatchupIndex(nextIndex);

        if (nextIndex < matchups.length) {
            // More battles to do
            setTimeout(() => {
                setBattlePlayer1(matchups[nextIndex][0]);
                setBattlePlayer2(matchups[nextIndex][1]);
                setTimeRemaining(60);
            }, 1000);
        } else {
            handleRoundComplete();
        }
    };



    const startTrap = () => {
        setTrapPhase('VIEW_TRAP');
        setTimeRemaining(5);
    };

    const handleTrapResult = (laughed: boolean) => {
        if (laughed) {
            eliminatePlayer(activePlayers[round3PlayerIndex]);
            // Note: When we eliminate, the array shrinks. 
            // If we are at index i, and we remove i, the next player shifts to i.
            // So we don't need to increment index if we eliminate.
            // BUT, we want to give everyone a turn. 
            // If we eliminate, the next person is now at the current index.
            // So we should NOT increment round3PlayerIndex if we eliminate?
            // Wait, if we eliminate, the array length decreases.
            // Let's say players [A, B, C]. Index 0 is A.
            // A laughs. Eliminate A. Players [B, C]. Index 0 is now B.
            // So if we don't increment, B goes next. Correct.
            // But if A survives. Players [A, B, C]. We increment index to 1. B goes next.

            // However, the user said "After all 6 players have done their trap".
            // If we eliminate A, they are gone. B is next.
            // We need to check if we've gone through everyone.
            // A safer way is to increment ONLY if we didn't eliminate?
            // Or maybe we should just keep a separate "turn counter" and not rely on array length?
            // Actually, if we eliminate, the array length changes, so `round3PlayerIndex` might go out of bounds if we aren't careful.

            // Let's try this:
            // We want to iterate through the *original* set of players for this round?
            // No, "Last player remaining wins".
            // If A is eliminated, they are out.
            // So we just check if `round3PlayerIndex < activePlayers.length`.

            // If we eliminate:
            // activePlayers changes from [A, B, C] to [B, C].
            // round3PlayerIndex was 0.
            // Next turn, we want B (who is now at 0).
            // So we stay at 0?
            // Yes.

            // If we DON'T eliminate:
            // activePlayers is [A, B, C].
            // round3PlayerIndex was 0.
            // Next turn, we want B (who is at 1).
            // So we increment.
        } else {
            setRound3PlayerIndex(prev => prev + 1);
        }

        // Check if round should end
        // We need to do this check AFTER the state update, but state updates are async.
        // A better way: check based on the *next* index and *next* array.

        // Actually, simpler logic:
        // Just increment a "turnsTaken" counter?
        // No, because eliminated players don't take turns anymore?
        // "After all 6 players have done their trap".
        // This implies even if I survive, I don't go again this round.

        // Let's use a separate "playersWhoHadTurn" set?
        // Or just:
        // If laughed: eliminate. The next player shifts into current slot.
        // If survived: increment index.

        // We need to check if we are done.
        // We are done when we have processed the last player.
        // If we eliminate the last player (index == length-1), then index becomes out of bounds (index == new length).
        // If we survive the last player (index == length-1), then index becomes length.

        // So in both cases, if `nextIndex >= nextActivePlayers.length`, we are done?
        // Wait, if we eliminate player at 0 of [A, B]. Becomes [B]. Index 0.
        // We processed A. Now we process B.
        // If we eliminate B of [B]. Becomes []. Index 0.
        // 0 >= 0. Done.

        // So the logic seems to be:
        // If laughed: don't increment index.
        // If survived: increment index.
        // Check if index >= activePlayers.length (using the *new* length).

        // Since `eliminatePlayer` is async (setState), we can't rely on `activePlayers` updating immediately.
        // We should handle the logic carefully.

        // Let's use a local variable for the next index and next players.
        let nextPlayers = [...activePlayers];
        let nextIndex = round3PlayerIndex;

        if (laughed) {
            nextPlayers = nextPlayers.filter((_, i) => i !== round3PlayerIndex);
            setActivePlayers(nextPlayers);
            // Index stays same, but effectively points to next player
        } else {
            nextIndex++;
            setRound3PlayerIndex(nextIndex);
        }

        if (nextIndex >= nextPlayers.length) {
            handleRoundComplete();
        } else {
            setTrapPhase('PASS_PHONE');
        }
    };

    const handleRoundComplete = () => {
        setGamePhase('ROUND_RESULTS');
    };

    const handleNextRound = () => {
        if (activePlayers.length === 0) {
            // Game over (everyone lost)
            router.push({
                pathname: '/if-you-laugh-game-over',
                params: {
                    winner: 'No one',
                    players: JSON.stringify(playerNames)
                }
            } as any);
        } else if (currentRound < 3) {
            setCurrentRound((prev) => (prev + 1) as 1 | 2 | 3);
            setGamePhase('ROUND_INTRO');
        } else {
            // Game complete
            router.push({
                pathname: '/if-you-laugh-game-over',
                params: {
                    winner: activePlayers.length > 0 ? playerNames[activePlayers[0]] : 'No one',
                    players: JSON.stringify(playerNames)
                }
            } as any);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Round Intro Screen
    if (gamePhase === 'ROUND_INTRO') {
        const roundTitles = ['', 'FUNNY SCENARIOS', 'FACE-OFF CHALLENGE', 'LAUGH TRAP'];
        const roundInstructions = [
            '',
            'One person reads funny scenarios. Everyone else tries not to laugh!',
            'Players face each other and try to make each other laugh! First to laugh loses.',
            'Pass the phone and try to survive the Laugh Trap! Don\'t laugh at what you see!'
        ];

        return (
            <ImageBackground
                source={require('../assets/images/laughbg.png')}
                style={styles.container}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <Text style={styles.roundTitle}>ROUND {currentRound}</Text>
                    <Text style={styles.roundSubtitle}>{roundTitles[currentRound]}</Text>

                    <View style={styles.instructionBox}>
                        <Text style={styles.instructionText}>{roundInstructions[currentRound]}</Text>
                    </View>

                    <View style={styles.playersRemainingBox}>
                        <Text style={styles.playersRemainingText}>
                            {activePlayers.length} Players Remaining
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.startRoundButton}
                        onPress={handleStartRound}
                    >
                        <Text style={styles.startRoundButtonText}>START ROUND {currentRound}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

    // Round 1: Funny Scenarios
    if (gamePhase === 'ROUND_1_GAMEPLAY') {
        return (
            <ImageBackground
                source={require('../assets/images/laughbg.png')}
                style={styles.container}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <Text style={styles.phaseTitle}>ROUND 1: FUNNY SCENARIOS</Text>
                    <Text style={styles.scenarioCounter}>Scenario {currentScenarioIndex + 1}/{shuffledJokes.length}</Text>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioText}>{shuffledJokes[currentScenarioIndex]}</Text>
                    </View>

                    <Text style={styles.instructionHint}>Read this out loud!</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.someoneLaughedButton}
                            onPress={() => {
                                // Show player selection modal (simplified for now)
                                alert('Select who laughed to eliminate them');
                            }}
                        >
                            <Text style={styles.someoneLaughedButtonText}>SOMEONE LAUGHED</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={handleNextScenario}
                        >
                            <Text style={styles.nextButtonText}>
                                {currentScenarioIndex < shuffledJokes.length - 1 ? 'NEXT' : 'FINISH ROUND'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        );
    }

    // Round 2: Battle Setup
    if (gamePhase === 'ROUND_2_SETUP') {
        return (
            <ImageBackground
                source={require('../assets/images/laughbg.png')}
                style={styles.container}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <Text style={styles.phaseTitle}>FACE-OFF!</Text>

                    <View style={styles.battleMatchup}>
                        <Text style={styles.battlePlayerName}>{playerNames[battlePlayer1!]}</Text>
                        <Text style={styles.vsText}>VS</Text>
                        <Text style={styles.battlePlayerName}>{playerNames[battlePlayer2!]}</Text>
                    </View>

                    <Text style={styles.battleInstruction}>
                        Match {currentMatchupIndex + 1} of {matchups.length}
                    </Text>
                    <Text style={styles.instructionHint}>
                        Make each other laugh! Winner gets +1 Point.
                    </Text>

                    <TouchableOpacity
                        style={styles.startBattleButton}
                        onPress={() => setGamePhase('ROUND_2_BATTLE')}
                    >
                        <Text style={styles.startBattleButtonText}>START BATTLE</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

    // Round 2: Battle
    if (gamePhase === 'ROUND_2_BATTLE') {
        return (
            <ImageBackground
                source={require('../assets/images/laughbg.png')}
                style={styles.container}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>

                    <View style={styles.battleMatchup}>
                        <Text style={styles.battlePlayerName}>{playerNames[battlePlayer1!]}</Text>
                        <Text style={styles.vsText}>VS</Text>
                        <Text style={styles.battlePlayerName}>{playerNames[battlePlayer2!]}</Text>
                    </View>

                    <View style={styles.battleButtonsContainer}>
                        <TouchableOpacity
                            style={[styles.laughedButton, styles.player1Button]}
                            onPress={() => handleBattleResult('player1')}
                        >
                            <Text style={styles.laughedButtonText}>{playerNames[battlePlayer1!]} LAUGHED</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.laughedButton, styles.player2Button]}
                            onPress={() => handleBattleResult('player2')}
                        >
                            <Text style={styles.laughedButtonText}>{playerNames[battlePlayer2!]} LAUGHED</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.laughedButton, styles.bothButton]}
                            onPress={() => handleBattleResult('both')}
                        >
                            <Text style={styles.laughedButtonText}>BOTH LAUGHED</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.laughedButton, styles.noneButton]}
                            onPress={() => handleBattleResult('none')}
                        >
                            <Text style={styles.laughedButtonText}>NOBODY LAUGHED</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        );
    }

    // Round 3: Laugh Traps
    if (gamePhase === 'ROUND_3_GAMEPLAY') {
        const currentPlayerName = playerNames[activePlayers[round3PlayerIndex]];
        const currentTrap = shuffledTraps[round3PlayerIndex % shuffledTraps.length];

        if (trapPhase === 'PASS_PHONE') {
            return (
                <ImageBackground
                    source={require('../assets/images/laughbg.png')}
                    style={styles.container}
                    resizeMode="cover"
                >
                    <View style={styles.overlay}>
                        <Text style={styles.phaseTitle}>ROUND 3: LAUGH TRAP</Text>

                        <View style={styles.instructionBox}>
                            <Text style={styles.instructionText}>
                                Pass the phone to:
                            </Text>
                            <Text style={styles.battlePlayerName}>{currentPlayerName}</Text>
                        </View>

                        <Text style={styles.instructionHint}>
                            Everyone else: Watch their face!
                        </Text>

                        <TouchableOpacity
                            style={styles.startRoundButton}
                            onPress={startTrap}
                        >
                            <Text style={styles.startRoundButtonText}>I'M READY</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            );
        }

        if (trapPhase === 'VIEW_TRAP') {
            return (
                <ImageBackground
                    source={require('../assets/images/laughbg.png')}
                    style={styles.container}
                    resizeMode="cover"
                >
                    <View style={styles.overlay}>
                        <Text style={styles.timerText}>{timeRemaining}</Text>

                        <View style={styles.scenarioCard}>
                            <Text style={styles.phaseTitle}>
                                {currentTrap.type === 'animation' ? '📺 ANIMATION' :
                                    currentTrap.type === 'sound' ? '🔊 SOUND' :
                                        currentTrap.type === 'challenge' ? '🔥 CHALLENGE' : '💬 PHRASE'}
                            </Text>
                            <Text style={styles.scenarioText}>{currentTrap.content}</Text>
                        </View>

                        <Text style={styles.instructionHint}>
                            Don't laugh!
                        </Text>
                    </View>
                </ImageBackground>
            );
        }

        if (trapPhase === 'RESULT') {
            return (
                <ImageBackground
                    source={require('../assets/images/laughbg.png')}
                    style={styles.container}
                    resizeMode="cover"
                >
                    <View style={styles.overlay}>
                        <Text style={styles.phaseTitle}>TIME'S UP!</Text>

                        <Text style={styles.roundSubtitle}>
                            Did {currentPlayerName} laugh?
                        </Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.someoneLaughedButton}
                                onPress={() => handleTrapResult(true)}
                            >
                                <Text style={styles.someoneLaughedButtonText}>YES (ELIMINATE)</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={() => handleTrapResult(false)}
                            >
                                <Text style={styles.nextButtonText}>NO (SURVIVED)</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            );
        }
    }

    // Round Results
    if (gamePhase === 'ROUND_RESULTS') {
        return (
            <ImageBackground
                source={require('../assets/images/laughbg.png')}
                style={styles.container}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <Text style={styles.resultsTitle}>ROUND {currentRound} COMPLETE!</Text>

                    <View style={styles.resultsBox}>
                        <Text style={styles.resultsSubtitle}>Players Remaining: {activePlayers.length}</Text>
                        {activePlayers.map((playerIndex) => (
                            <Text key={playerIndex} style={styles.survivorName}>
                                ✓ {playerNames[playerIndex]}
                            </Text>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleNextRound}
                    >
                        <Text style={styles.continueButtonText}>
                            {currentRound < 3 && activePlayers.length > 0 ? 'NEXT ROUND' : 'FINISH GAME'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roundTitle: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFE0B2',
        marginBottom: 10,
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    roundSubtitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 30,
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    instructionBox: {
        backgroundColor: 'rgba(139, 76, 27, 0.9)',
        borderRadius: 20,
        padding: 25,
        marginBottom: 20,
        width: '90%',
    },
    instructionText: {
        color: '#FFE0B2',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif-medium' }),
    },
    playersRemainingBox: {
        backgroundColor: '#8B4C1B',
        borderRadius: 15,
        padding: 15,
        marginBottom: 30,
    },
    playersRemainingText: {
        color: '#FFE0B2',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    startRoundButton: {
        backgroundColor: '#FFE0B2',
        borderRadius: 30,
        paddingHorizontal: 50,
        paddingVertical: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    },
    startRoundButtonText: {
        color: '#18304A',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    phaseTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFE0B2',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    scenarioCounter: {
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 20,
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif-medium' }),
    },
    scenarioCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 30,
        marginBottom: 20,
        width: '90%',
        minHeight: 200,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 12,
    },
    scenarioText: {
        color: '#18304A',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    instructionHint: {
        color: '#FFE0B2',
        fontSize: 16,
        marginBottom: 20,
        fontStyle: 'italic',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 15,
        width: '90%',
    },
    someoneLaughedButton: {
        flex: 1,
        backgroundColor: '#E74C3C',
        borderRadius: 25,
        paddingVertical: 15,
        borderWidth: 3,
        borderColor: '#C0392B',
    },
    someoneLaughedButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    nextButton: {
        flex: 1,
        backgroundColor: '#27AE60',
        borderRadius: 25,
        paddingVertical: 15,
        borderWidth: 3,
        borderColor: '#229954',
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    battleMatchup: {
        alignItems: 'center',
        marginVertical: 30,
    },
    battlePlayerName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFE0B2',
        marginVertical: 10,
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    vsText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    battleInstruction: {
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 30,
        textAlign: 'center',
    },
    startBattleButton: {
        backgroundColor: '#FFE0B2',
        borderRadius: 30,
        paddingHorizontal: 50,
        paddingVertical: 18,
    },
    startBattleButtonText: {
        color: '#18304A',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    timerText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#F39C12',
        marginBottom: 20,
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    battleButtonsContainer: {
        width: '90%',
        gap: 15,
    },
    laughedButton: {
        borderRadius: 25,
        paddingVertical: 18,
        borderWidth: 3,
    },
    player1Button: {
        backgroundColor: '#E74C3C',
        borderColor: '#C0392B',
    },
    player2Button: {
        backgroundColor: '#3498DB',
        borderColor: '#2980B9',
    },
    bothButton: {
        backgroundColor: '#9B59B6',
        borderColor: '#8E44AD',
    },
    noneButton: {
        backgroundColor: '#27AE60',
        borderColor: '#229954',
    },
    laughedButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    soundCounter: {
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 30,
    },
    playSoundButton: {
        backgroundColor: '#FFE0B2',
        borderRadius: 30,
        paddingHorizontal: 50,
        paddingVertical: 25,
        marginBottom: 30,
    },
    playSoundButtonText: {
        color: '#18304A',
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    playersList: {
        width: '90%',
        maxHeight: 300,
        marginBottom: 20,
    },
    playerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(139, 76, 27, 0.7)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
    },
    playerRowName: {
        color: '#FFE0B2',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    playerLaughedButton: {
        backgroundColor: '#E74C3C',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    playerLaughedButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    nextSoundButton: {
        backgroundColor: '#27AE60',
        borderRadius: 30,
        paddingHorizontal: 50,
        paddingVertical: 18,
    },
    nextSoundButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    resultsTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFE0B2',
        marginBottom: 30,
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    resultsBox: {
        backgroundColor: 'rgba(139, 76, 27, 0.9)',
        borderRadius: 25,
        padding: 30,
        marginBottom: 30,
        width: '90%',
    },
    resultsSubtitle: {
        color: '#FFE0B2',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    survivorName: {
        color: '#FFFFFF',
        fontSize: 20,
        marginVertical: 5,
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif-medium' }),
    },
    continueButton: {
        backgroundColor: '#FFE0B2',
        borderRadius: 30,
        paddingHorizontal: 50,
        paddingVertical: 18,
    },
    continueButtonText: {
        color: '#18304A',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
});
