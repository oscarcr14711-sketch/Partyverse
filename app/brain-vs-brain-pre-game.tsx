import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../components/BackButton';
import { RuleSection, RulesModal } from '../components/RulesModal';

export default function BrainVsBrainPreGame() {
    const router = useRouter();
    const [showRules, setShowRules] = useState(false);

    return (
        <ImageBackground
            source={require('../assets/images/bvb.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <BackButton />
                </View>

                <View style={styles.content}>
                    <View style={styles.spacer} />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={() => router.push('/brain-vs-brain-game')}
                        >
                            <Text style={styles.startButtonText}>START GAME</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.infoButton}
                            onPress={() => setShowRules(true)}
                        >
                            <Text style={styles.infoButtonText}>i</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <RulesModal
                    visible={showRules}
                    onClose={() => setShowRules(false)}
                    title="How to Play"
                    accentColor="#FFD700"
                >
                    <RuleSection title="Objective">
                        Two players compete head-to-head in a battle of wits! Answer trivia questions correctly and faster than your opponent to win.
                    </RuleSection>
                    <RuleSection title="Game Flow">
                        1. Both players see the same question{'\n'}
                        2. First to answer correctly gets the point{'\n'}
                        3. Wrong answer? Your opponent gets a chance!{'\n'}
                        4. First to reach the target score wins
                    </RuleSection>
                    <RuleSection title="Difficulty Levels">
                        • Easy: Simple questions, more time{'\n'}
                        • Medium: Moderate challenge{'\n'}
                        • Hard: Tough questions, less time
                    </RuleSection>
                    <RuleSection title="Tips">
                        • Speed matters - be quick but accurate!{'\n'}
                        • Wrong answers give your opponent an advantage{'\n'}
                        • Stay focused and think fast!
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
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 40,
    },
    startButton: {
        backgroundColor: '#263238',
        borderRadius: 30,
        paddingHorizontal: 50,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
        borderBottomWidth: 4,
        borderBottomColor: '#1a1f23',
    },
    startButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFE0B2',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
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
