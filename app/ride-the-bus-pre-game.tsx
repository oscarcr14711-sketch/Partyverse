import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../components/BackButton';
import { RuleSection, RulesModal } from '../components/RulesModal';

export default function RideTheBusPreGame() {
    const router = useRouter();
    const [showRules, setShowRules] = useState(false);

    return (
        <ImageBackground
            source={require('../assets/images/rtb.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <BackButton />
                </View>

                <View style={styles.content}>
                    <View style={styles.spacer} />

                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => router.push('/ride-the-bus-game')}
                    >
                        <Text style={styles.startButtonText}>START GAME</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoButtonWrapper}>
                    <TouchableOpacity
                        style={styles.infoButton}
                        onPress={() => setShowRules(true)}
                    >
                        <Text style={styles.infoButtonText}>i</Text>
                    </TouchableOpacity>
                </View>

                <RulesModal
                    visible={showRules}
                    onClose={() => setShowRules(false)}
                    title="Game Rules"
                    accentColor="#3CB371"
                >
                    <RuleSection title="Phase 1: Collection">
                        You will be dealt 4 cards. Before each card, you must guess:{'\n'}
                        1. Red or Black?{'\n'}
                        2. Higher or Lower?{'\n'}
                        3. Inside or Outside?{'\n'}
                        4. Guess the Suit{'\n'}
                        Wrong guess = Drink!
                    </RuleSection>
                    <RuleSection title="Phase 2: The Pyramid">
                        Cards are flipped in a pyramid. If you have a matching card, place it to make someone drink!{'\n'}
                        Row 1 = 1 Drink{'\n'}
                        Row 5 = 5 Drinks
                    </RuleSection>
                    <RuleSection title="Phase 3: Ride The Bus">
                        The player with the most cards left must Ride the Bus.{'\n'}
                        Flip cards one by one.{'\n'}
                        Number card = Safe.{'\n'}
                        Face card (J,Q,K,A) = Drink & Restart!
                    </RuleSection>
                </RulesModal>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 100,
    },
    spacer: {
        flex: 1,
    },
    startButton: {
        backgroundColor: '#263238',
        borderRadius: 30,
        paddingHorizontal: 80,
        paddingVertical: 16,
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
        borderBottomWidth: 4,
        borderBottomColor: '#1a1f23',
    },
    startButtonText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFE0B2',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    infoButtonWrapper: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        zIndex: 100,
    },
    infoButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#263238',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderBottomWidth: 3,
        borderBottomColor: '#1a1f23',
    },
    infoButtonText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFE0B2',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
});
