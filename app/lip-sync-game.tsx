import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Easy phrases for rounds 1-5
const EASY_PHRASES = [
    "I love pizza",
    "Happy birthday to you",
    "Let's go to the beach",
    "You're my best friend",
    "What time is it",
    "I need a vacation",
    "This is so much fun",
    "Coffee is my favorite",
    "The weather is beautiful",
    "I love this song",
    "Can you hear me now",
    "That's hilarious",
    "I'm so excited",
    "This game is awesome",
    "You look amazing",
    "I'm starving right now",
    "Let's dance all night",
    "I forgot my password",
    "The movie was incredible",
    "I need more sleep",
    "That's a great idea",
    "I'm running late",
    "This is delicious",
    "You're the best",
    "I love chocolate",
    "That's so funny",
    "I'm so tired",
    "This is amazing",
    "You're so talented",
    "I'm having a blast",
    "That's perfect",
    "I need a break",
    "This is wonderful",
    "You're so kind",
    "I'm so happy",
    "That's incredible",
    "I love music",
    "You're a superstar",
    "I'm feeling awesome",
    "That's fantastic",
    "I need some water",
    "See you later",
    "Good morning sunshine",
    "Have a great day",
    "Sweet dreams tonight",
    "Thank you so much",
    "You're welcome friend",
    "I'm feeling lucky",
    "Let's have some fun",
    "Party time everyone",
    "Music makes me happy",
    "Dance like nobody's watching",
    "Smile for the camera",
    "High five buddy",
    "You rock my world",
];

// Medium difficulty phrases for rounds 6-10 (slightly longer, more challenging)
const HARD_PHRASES = [
    "I can't believe it's not butter",
    "The cat jumped over the moon",
    "I'm feeling lucky today",
    "I can't stop laughing right now",
    "You're absolutely right about that",
    "I'm so confused by this",
    "That's completely unbelievable",
    "I'm feeling great this morning",
    "This is absolutely crazy",
    "Let's go get some ice cream",
    "I forgot where I put my keys",
    "The sunset looks beautiful tonight",
    "I really need a coffee break",
    "You're my favorite person ever",
    "I'm so proud of you",
    "That was the best movie ever",
    "I love dancing in the rain",
    "This pizza tastes amazing",
    "You make me so happy",
    "I'm having the time of my life",
    "Let's take a selfie together",
    "I can't wait for the weekend",
    "You're such a good friend",
    "This party is so much fun",
    "I love your sense of humor",
    "That joke was really funny",
    "I'm so excited for tomorrow",
    "You always make me smile",
    "I need to charge my phone",
    "Let's order some food now",
    "I'm running really late today",
    "You look fantastic in that outfit",
    "I love this song so much",
    "Let's go on an adventure",
    "I'm feeling super energized today",
    "You're an amazing dancer",
    "I can't stop thinking about it",
    "Let's make some memories tonight",
    "I'm so grateful for you",
    "You're the life of the party",
    "I love spending time with you",
    "Let's stay up all night",
    "I'm having such a good time",
    "You're incredibly talented at this",
    "I can't believe we did that",
    "Let's do this again soon",
    "I'm so happy right now",
    "You're such a great person",
    "I love your positive energy",
    "Let's celebrate this moment",
];

const MUSIC_FILES = [
    require('../assets/sounds/la_vida.mp3'),
    require('../assets/sounds/hard_rock.mp3'),
    require('../assets/sounds/replicant_world.mp3'),
    require('../assets/sounds/sport_bass.mp3'),
    require('../assets/sounds/teknoaxe.mp3'),
    require('../assets/sounds/west.mp3'),
    require('../assets/sounds/wiser.mp3'),
    require('../assets/sounds/wasted.mp3'),
    require('../assets/sounds/dream_again.mp3'),
    require('../assets/sounds/good_times.mp3'),
];

const SONG_NAMES = [
    'LA VIDA\nCryJaxx, MVRPHiN',
    'Hard Rock\nInstrumental',
    'REPLICANT WORLD\nMike Chino',
    'Sport Bass\nInfraction',
    'Strip Away the Polish\nTeknoAXE',
    'West\nSilent Partner',
    'Wiser\nRiot',
    'Wasted\nThe Reynalds',
    'Dream Again\nThe Reynalds',
    'Good Times\nThe Reynalds',
];

function AnimatedWaveform({ isPlaying }: { isPlaying: boolean }) {
    const bar1 = useRef(new Animated.Value(0.3)).current;
    const bar2 = useRef(new Animated.Value(0.5)).current;
    const bar3 = useRef(new Animated.Value(0.7)).current;
    const bar4 = useRef(new Animated.Value(0.4)).current;
    const bar5 = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        if (isPlaying) {
            const animate = (value: Animated.Value, delay: number) => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(value, {
                            toValue: 1,
                            duration: 300 + delay,
                            useNativeDriver: true,
                        }),
                        Animated.timing(value, {
                            toValue: 0.2,
                            duration: 300 + delay,
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            };

            animate(bar1, 0);
            animate(bar2, 50);
            animate(bar3, 100);
            animate(bar4, 150);
            animate(bar5, 200);
        } else {
            bar1.setValue(0.3);
            bar2.setValue(0.5);
            bar3.setValue(0.7);
            bar4.setValue(0.4);
            bar5.setValue(0.6);
        }
    }, [isPlaying]);

    return (
        <View style={styles.waveformContainer}>
            {[bar1, bar2, bar3, bar4, bar5].map((bar, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.waveformBar,
                        {
                            transform: [{ scaleY: bar }],
                        },
                    ]}
                />
            ))}
        </View>
    );
}

export default function LipSyncGame() {
    const router = useRouter();
    const { numPlayers } = useLocalSearchParams();
    const playerCount = numPlayers ? parseInt(numPlayers as string) : 3;

    const [currentRound, setCurrentRound] = useState(1);
    const [gamePhase, setGamePhase] = useState<'ENTER_NAMES' | 'SELECT_GUESSER' | 'HEADPHONES' | 'SHOW_PHRASE' | 'SCORING'>('ENTER_NAMES');
    const [selectedGuesser, setSelectedGuesser] = useState<number | null>(null);
    const [currentPhrase, setCurrentPhrase] = useState('');
    const [scores, setScores] = useState<{ [key: number]: number }>({});
    const [playerNames, setPlayerNames] = useState<string[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [currentSong, setCurrentSong] = useState('');

    const soundRef = useRef<Audio.Sound | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const MAX_ROUNDS = 10;

    const avatarImages = [
        require('../assets/images/avatars/avatar1.png'),
        require('../assets/images/avatars/avatar2.png'),
        require('../assets/images/avatars/avatar3.png'),
        require('../assets/images/avatars/avatar4.png'),
        require('../assets/images/avatars/avatar5.png'),
        require('../assets/images/avatars/avatar6.png'),
    ];

    useEffect(() => {
        const initialScores: { [key: number]: number } = {};
        const initialNames: string[] = [];
        for (let i = 0; i < playerCount; i++) {
            initialScores[i] = 0;
            initialNames.push('');
        }
        setScores(initialScores);
        setPlayerNames(initialNames);
    }, []);

    useEffect(() => {
        return () => {
            if (soundRef.current) {
                (async () => {
                    try {
                        const status = await soundRef.current?.getStatusAsync();
                        if (status?.isLoaded) {
                            await soundRef.current?.stopAsync();
                            await soundRef.current?.unloadAsync();
                        }
                    } catch (e) { }
                })();
            }
        };
    }, []);

    useEffect(() => {
        if (gamePhase !== 'SHOW_PHRASE' && isPlaying) {
            stopMusic();
        }
    }, [gamePhase]);

    useEffect(() => {
        if (gamePhase === 'SHOW_PHRASE' && isPlaying && timeRemaining > 0) {
            timerRef.current = setTimeout(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            stopMusic();
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [timeRemaining, isPlaying, gamePhase]);

    const getRandomPhrase = () => {
        // Use easy phrases for rounds 1-5, hard phrases for rounds 6-10
        const phrasePool = currentRound <= 5 ? EASY_PHRASES : HARD_PHRASES;
        const randomIndex = Math.floor(Math.random() * phrasePool.length);
        return phrasePool[randomIndex];
    };

    const handleNameChange = (index: number, name: string) => {
        const newNames = [...playerNames];
        newNames[index] = name;
        setPlayerNames(newNames);
    };

    const handleStartGame = (firstGuesserIndex: number) => {
        const allNamesFilled = playerNames.every(name => name.trim() !== '');
        if (allNamesFilled) {
            setSelectedGuesser(firstGuesserIndex);
            setGamePhase('HEADPHONES');
        }
    };

    const handleGuesserSelect = (playerIndex: number) => {
        setSelectedGuesser(playerIndex);
        setGamePhase('HEADPHONES');
    };

    const handleHeadphonesReady = () => {
        const phrase = getRandomPhrase();
        setCurrentPhrase(phrase);
        setGamePhase('SHOW_PHRASE');
        setTimeRemaining(60);
        playMusic();
    };

    const playMusic = async () => {
        try {
            console.log('🎵 Starting music playback...');

            const { status } = await Audio.requestPermissionsAsync();
            console.log('Audio permission status:', status);

            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: false,
            });

            console.log('Audio mode set successfully');

            const randomIndex = Math.floor(Math.random() * MUSIC_FILES.length);
            const selectedMusic = MUSIC_FILES[randomIndex];
            setCurrentSong(SONG_NAMES[randomIndex]);

            console.log('Selected music index:', randomIndex);
            console.log('Loading audio file...');

            const { sound } = await Audio.Sound.createAsync(
                selectedMusic,
                { shouldPlay: true, volume: 1.0, isLooping: true }
            );

            soundRef.current = sound;
            console.log('✅ Audio loaded and playing!');

            setIsPlaying(true);
        } catch (error) {
            console.error('❌ Error playing music:', error);
            alert(`Music error: ${error}`);
        }
    };

    const stopMusic = async () => {
        try {
            if (soundRef.current) {
                try {
                    const status = await soundRef.current.getStatusAsync();
                    if (status.isLoaded) {
                        await soundRef.current.stopAsync();
                        await soundRef.current.unloadAsync();
                    }
                } catch (err) {
                    console.log('Sound already unloaded or error getting status');
                }
                soundRef.current = null;
            }
            setIsPlaying(false);
        } catch (error) {
            console.error('Error stopping music:', error);
            soundRef.current = null;
            setIsPlaying(false);
        }
    };

    const handleDoneGuessing = () => {
        stopMusic();
        setGamePhase('SCORING');
    };

    const handleScoring = (correct: boolean) => {
        if (correct && selectedGuesser !== null) {
            setScores(prev => ({
                ...prev,
                [selectedGuesser]: (prev[selectedGuesser] || 0) + 100
            }));
        }

        if (currentRound >= MAX_ROUNDS) {
            const playerData = playerNames.map((name, index) => ({
                name: name || `Player ${index + 1}`,
                score: scores[index] || 0
            }));
            router.push({
                pathname: '/lip-sync-game-over',
                params: {
                    players: JSON.stringify(playerData)
                }
            } as any);
        } else {
            setCurrentRound(prev => prev + 1);
            setGamePhase('SELECT_GUESSER');
            setSelectedGuesser(null);
            setCurrentPhrase('');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (gamePhase === 'SHOW_PHRASE') {
        return (
            <ImageBackground
                source={require('../assets/images/musiccard.png')}
                style={styles.phraseScreenFullContainer}
                resizeMode="cover"
            >
                <View style={styles.musicPlayerOverlay}>
                    <Text style={styles.nowPlayingMini}>♪ NOW PLAYING</Text>
                    <AnimatedWaveform isPlaying={isPlaying} />
                    <Text style={styles.songNameText}>{currentSong}</Text>
                </View>

                <View style={styles.speechBubbleArea}>
                    <Text style={styles.phraseText}>{currentPhrase}</Text>
                </View>

                <View style={styles.bottomControls}>
                    <Text style={styles.timerDisplay}>{formatTime(timeRemaining)}</Text>
                    <TouchableOpacity
                        style={styles.doneButton}
                        onPress={handleDoneGuessing}
                    >
                        <Text style={styles.doneButtonText}>DONE GUESSING</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground
            source={require('../assets/images/lip.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <View style={styles.roundContainer}>
                    <Text style={styles.roundText}>Round {currentRound}/{MAX_ROUNDS}</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {gamePhase === 'ENTER_NAMES' && (
                        <View style={styles.phaseContainer}>
                            <Text style={styles.phaseTitle}>Who's wearing headphones first?</Text>
                            <Text style={styles.phaseSubtitle}>Enter names and select the first guesser</Text>

                            <View style={styles.namesContainer}>
                                {[...Array(playerCount)].map((_, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.nameInputContainer}
                                        onPress={() => handleStartGame(index)}
                                        disabled={!playerNames.every(name => name.trim() !== '')}
                                    >
                                        <Image
                                            source={avatarImages[index % avatarImages.length]}
                                            style={styles.nameAvatar}
                                        />
                                        <TextInput
                                            style={styles.nameInput}
                                            placeholder={`Player ${index + 1}`}
                                            placeholderTextColor="#999"
                                            value={playerNames[index]}
                                            onChangeText={(text) => handleNameChange(index, text)}
                                            maxLength={15}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.instructionHint}>Tap a player to select them as the first guesser</Text>
                        </View>
                    )}

                    {gamePhase === 'SELECT_GUESSER' && (
                        <View style={styles.phaseContainer}>
                            <Text style={styles.phaseTitle}>Who's wearing headphones?</Text>
                            <Text style={styles.phaseSubtitle}>Select the guesser</Text>

                            <View style={styles.playersGrid}>
                                {[...Array(playerCount)].map((_, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.playerCard}
                                        onPress={() => handleGuesserSelect(index)}
                                    >
                                        <Image
                                            source={avatarImages[index % avatarImages.length]}
                                            style={styles.playerAvatar}
                                        />
                                        <Text style={styles.playerLabel}>{playerNames[index]}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {gamePhase === 'HEADPHONES' && (
                        <View style={styles.phaseContainer}>
                            <Text style={styles.phaseTitle}>🎧 Put on Headphones</Text>
                            <View style={styles.instructionBox}>
                                <Text style={styles.instructionText}>{playerNames[selectedGuesser!]}:</Text>
                                <Text style={styles.instructionText}>1. Put on your headphones</Text>
                                <Text style={styles.instructionText}>2. Music will play for a minute</Text>
                                <Text style={styles.instructionText}>3. Close your eyes or look away</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.readyButton}
                                onPress={handleHeadphonesReady}
                            >
                                <Text style={styles.readyButtonText}>I'M READY</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {gamePhase === 'SCORING' && (
                        <View style={styles.phaseContainer}>
                            <Text style={styles.phaseTitle}>The phrase was:</Text>

                            <View style={styles.phraseCard}>
                                <Text style={styles.phraseTextScoring}>{currentPhrase}</Text>
                            </View>

                            <Text style={styles.scoringQuestion}>Did {playerNames[selectedGuesser!]} guess correctly?</Text>

                            <View style={styles.scoringButtons}>
                                <TouchableOpacity
                                    style={[styles.scoringButton, styles.yesButton]}
                                    onPress={() => handleScoring(true)}
                                >
                                    <Text style={styles.scoringButtonText}>✓ YES</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.scoringButton, styles.noButton]}
                                    onPress={() => handleScoring(false)}
                                >
                                    <Text style={styles.scoringButtonText}>✗ NO</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(13, 37, 63, 0.85)',
    },
    roundContainer: {
        backgroundColor: 'rgba(26, 188, 156, 0.9)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 50,
        borderWidth: 2,
        borderColor: '#1ABC9C',
    },
    roundText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    phaseContainer: {
        width: '100%',
        alignItems: 'center',
    },
    phaseTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFE0B2',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 8,
    },
    phaseSubtitle: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif-medium' }),
    },
    namesContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    nameInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 77, 64, 0.9)',
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#1ABC9C',
        width: '90%',
    },
    nameAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#1ABC9C',
    },
    nameInput: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 18,
        color: '#0D253F',
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif-medium' }),
    },
    instructionHint: {
        color: '#FFE0B2',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif-medium' }),
    },
    playersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
    },
    playerCard: {
        backgroundColor: 'rgba(0, 77, 64, 0.9)',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1ABC9C',
        width: 120,
    },
    playerAvatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#1ABC9C',
    },
    playerLabel: {
        color: '#FFE0B2',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    instructionBox: {
        backgroundColor: 'rgba(0, 77, 64, 0.9)',
        borderRadius: 20,
        padding: 25,
        marginBottom: 30,
        borderWidth: 2,
        borderColor: '#1ABC9C',
        width: '90%',
    },
    instructionText: {
        color: '#FFFFFF',
        fontSize: 18,
        marginBottom: 12,
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif-medium' }),
    },
    readyButton: {
        backgroundColor: '#1ABC9C',
        paddingHorizontal: 60,
        paddingVertical: 18,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#16A085',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    },
    readyButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    phraseScreenFullContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    musicPlayerOverlay: {
        backgroundColor: 'rgba(45, 45, 68, 0.95)',
        borderRadius: 15,
        padding: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1ABC9C',
        position: 'absolute',
        top: '68%',
        alignSelf: 'center',
        width: '85%',
    },
    nowPlayingMini: {
        color: '#1ABC9C',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 8,
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    waveformContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        gap: 4,
        marginVertical: 8,
    },
    waveformBar: {
        width: 4,
        height: 30,
        backgroundColor: '#1ABC9C',
        borderRadius: 2,
    },
    songNameText: {
        color: '#FFFFFF',
        fontSize: 11,
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif-medium' }),
        lineHeight: 14,
    },
    speechBubbleArea: {
        position: 'absolute',
        top: '32%',
        alignSelf: 'center',
        width: '75%',
    },
    phraseText: {
        color: '#0D253F',
        fontSize: 42,
        fontWeight: '900',
        textAlign: 'center',
        fontFamily: Platform.select({
            ios: 'Chalkboard SE',
            android: 'sans-serif-black'
        }),
        letterSpacing: 0.5,
    },
    bottomControls: {
        width: '90%',
        alignItems: 'center',
        gap: 15,
        alignSelf: 'center',
        position: 'absolute',
        bottom: 30,
    },
    timerDisplay: {
        color: '#F39C12',
        fontSize: 48,
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    doneButton: {
        backgroundColor: '#1ABC9C',
        paddingHorizontal: 50,
        paddingVertical: 18,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#16A085',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    },
    doneButtonText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    phraseCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 30,
        marginVertical: 20,
        width: '90%',
        borderWidth: 4,
        borderColor: '#1ABC9C',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 12,
    },
    phraseTextScoring: {
        color: '#0D253F',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    scoringQuestion: {
        color: '#FFFFFF',
        fontSize: 20,
        marginVertical: 20,
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif-medium' }),
    },
    scoringButtons: {
        flexDirection: 'row',
        gap: 20,
    },
    scoringButton: {
        paddingHorizontal: 40,
        paddingVertical: 18,
        borderRadius: 30,
        borderWidth: 3,
        minWidth: 120,
    },
    yesButton: {
        backgroundColor: '#27AE60',
        borderColor: '#229954',
    },
    noButton: {
        backgroundColor: '#E74C3C',
        borderColor: '#C0392B',
    },
    scoringButtonText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
});
