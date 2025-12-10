import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Pack 2 - 15 NEW extreme challenges
const challenges: string[] = [
    'Wasabi Shot',           // 0
    'Cold Shower',           // 1
    'Spin and Seek',         // 2
    'Wild Song',             // 3
    'Pickle Jar',            // 4
    'Blindfold Walk',        // 5
    'Vinegar Shot',          // 6
    'Prank Call',            // 7
    'Spicy Noodles',         // 8
    'Tweet It',              // 9
    'Headstand',             // 10
    'Mystery Bite',          // 11
    'Loud Confession',       // 12
    'Ice Bath Hand',         // 13
    'Dance Off'              // 14
];

// Challenge descriptions for pop-outs
const challengeDescriptions: { [key: number]: string } = {
    0: 'Take a full spoonful of wasabi! 🔥',
    1: '30 seconds of ice-cold shower! 🥶',
    2: 'Spin 10 times, then find an object others pick! 🌀',
    3: 'Sing a song as loud and embarrassingly as possible! 🎤',
    4: 'Drink a shot of pickle juice! 🥒',
    5: 'Walk to the kitchen blindfolded! 🙈',
    6: 'Take a shot of pure vinegar! 🍶',
    7: 'Make a prank call to a random contact! 📞',
    8: 'Eat the spiciest instant noodles available! 🍜',
    9: 'Post something random on social media (can delete after)! 📱',
    10: 'Do a 30-second headstand or attempt! 🤸',
    11: 'Eat a mystery food combo chosen by others! 🍽️',
    12: 'Yell a confession out the window! 📢',
    13: 'Keep your hand in ice water for 30 seconds! 🧊',
    14: '1-minute solo dance to a random song! 💃'
};

export default function ExtremeRoulettePack2Screen() {
    const router = require('expo-router').useRouter();
    const screenWidth = Dimensions.get('window').width;
    const rouletteSize = screenWidth;
    const [currentIndex, setCurrentIndex] = useState(0);
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const blockCount = challenges.length;
    const blockAngle = 360 / blockCount;

    const [showChallenge, setShowChallenge] = useState(false);
    const flipAnim = useRef(new Animated.Value(0)).current;
    const [hasSpun, setHasSpun] = useState(false);

    useEffect(() => {
        if (hasSpun) {
            setShowChallenge(true);
            flipAnim.setValue(0);
            Animated.timing(flipAnim, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true
            }).start();
        }
    }, [currentIndex, hasSpun]);

    const handleHideChallenge = () => setShowChallenge(false);

    const spinRoulette = () => {
        setHasSpun(true);
        setShowChallenge(false);
        const nextIndex = Math.floor(Math.random() * blockCount);
        const extraSpins = 4;
        const manualImageOffset = -12;
        rotateAnim.setValue(0);
        const targetRotation = nextIndex * blockAngle + manualImageOffset + extraSpins * 360;
        Animated.timing(rotateAnim, {
            toValue: targetRotation,
            duration: 2500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start(() => {
            setCurrentIndex(nextIndex);
        });
    };

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
    });
    const staticOffset = -12;

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/telon1.png')}
                style={styles.background}
                resizeMode="cover"
            />

            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>🔥 EXTREME PACK 2 🔥</Text>
            </View>

            {/* Lights animation */}
            <View style={[styles.lightsContainer, { width: rouletteSize }]}>
                <LottieView
                    source={require('../assets/animations/lights.json')}
                    autoPlay
                    loop
                    style={{ width: rouletteSize, height: 260 }}
                />
            </View>

            {/* Roulette */}
            <View style={[styles.rouletteContainer, { width: rouletteSize, height: rouletteSize }]}>
                <Animated.Image
                    source={require('../assets/images/Roulettenew.png')}
                    style={[
                        { width: rouletteSize, height: rouletteSize },
                        { transform: [{ rotate: currentIndex === 0 && !hasSpun ? `${staticOffset}deg` : rotateInterpolate }] }
                    ]}
                    resizeMode="contain"
                />
                <Image
                    source={require('../assets/images/Arrow.png')}
                    style={[styles.arrow, { left: rouletteSize / 2 - 32 }]}
                    resizeMode="contain"
                />

                {/* Challenge Pop-out */}
                {showChallenge && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.popOutTouchable}
                        onPress={handleHideChallenge}
                    >
                        <Animated.View style={[
                            styles.popOutContainer,
                            {
                                transform: [
                                    { rotateY: flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) },
                                    { scale: flipAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }
                                ]
                            }
                        ]}>
                            <View style={styles.challengeCard}>
                                <Text style={styles.challengeName}>{challenges[currentIndex]}</Text>
                                <Text style={styles.challengeDesc}>{challengeDescriptions[currentIndex]}</Text>
                                <Text style={styles.tapHint}>Tap to dismiss</Text>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                )}
            </View>

            {/* Spin Button */}
            <TouchableOpacity onPress={spinRoulette} style={styles.spinButton} activeOpacity={0.7}>
                <Image
                    source={require('../assets/images/Button.png')}
                    style={{ width: 120, height: 120 }}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            {/* Finish Button */}
            <TouchableOpacity
                style={styles.finishButton}
                onPress={() => router.push('/game-over-screen')}
            >
                <Text style={styles.finishText}>Finish</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: -1,
    },
    titleContainer: {
        position: 'absolute',
        top: 60,
        zIndex: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: '#ff4500',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    lightsContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 32,
        marginBottom: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
    },
    rouletteContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: -72,
        marginBottom: 8,
    },
    arrow: {
        width: 64,
        height: 64,
        position: 'absolute',
        top: -32,
        zIndex: 10,
    },
    popOutTouchable: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 100,
        transform: [{ translateX: -140 }, { translateY: -100 }],
    },
    popOutContainer: {
        width: 280,
        justifyContent: 'center',
        alignItems: 'center',
    },
    challengeCard: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#ff4500',
        shadowColor: '#ff4500',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 20,
    },
    challengeName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ff4500',
        marginBottom: 12,
        textAlign: 'center',
    },
    challengeDesc: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 24,
    },
    tapHint: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 16,
    },
    spinButton: {
        marginTop: 32,
        alignSelf: 'center',
    },
    finishButton: {
        position: 'absolute',
        bottom: 24,
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 28,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    finishText: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
});
