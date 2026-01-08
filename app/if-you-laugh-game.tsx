import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Funny emojis for animations
const FUNNY_EMOJIS = ['😂', '🤣', '😆', '😹', '🤪', '😜', '🤡', '💀', '😵', '🫠'];

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
];

// Face-off challenges for Round 2
const FACE_OFF_CHALLENGES = [
    "🤪 Make the weirdest face possible!",
    "🦆 Do your best duck impression!",
    "🤖 Act like a malfunctioning robot!",
    "👴 Impersonate a grumpy old person!",
    "🐒 Be a confused monkey!",
    "😱 React to seeing a spider... in slow motion!",
    "🎤 Sing 'Happy Birthday' like an opera singer!",
    "🧟 Walk and talk like a zombie!",
    "🦖 Pretend you're a tiny T-Rex trying to clap!",
    "🐔 Do the chicken dance while keeping a straight face!",
    "🤓 Explain TikTok to an alien!",
    "👻 Be a ghost trying to scare someone but failing!",
    "🦸 Strike your best superhero pose and hold it!",
    "🐱 Act like a cat seeing a cucumber!",
    "🎭 Do your worst impression of your friend!",
    "🤡 Tell the worst joke you know with a serious face!",
    "🦁 Roar like a lion... but whisper it!",
    "🐍 Slither around like a snake!",
    "🎪 Juggle invisible balls!",
    "🧙 Cast a spell to make your opponent laugh!",
    "🦅 Flap your arms and pretend to fly!",
    "🐢 Move in slow motion for 10 seconds!",
    "🎸 Air guitar solo with maximum drama!",
    "🦘 Hop around like a kangaroo!",
    "🤹 Pretend you're stuck in an invisible box!",
    "🎩 Do a magic trick reveal... but there's nothing there!",
    "🦜 Repeat everything your opponent says like a parrot!",
    "🐝 Buzz around like a confused bee!",
    "🎬 Act out a dramatic movie scene!",
    "🦇 Hang upside down (or pretend to)!",
    "🦙 Spit like a llama (without actually spitting)!",
    "🎺 Play an invisible trumpet with passion!",
    "🦩 Stand on one leg like a flamingo for 10 seconds!",
    "🥷 Do a ninja move in super slow motion!",
    "🦕 Be a dinosaur discovering fire!",
    "🎻 Play the world's saddest violin!",
    "🦈 Swim like a shark with the Jaws theme!",
    "🧛 Be a vampire afraid of garlic!",
    "🦎 Stick your tongue out like a lizard!",
    "🎹 Play dramatic piano while standing!",
    "🦚 Show off your imaginary feathers!",
    "🧜 Swim like a mermaid on land!",
    "🎪 Be a circus ringmaster announcing the show!",
    "🦥 Move like a sloth trying to hurry!",
    "🎨 Paint an invisible masterpiece!",
    "🦫 Build an invisible dam!",
    "🎯 Throw invisible darts with sound effects!",
    "🦭 Clap like a seal!",
    "🎲 Roll invisible dice dramatically!",
    "🦦 Float on your back like an otter!",
    "🎰 Pull an invisible slot machine lever!",
    "🦨 Spray like a skunk (pretend)!",
    "🎪 Walk a tightrope!",
    "🦔 Roll into a ball like a hedgehog!",
    "🎭 Switch between happy and sad instantly!",
    "🦒 Stretch your neck like a giraffe!",
    "🎪 Be a clown making balloon animals!",
    "🦛 Yawn like a hippo!",
    "🎬 Direct an invisible movie scene!",
    "🦏 Charge like a rhino in slow motion!",
    "🎤 Beatbox for 5 seconds!",
    "🦓 Gallop like a zebra!",
    "🎸 Rock out on air drums!",
    "🦍 Beat your chest like a gorilla!",
];

// Laugh Trap content for Round 3
const LAUGH_TRAPS = [
    { type: 'sound', content: '💨 FART SOUND!', emoji: '💨', soundId: 'fart' },
    { type: 'sound', content: '👶 BABY LAUGH!', emoji: '👶', soundId: 'baby' },
    { type: 'sound', content: '🦆 DUCK QUACK!', emoji: '🦆', soundId: 'duck' },
    { type: 'sound', content: '😑 BRUH MOMENT!', emoji: '😑', soundId: 'bruh' },
    { type: 'phrase', content: "My spirit animal is a depressed tamale.", emoji: '🫔' },
    { type: 'phrase', content: "I am 95% water and 5% bad decisions.", emoji: '💧' },
    { type: 'phrase', content: "I identify as a confused potato.", emoji: '🥔' },
    { type: 'phrase', content: "My brain is buffering, please wait…", emoji: '🔄' },
    { type: 'challenge', content: "Say your full name like a dramatic villain!", emoji: '🦹' },
    { type: 'challenge', content: "Act like a robot without laughing!", emoji: '🤖' },
    { type: 'challenge', content: "Do your best impression of a broken washing machine!", emoji: '🌀' },
    { type: 'challenge', content: "Pretend you're a confused GPS!", emoji: '🗺️' },
    { type: 'animation', content: "Watch this... 🐵💃", emoji: '🐵' },
    { type: 'animation', content: "Confused cat loading... 🐱❓", emoji: '🐱' },
];

// Confetti particle component
const ConfettiParticle = ({ delay, x }: { delay: number; x: number }) => {
    const translateY = useSharedValue(-50);
    const translateX = useSharedValue(x);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(1);
    const color = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A855F7', '#22D3EE'][Math.floor(Math.random() * 5)];

    useEffect(() => {
        translateY.value = withTiming(SCREEN_HEIGHT + 100, { duration: 2000 + delay, easing: Easing.linear });
        translateX.value = withRepeat(withSequence(
            withTiming(x + 30, { duration: 300 }),
            withTiming(x - 30, { duration: 300 })
        ), -1, true);
        rotate.value = withRepeat(withTiming(360, { duration: 1000 }), -1);
        opacity.value = withTiming(0, { duration: 2500 + delay });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
            { rotate: `${rotate.value}deg` }
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.confetti, animatedStyle, { backgroundColor: color }]} />
    );
};

// Bouncing emoji component
const BouncingEmoji = ({ emoji, startX, startY, delay }: { emoji: string; startX: number; startY: number; delay: number }) => {
    const scale = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);

    useEffect(() => {
        setTimeout(() => {
            scale.value = withSequence(
                withSpring(1.2, { damping: 5 }),
                withSpring(1)
            );
            translateY.value = withRepeat(
                withSequence(
                    withTiming(-30, { duration: 400, easing: Easing.out(Easing.quad) }),
                    withTiming(0, { duration: 400, easing: Easing.in(Easing.quad) })
                ),
                -1,
                true
            );
            rotate.value = withRepeat(
                withSequence(
                    withTiming(-15, { duration: 200 }),
                    withTiming(15, { duration: 400 }),
                    withTiming(-15, { duration: 200 })
                ),
                -1,
                true
            );
        }, delay);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateY: translateY.value },
            { rotate: `${rotate.value}deg` }
        ],
    }));

    return (
        <Animated.Text style={[styles.bouncingEmoji, animatedStyle, { left: startX, top: startY }]}>
            {emoji}
        </Animated.Text>
    );
};

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
    const [showConfetti, setShowConfetti] = useState(false);
    const [showEliminated, setShowEliminated] = useState(false);
    const [trapRevealed, setTrapRevealed] = useState(false);
    const [cameraMode, setCameraMode] = useState(false);

    const [permission, requestPermission] = useCameraPermissions();
    const soundRef = useRef<Audio.Sound | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cameraRef = useRef<CameraView>(null);

    // Animation values
    const screenShake = useSharedValue(0);
    const timerScale = useSharedValue(1);
    const eliminatedFlash = useSharedValue(0);
    const trapCardScale = useSharedValue(0);
    const backgroundPulse = useSharedValue(1);

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
    const [shuffledTraps] = useState(() => shuffleArray(LAUGH_TRAPS));

    // Round 3 specific state
    const [round3PlayerIndex, setRound3PlayerIndex] = useState(0);
    const [trapPhase, setTrapPhase] = useState<'PASS_PHONE' | 'VIEW_TRAP' | 'RESULT'>('PASS_PHONE');

    // Round 2 specific state
    const [scores, setScores] = useState<Record<number, number>>({});
    const [matchups, setMatchups] = useState<Array<[number, number]>>([]);
    const [currentMatchupIndex, setCurrentMatchupIndex] = useState(0);
    const [currentChallenge, setCurrentChallenge] = useState('');
    const [shuffledChallenges] = useState(() => shuffleArray(FACE_OFF_CHALLENGES));
    const [round2SubRound, setRound2SubRound] = useState(1); // Track which of the 3 sub-rounds we're in

    useEffect(() => {
        const players = Array.from({ length: playerCount }, (_, i) => i);
        setActivePlayers(players);
        setPlayerNames(players.map((_, i) => `Player ${i + 1}`));
    }, []);

    // Timer with pulsing animation
    useEffect(() => {
        if ((gamePhase === 'ROUND_2_BATTLE' || (gamePhase === 'ROUND_3_GAMEPLAY' && trapPhase === 'VIEW_TRAP')) && timeRemaining > 0) {
            // Pulse timer faster as time runs out
            const pulseSpeed = Math.max(200, 1000 - (5 - timeRemaining) * 150);
            timerScale.value = withRepeat(
                withSequence(
                    withTiming(1.2, { duration: pulseSpeed / 2 }),
                    withTiming(1, { duration: pulseSpeed / 2 })
                ),
                -1
            );

            timerRef.current = setTimeout(() => {
                setTimeRemaining(prev => prev - 1);
                if (timeRemaining <= 3) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                }
            }, 1000);
        } else if (gamePhase === 'ROUND_3_GAMEPLAY' && trapPhase === 'VIEW_TRAP' && timeRemaining === 0) {
            cancelAnimation(timerScale);
            timerScale.value = 1;
            setTrapPhase('RESULT');
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [timeRemaining, gamePhase, trapPhase]);

    // Screen shake animation
    const triggerScreenShake = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        screenShake.value = withSequence(
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(5, { duration: 50 }),
            withTiming(-5, { duration: 50 }),
            withTiming(0, { duration: 50 })
        );
    };

    // Confetti animation
    const triggerConfetti = () => {
        setShowConfetti(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    // Eliminated flash effect
    const triggerEliminatedEffect = () => {
        setShowEliminated(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        eliminatedFlash.value = withSequence(
            withTiming(1, { duration: 100 }),
            withTiming(0, { duration: 200 }),
            withTiming(1, { duration: 100 }),
            withTiming(0, { duration: 200 })
        );
        setTimeout(() => setShowEliminated(false), 600);
    };

    // Reveal trap with animation
    const revealTrap = () => {
        setTrapRevealed(true);
        triggerScreenShake();
        trapCardScale.value = withSequence(
            withSpring(1.1, { damping: 5 }),
            withSpring(1)
        );
        // Play sound if it's a sound trap
        const currentTrap = shuffledTraps[round3PlayerIndex % shuffledTraps.length];
        if (currentTrap.type === 'sound') {
            playFunnySound(currentTrap.soundId);
        }
    };

    // Play funny sounds
    const playFunnySound = async (soundId?: string) => {
        try {
            // For now, use a placeholder beep - you can add real sounds later
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/wasted.mp3'),
                { shouldPlay: true, volume: 0.5 }
            );
            soundRef.current = sound;
            setTimeout(() => sound.unloadAsync(), 2000);
        } catch (error) {
            console.log('Sound play error:', error);
        }
    };

    const eliminatePlayer = (playerIndex: number) => {
        triggerEliminatedEffect();
        setActivePlayers(prev => prev.filter(p => p !== playerIndex));
    };

    const handleStartRound = () => {
        if (currentRound === 1) {
            setGamePhase('ROUND_1_GAMEPLAY');
            setCurrentScenarioIndex(0);
        } else if (currentRound === 2) {
            setRound2SubRound(1); // Reset sub-round counter
            setGamePhase('ROUND_2_SETUP');
            setupNextBattle();
        } else if (currentRound === 3) {
            setGamePhase('ROUND_3_GAMEPLAY');
            setRound3PlayerIndex(0);
            setTrapPhase('PASS_PHONE');
            setTrapRevealed(false);
        }
    };

    const setupNextBattle = () => {
        if (Object.keys(scores).length === 0) {
            const initialScores: Record<number, number> = {};
            activePlayers.forEach(p => initialScores[p] = 0);
            setScores(initialScores);
        }

        if (matchups.length === 0) {
            const shuffled = shuffleArray([...activePlayers]);
            const newMatchups: Array<[number, number]> = [];

            for (let i = 0; i < shuffled.length - 1; i += 2) {
                newMatchups.push([shuffled[i], shuffled[i + 1]]);
            }

            if (shuffled.length % 2 !== 0) {
                const oddPlayer = shuffled[shuffled.length - 1];
                setScores(prev => ({ ...prev, [oddPlayer]: (prev[oddPlayer] || 0) + 1 }));
            }

            setMatchups(newMatchups);
            setCurrentMatchupIndex(0);

            if (newMatchups.length > 0) {
                setBattlePlayer1(newMatchups[0][0]);
                setBattlePlayer2(newMatchups[0][1]);
                setCurrentChallenge(shuffledChallenges[0 % shuffledChallenges.length]);
                setTimeRemaining(60);
            } else {
                handleRoundComplete();
            }
        } else {
            if (currentMatchupIndex < matchups.length) {
                setBattlePlayer1(matchups[currentMatchupIndex][0]);
                setBattlePlayer2(matchups[currentMatchupIndex][1]);
                setCurrentChallenge(shuffledChallenges[currentMatchupIndex % shuffledChallenges.length]);
                setTimeRemaining(60);
            } else {
                handleRoundComplete();
            }
        }
    };

    const handleNextScenario = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (currentScenarioIndex < shuffledJokes.length - 1) {
            setCurrentScenarioIndex(prev => prev + 1);
        } else {
            handleRoundComplete();
        }
    };

    const handleBattleResult = (loser: 'player1' | 'player2' | 'both' | 'none') => {
        if (battlePlayer1 === null || battlePlayer2 === null) return;

        if (loser === 'player1' || loser === 'player2') {
            triggerEliminatedEffect();
        } else if (loser === 'none') {
            triggerConfetti();
        }

        setScores(prev => {
            const newScores = { ...prev };
            if (loser === 'player1') {
                newScores[battlePlayer2!] = (newScores[battlePlayer2!] || 0) + 1;
            } else if (loser === 'player2') {
                newScores[battlePlayer1!] = (newScores[battlePlayer1!] || 0) + 1;
            } else if (loser === 'none') {
                newScores[battlePlayer1!] = (newScores[battlePlayer1!] || 0) + 1;
                newScores[battlePlayer2!] = (newScores[battlePlayer2!] || 0) + 1;
            }
            return newScores;
        });

        const nextIndex = currentMatchupIndex + 1;
        setCurrentMatchupIndex(nextIndex);

        if (nextIndex < matchups.length) {
            // Continue with next matchup in current sub-round
            setTimeout(() => {
                setBattlePlayer1(matchups[nextIndex][0]);
                setBattlePlayer2(matchups[nextIndex][1]);
                setCurrentChallenge(shuffledChallenges[(nextIndex + (round2SubRound - 1) * matchups.length) % shuffledChallenges.length]);
                setTimeRemaining(60);
            }, 1000);
        } else if (round2SubRound < 3) {
            // Completed current sub-round, start next sub-round
            setTimeout(() => {
                setRound2SubRound(prev => prev + 1);
                setCurrentMatchupIndex(0);
                setBattlePlayer1(matchups[0][0]);
                setBattlePlayer2(matchups[0][1]);
                setCurrentChallenge(shuffledChallenges[(round2SubRound * matchups.length) % shuffledChallenges.length]);
                setTimeRemaining(60);
                setGamePhase('ROUND_2_SETUP');
            }, 1500);
        } else {
            // Completed all 3 sub-rounds
            handleRoundComplete();
        }
    };
    const startTrap = () => {
        setTrapPhase('VIEW_TRAP');
        setTimeRemaining(5);
        setTrapRevealed(false);

        // Delay the reveal for dramatic effect
        setTimeout(() => {
            revealTrap();
        }, 500);
    };

    const handleTrapResult = (laughed: boolean) => {
        let nextPlayers = [...activePlayers];
        let nextIndex = round3PlayerIndex;

        if (laughed) {
            triggerEliminatedEffect();
            nextPlayers = nextPlayers.filter((_, i) => i !== round3PlayerIndex);
            setActivePlayers(nextPlayers);
        } else {
            triggerConfetti();
            nextIndex++;
            setRound3PlayerIndex(nextIndex);
        }

        if (nextIndex >= nextPlayers.length || nextPlayers.length <= 1) {
            handleRoundComplete();
        } else {
            setTrapPhase('PASS_PHONE');
            setTrapRevealed(false);
        }
    };

    const handleRoundComplete = () => {
        setGamePhase('ROUND_RESULTS');
    };

    const handleNextRound = () => {
        if (activePlayers.length === 0) {
            router.push({
                pathname: '/if-you-laugh-game-over',
                params: { winner: 'No one', players: JSON.stringify(playerNames) }
            } as any);
        } else if (currentRound < 2) {
            setCurrentRound((prev) => (prev + 1) as 1 | 2);
            setGamePhase('ROUND_INTRO');
            setMatchups([]);
            setCurrentMatchupIndex(0);
        } else {
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

    // Animated styles
    const screenShakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: screenShake.value }]
    }));

    const timerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: timerScale.value }]
    }));

    const trapCardAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: trapCardScale.value }]
    }));

    const eliminatedFlashStyle = useAnimatedStyle(() => ({
        opacity: eliminatedFlash.value,
    }));

    // Generate confetti particles
    const confettiParticles = showConfetti ? Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * SCREEN_WIDTH,
        delay: Math.random() * 500
    })) : [];

    // Generate bouncing emojis for trap view
    const bouncingEmojis = trapRevealed ? Array.from({ length: 6 }, (_, i) => ({
        id: i,
        emoji: FUNNY_EMOJIS[Math.floor(Math.random() * FUNNY_EMOJIS.length)],
        x: 20 + Math.random() * (SCREEN_WIDTH - 80),
        y: 100 + Math.random() * 200,
        delay: i * 100
    })) : [];

    // Round Intro Screen
    if (gamePhase === 'ROUND_INTRO') {
        const roundTitles = ['', '😂 FUNNY SCENARIOS', '🥊 FACE-OFF'];
        const roundDesc = ['', 'Try not to laugh at these jokes!', 'Make each other crack up!'];

        return (
            <ImageBackground source={require('../assets/images/laughbg.png')} style={styles.container} resizeMode="cover">
                <View style={styles.overlay}>
                    <Text style={styles.roundNumber}>ROUND {currentRound}</Text>
                    <Text style={styles.roundTitle}>{roundTitles[currentRound]}</Text>
                    <Text style={styles.roundDesc}>{roundDesc[currentRound]}</Text>

                    <View style={styles.playersBox}>
                        <Text style={styles.playersText}>👥 {activePlayers.length} Players</Text>
                    </View>

                    <TouchableOpacity style={styles.bigButton} onPress={handleStartRound}>
                        <Text style={styles.bigButtonText}>START ROUND</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

    // Round 1: Funny Scenarios
    if (gamePhase === 'ROUND_1_GAMEPLAY') {
        return (
            <ImageBackground source={require('../assets/images/laughbg.png')} style={styles.container} resizeMode="cover">
                <Animated.View style={[styles.overlay, screenShakeStyle]}>
                    <Text style={styles.phaseTitle}>😂 JOKE #{currentScenarioIndex + 1}</Text>

                    <View style={styles.jokeCard}>
                        <Text style={styles.jokeText}>{shuffledJokes[currentScenarioIndex]}</Text>
                    </View>

                    <Text style={styles.hint}>Read it out loud! 📢</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.laughedBtn} onPress={triggerScreenShake}>
                            <Text style={styles.btnText}>😆 LAUGHED!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.nextBtn} onPress={handleNextScenario}>
                            <Text style={styles.btnText}>NEXT ➡️</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ImageBackground>
        );
    }

    // Round 2: Setup
    if (gamePhase === 'ROUND_2_SETUP') {
        return (
            <ImageBackground source={require('../assets/images/laughbg.png')} style={styles.container} resizeMode="cover">
                <View style={styles.overlay}>
                    <Text style={styles.phaseTitle}>🥊 FACE-OFF! (Round {round2SubRound}/3)</Text>
                    <View style={styles.vsContainer}>
                        <Text style={styles.playerName}>{playerNames[battlePlayer1!]}</Text>
                        <Text style={styles.vsText}>VS</Text>
                        <Text style={styles.playerName}>{playerNames[battlePlayer2!]}</Text>
                    </View>
                    <Text style={styles.hint}>Match {currentMatchupIndex + 1} of {matchups.length}</Text>
                    <TouchableOpacity style={styles.bigButton} onPress={() => setGamePhase('ROUND_2_BATTLE')}>
                        <Text style={styles.bigButtonText}>FIGHT! 🔔</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

    // Round 2: Battle
    if (gamePhase === 'ROUND_2_BATTLE') {
        return (
            <ImageBackground source={require('../assets/images/laughbg.png')} style={styles.container} resizeMode="cover">
                <Animated.View style={[styles.overlay, screenShakeStyle]}>
                    {showEliminated && <Animated.View style={[styles.eliminatedFlash, eliminatedFlashStyle]} />}

                    <Animated.Text style={[styles.bigTimer, timerAnimatedStyle, timeRemaining <= 5 && styles.timerRed]}>
                        {formatTime(timeRemaining)}
                    </Animated.Text>

                    <View style={styles.vsContainer}>
                        <Text style={styles.playerName}>{playerNames[battlePlayer1!]}</Text>
                        <Text style={styles.vsText}>🆚</Text>
                        <Text style={styles.playerName}>{playerNames[battlePlayer2!]}</Text>
                    </View>

                    <View style={styles.challengeCard}>
                        <Text style={styles.challengeText}>{currentChallenge}</Text>
                    </View>

                    <View style={styles.battleButtons}>
                        <TouchableOpacity style={[styles.resultBtn, styles.redBtn]} onPress={() => handleBattleResult('player1')}>
                            <Text style={styles.btnText}>{playerNames[battlePlayer1!]} 😂</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.resultBtn, styles.blueBtn]} onPress={() => handleBattleResult('player2')}>
                            <Text style={styles.btnText}>{playerNames[battlePlayer2!]} 😂</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.resultBtn, styles.purpleBtn]} onPress={() => handleBattleResult('both')}>
                            <Text style={styles.btnText}>BOTH LAUGHED 🤣</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.resultBtn, styles.greenBtn]} onPress={() => handleBattleResult('none')}>
                            <Text style={styles.btnText}>NEITHER 😐</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {showConfetti && confettiParticles.map(p => (
                    <ConfettiParticle key={p.id} delay={p.delay} x={p.x} />
                ))}
            </ImageBackground>
        );
    }

    // Round 3: Laugh Traps
    if (gamePhase === 'ROUND_3_GAMEPLAY') {
        const currentPlayerName = playerNames[activePlayers[round3PlayerIndex]];
        const currentTrap = shuffledTraps[round3PlayerIndex % shuffledTraps.length];

        if (trapPhase === 'PASS_PHONE') {
            return (
                <ImageBackground source={require('../assets/images/laughbg.png')} style={styles.container} resizeMode="cover">
                    <View style={styles.overlay}>
                        <Text style={styles.phaseTitle}>🎭 LAUGH TRAP</Text>
                        <Text style={styles.passText}>Pass phone to:</Text>
                        <Text style={styles.bigPlayerName}>{currentPlayerName}</Text>

                        {/* Camera Mode Toggle */}
                        <TouchableOpacity
                            style={[styles.cameraToggle, cameraMode && styles.cameraToggleActive]}
                            onPress={() => {
                                if (!permission?.granted) {
                                    requestPermission();
                                }
                                setCameraMode(!cameraMode);
                            }}
                        >
                            <Text style={styles.cameraToggleText}>
                                {cameraMode ? '📹 Camera ON' : '📷 Enable Camera'}
                            </Text>
                        </TouchableOpacity>

                        {cameraMode && permission?.granted && (
                            <View style={styles.cameraPreview}>
                                <CameraView ref={cameraRef} style={styles.camera} facing="front" />
                                <Text style={styles.cameraHint}>👁️ Watch their face!</Text>
                            </View>
                        )}

                        <Text style={styles.hint}>Everyone else: Watch for a smile! 👀</Text>
                        <TouchableOpacity style={styles.bigButton} onPress={startTrap}>
                            <Text style={styles.bigButtonText}>I'M READY 💪</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            );
        }

        if (trapPhase === 'VIEW_TRAP') {
            return (
                <ImageBackground source={require('../assets/images/laughbg.png')} style={styles.container} resizeMode="cover">
                    <Animated.View style={[styles.overlay, screenShakeStyle]}>
                        {bouncingEmojis.map(e => (
                            <BouncingEmoji key={e.id} emoji={e.emoji} startX={e.x} startY={e.y} delay={e.delay} />
                        ))}

                        <Animated.Text style={[styles.bigTimer, timerAnimatedStyle, timeRemaining <= 2 && styles.timerRed]}>
                            {timeRemaining}
                        </Animated.Text>

                        {trapRevealed ? (
                            <Animated.View style={[styles.trapCard, trapCardAnimatedStyle]}>
                                <Text style={styles.trapEmoji}>{currentTrap.emoji}</Text>
                                <Text style={styles.trapType}>
                                    {currentTrap.type === 'sound' ? '🔊 SOUND' :
                                        currentTrap.type === 'phrase' ? '💬 SAY THIS' :
                                            currentTrap.type === 'challenge' ? '🎬 DO THIS' : '👀 WATCH'}
                                </Text>
                                <Text style={styles.trapContent}>{currentTrap.content}</Text>
                            </Animated.View>
                        ) : (
                            <View style={styles.trapCard}>
                                <Text style={styles.trapEmoji}>❓</Text>
                                <Text style={styles.trapContent}>Get ready...</Text>
                            </View>
                        )}

                        <Text style={styles.dontLaugh}>DON'T LAUGH! 🤐</Text>
                    </Animated.View>
                </ImageBackground>
            );
        }

        if (trapPhase === 'RESULT') {
            return (
                <ImageBackground source={require('../assets/images/laughbg.png')} style={styles.container} resizeMode="cover">
                    <Animated.View style={[styles.overlay, screenShakeStyle]}>
                        {showEliminated && <Animated.View style={[styles.eliminatedFlash, eliminatedFlashStyle]} />}

                        <Text style={styles.phaseTitle}>⏰ TIME'S UP!</Text>
                        <Text style={styles.questionText}>Did {currentPlayerName} laugh? 🤔</Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.laughedBtn} onPress={() => handleTrapResult(true)}>
                                <Text style={styles.btnText}>😂 YES</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.nextBtn} onPress={() => handleTrapResult(false)}>
                                <Text style={styles.btnText}>😐 NO</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {showConfetti && confettiParticles.map(p => (
                        <ConfettiParticle key={p.id} delay={p.delay} x={p.x} />
                    ))}
                </ImageBackground>
            );
        }
    }

    // Round Results
    if (gamePhase === 'ROUND_RESULTS') {
        return (
            <ImageBackground source={require('../assets/images/laughbg.png')} style={styles.container} resizeMode="cover">
                <View style={styles.overlay}>
                    <Text style={styles.phaseTitle}>🏆 ROUND {currentRound} COMPLETE!</Text>

                    <View style={styles.resultsCard}>
                        <Text style={styles.survivorsTitle}>Survivors: {activePlayers.length}</Text>
                        {activePlayers.map((p, i) => (
                            <Text key={p} style={styles.survivorName}>
                                {i === 0 ? '👑 ' : '✓ '}{playerNames[p]}
                            </Text>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.bigButton} onPress={handleNextRound}>
                        <Text style={styles.bigButtonText}>
                            {currentRound < 3 && activePlayers.length > 0 ? 'NEXT ROUND ➡️' : 'SEE RESULTS 🎉'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    overlay: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },

    // Round intro
    roundNumber: { fontSize: 28, color: '#FFE0B2', fontWeight: '600', marginBottom: 5 },
    roundTitle: { fontSize: 38, fontWeight: 'bold', color: '#fff', marginBottom: 10, textAlign: 'center' },
    roundDesc: { fontSize: 18, color: '#FFE0B2', marginBottom: 30, textAlign: 'center' },
    playersBox: { backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20, paddingHorizontal: 25, paddingVertical: 12, marginBottom: 40 },
    playersText: { fontSize: 20, color: '#fff', fontWeight: 'bold' },

    // Buttons
    bigButton: { backgroundColor: '#FFE0B2', borderRadius: 30, paddingHorizontal: 50, paddingVertical: 18, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 8 },
    bigButtonText: { fontSize: 22, fontWeight: 'bold', color: '#18304A' },
    buttonRow: { flexDirection: 'row', gap: 12, width: '100%' },
    laughedBtn: { flex: 1, backgroundColor: '#E74C3C', borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
    nextBtn: { flex: 1, backgroundColor: '#27AE60', borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
    btnText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },

    // Phase title
    phaseTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFE0B2', marginBottom: 20, textAlign: 'center' },
    hint: { fontSize: 16, color: '#FFE0B2', marginBottom: 20, fontStyle: 'italic' },

    // Joke card
    jokeCard: { backgroundColor: '#fff', borderRadius: 25, padding: 30, marginBottom: 25, width: '95%', minHeight: 180, justifyContent: 'center', elevation: 10 },
    jokeText: { fontSize: 22, color: '#18304A', textAlign: 'center', fontWeight: '600', lineHeight: 32 },

    // Battle/VS
    vsContainer: { alignItems: 'center', marginVertical: 25 },
    playerName: { fontSize: 26, fontWeight: 'bold', color: '#FFE0B2', marginVertical: 8 },
    bigPlayerName: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginVertical: 15 },
    vsText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },

    // Challenge card
    challengeCard: { backgroundColor: '#fff', borderRadius: 20, padding: 25, marginVertical: 20, width: '90%', elevation: 10 },
    challengeText: { fontSize: 20, color: '#18304A', textAlign: 'center', fontWeight: '700', lineHeight: 28 },

    // Timer
    bigTimer: { fontSize: 72, fontWeight: 'bold', color: '#F39C12', marginBottom: 15 },
    timerRed: { color: '#E74C3C' },

    // Battle buttons
    battleButtons: { width: '100%', gap: 12 },
    resultBtn: { borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
    redBtn: { backgroundColor: '#E74C3C' },
    blueBtn: { backgroundColor: '#3498DB' },
    purpleBtn: { backgroundColor: '#9B59B6' },
    greenBtn: { backgroundColor: '#27AE60' },

    // Trap
    passText: { fontSize: 22, color: '#FFE0B2', marginBottom: 10 },
    trapCard: { backgroundColor: '#fff', borderRadius: 25, padding: 35, marginVertical: 20, width: '90%', alignItems: 'center', elevation: 15 },
    trapEmoji: { fontSize: 60, marginBottom: 15 },
    trapType: { fontSize: 18, fontWeight: 'bold', color: '#8B4513', marginBottom: 10 },
    trapContent: { fontSize: 24, color: '#18304A', textAlign: 'center', fontWeight: '600', lineHeight: 32 },
    dontLaugh: { fontSize: 20, fontWeight: 'bold', color: '#E74C3C', marginTop: 20 },
    questionText: { fontSize: 24, color: '#fff', marginBottom: 30, textAlign: 'center' },

    // Results
    resultsCard: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 25, marginBottom: 30, width: '90%' },
    survivorsTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFE0B2', marginBottom: 15, textAlign: 'center' },
    survivorName: { fontSize: 20, color: '#fff', marginVertical: 5 },

    // Effects
    eliminatedFlash: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#E74C3C' },
    confetti: { position: 'absolute', width: 10, height: 10, borderRadius: 5 },
    bouncingEmoji: { position: 'absolute', fontSize: 40 },

    // Camera
    cameraToggle: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 25, paddingVertical: 12, marginVertical: 15, borderWidth: 2, borderColor: '#FFE0B2' },
    cameraToggleActive: { backgroundColor: '#27AE60', borderColor: '#2ECC71' },
    cameraToggleText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
    cameraPreview: { width: '90%', height: 200, borderRadius: 20, overflow: 'hidden', marginVertical: 15, borderWidth: 3, borderColor: '#FFE0B2', position: 'relative' },
    camera: { flex: 1 },
    cameraHint: { position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 14, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 5 },
});
