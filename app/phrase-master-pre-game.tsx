import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../components/BackButton';
import { RuleSection, RulesModal } from '../components/RulesModal';

export default function PhraseMasterPreGame() {
    const router = useRouter();
    const [showRules, setShowRules] = useState(false);

    return (
        <ImageBackground
            source={require('../assets/images/phrase.png')}
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
                            onPress={() => router.push({
                                pathname: '/phrase-master-game',
                                params: {
                                    players: JSON.stringify([{ id: '1', name: 'Player 1', color: '#f94144' }]),
                                    category: 'Random Mix'
                                }
                            })}
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
                    accentColor="#FF6B9D"
                >
                    <RuleSection title="Objective">
                        Guess the hidden phrase by revealing letters! Use your vocabulary skills and deduction to solve the puzzle before time runs out.
                    </RuleSection>
                    <RuleSection title="Game Flow">
                        1. A phrase is hidden with blank spaces{'\n'}
                        2. Tap letters to reveal them in the phrase{'\n'}
                        3. Correct letters appear in all positions{'\n'}
                        4. Wrong letters count against you{'\n'}
                        5. Solve the phrase before running out of guesses!
                    </RuleSection>
                    <RuleSection title="Scoring">
                        • Faster solves = Higher scores{'\n'}
                        • Fewer wrong guesses = Bonus points{'\n'}
                        • Complete phrases unlock new categories
                    </RuleSection>
                    <RuleSection title="Tips">
                        • Start with common letters (E, A, R, T){'\n'}
                        • Look for word patterns and lengths{'\n'}
                        • Use context clues from revealed letters{'\n'}
                        • Don't guess randomly - think strategically!
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
        paddingHorizontal: 60,
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
        fontSize: 24,
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
