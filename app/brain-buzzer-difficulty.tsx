import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PulsingButton } from '../components/PulsingButton';

export default function BrainBuzzerDifficulty() {
    const router = useRouter();
    const { numPlayers } = useLocalSearchParams();

    const handleSelectDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
        router.push({
            pathname: '/brain-buzzer-game',
            params: {
                numPlayers,
                difficulty
            }
        });
    };

    return (
        <LinearGradient
            colors={['#18304A', '#0A1E3D']}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Select Difficulty</Text>
                <Text style={styles.subtitle}>Choose your challenge level</Text>

                <View style={styles.buttonsContainer}>
                    <PulsingButton
                        style={[styles.difficultyButton, styles.easyButton]}
                        onPress={() => handleSelectDifficulty('easy')}
                    >
                        <Text style={styles.buttonEmoji}>😊</Text>
                        <View>
                            <Text style={styles.buttonTitle}>EASY</Text>
                            <Text style={styles.buttonDesc}>Fun & Simple Trick Questions</Text>
                        </View>
                    </PulsingButton>

                    <PulsingButton
                        style={[styles.difficultyButton, styles.mediumButton]}
                        onPress={() => handleSelectDifficulty('medium')}
                    >
                        <Text style={styles.buttonEmoji}>🤔</Text>
                        <View>
                            <Text style={styles.buttonTitle}>MEDIUM</Text>
                            <Text style={styles.buttonDesc}>Requires Some Thinking</Text>
                        </View>
                    </PulsingButton>

                    <PulsingButton
                        style={[styles.difficultyButton, styles.hardButton]}
                        onPress={() => handleSelectDifficulty('hard')}
                    >
                        <Text style={styles.buttonEmoji}>🤯</Text>
                        <View>
                            <Text style={styles.buttonTitle}>HARD</Text>
                            <Text style={styles.buttonDesc}>Brain Melting Riddles</Text>
                        </View>
                    </PulsingButton>
                </View>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>BACK</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFC107',
        marginBottom: 10,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' } }),
    },
    subtitle: {
        fontSize: 18,
        color: '#FFF',
        marginBottom: 40,
        textAlign: 'center',
        opacity: 0.8,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Medium' } }),
    },
    buttonsContainer: {
        width: '100%',
        gap: 20,
        marginBottom: 40,
    },
    difficultyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        borderWidth: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    easyButton: {
        backgroundColor: '#4CAF50',
        borderColor: '#2E7D32',
    },
    mediumButton: {
        backgroundColor: '#FF9800',
        borderColor: '#F57C00',
    },
    hardButton: {
        backgroundColor: '#F44336',
        borderColor: '#C62828',
    },
    buttonEmoji: {
        fontSize: 40,
        marginRight: 20,
    },
    buttonTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' } }),
    },
    buttonDesc: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Medium' } }),
    },
    backButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    backButtonText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
