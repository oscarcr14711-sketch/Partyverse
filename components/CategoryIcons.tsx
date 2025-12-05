import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

export function ThunderIcon() {
    return (
        <LottieView
            source={require('../assets/animations/Fast Thunder yellow.json')}
            autoPlay
            loop
            style={styles.lottie}
        />
    );
}

export function BulbIcon() {
    return (
        <LottieView
            source={require('../assets/animations/Bulb.json')}
            autoPlay
            loop
            style={styles.lottie}
        />
    );
}

export function FinishFlagsIcon() {
    return (
        <LottieView
            source={require('../assets/animations/Finish flags.json')}
            autoPlay
            loop
            style={styles.lottie}
        />
    );
}

export function ChatIcon() {
    return (
        <LottieView
            source={require('../assets/animations/Chat.json')}
            autoPlay
            loop
            style={styles.lottie}
        />
    );
}

export function FireIcon() {
    return (
        <LottieView
            source={require('../assets/animations/Fire.json')}
            autoPlay
            loop
            style={styles.lottie}
        />
    );
}

export function GiftIcon() {
    return (
        <LottieView
            source={require('../assets/animations/Gift.json')}
            autoPlay
            loop
            style={styles.lottie}
        />
    );
}

export function JoyLaughIcon() {
    return (
        <LottieView
            source={require('../assets/animations/Joy Laugh Emoji.json')}
            autoPlay
            loop
            style={styles.lottie}
        />
    );
}

const styles = StyleSheet.create({
    lottie: {
        width: 64,
        height: 64,
    },
});
