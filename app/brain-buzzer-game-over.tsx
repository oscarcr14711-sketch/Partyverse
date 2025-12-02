import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BrainBuzzerGameOver() {
    const router = useRouter();
    const { winner, scores } = useLocalSearchParams();
    const playerScores = scores ? JSON.parse(scores as string) : [];

    return (
        <LinearGradient
            colors={['#18304A', '#0A1E3D']}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>🧠 GAME OVER! 🧠</Text>

                <View style={styles.winnerCard}>
                    <Text style={styles.winnerLabel}>WINNER</Text>
                    <Text style={styles.winnerName}>{winner}</Text>
                </View>

                <View style={styles.scoresContainer}>
                    <Text style={styles.scoresTitle}>Final Scores</Text>
                    {playerScores.map((score: number, index: number) => (
                        <View key={index} style={styles.scoreRow}>
                            <Text style={styles.playerName}>Player {index + 1}</Text>
                            <Text style={styles.playerScore}>{score} points</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.playAgainButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.playAgainText}>PLAY AGAIN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() => router.push('/(tabs)/home')}
                    >
                        <Text style={styles.homeButtonText}>HOME</Text>
                    </TouchableOpacity>
                </View>
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
        marginBottom: 40,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' } }),
    },
    winnerCard: {
        backgroundColor: '#FFC107',
        borderRadius: 25,
        padding: 30,
        marginBottom: 40,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 15,
        borderWidth: 4,
        borderColor: '#FFA000',
    },
    winnerLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#18304A',
        marginBottom: 10,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' } }),
    },
    winnerName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#18304A',
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' } }),
    },
    scoresContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        marginBottom: 40,
    },
    scoresTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFC107',
        marginBottom: 15,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' } }),
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    },
    playerName: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' } }),
    },
    playerScore: {
        fontSize: 18,
        color: '#FFC107',
        fontWeight: 'bold',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' } }),
    },
    buttonsContainer: {
        width: '90%',
        gap: 15,
    },
    playAgainButton: {
        backgroundColor: '#FFC107',
        borderRadius: 25,
        paddingVertical: 18,
        borderWidth: 3,
        borderColor: '#FFA000',
    },
    playAgainText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#18304A',
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' } }),
    },
    homeButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        paddingVertical: 18,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    homeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' } }),
    },
});
