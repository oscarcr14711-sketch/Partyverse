import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IfYouLaughGameOver() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const winner = params.winner as string || 'No one';
    const players = JSON.parse(params.players as string || '[]');

    return (
        <LinearGradient
            colors={['#18304A', '#8B4C1B', '#18304A']}
            style={styles.container}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
        >
            <View style={styles.radialOverlay} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Game Over Title */}
                <Text style={styles.gameOverText}>GAME OVER</Text>

                {/* Character Image */}
                <Image
                    source={require('../assets/images/laugh.png')}
                    style={styles.characterImage}
                    resizeMode="contain"
                />

                {/* Decorative Emojis */}
                <Text style={[styles.emoji, styles.emoji1]}>😂</Text>
                <Text style={[styles.emoji, styles.emoji2]}>🤣</Text>
                <Text style={[styles.emoji, styles.emoji3]}>😆</Text>
                <Text style={[styles.emoji, styles.emoji4]}>😄</Text>

                {/* Winner Card */}
                <View style={styles.winnerCard}>
                    <Text style={styles.winnerTitle}>🏆 WINNER 🏆</Text>
                    <Text style={styles.winnerName}>{winner}</Text>
                    <Text style={styles.winnerSubtitle}>Kept a straight face!</Text>
                </View>

                {/* All Players List */}
                <View style={styles.playersCard}>
                    <Text style={styles.playersTitle}>ALL PLAYERS</Text>
                    {players.map((playerName: string, index: number) => (
                        <View key={index} style={styles.playerRow}>
                            <Text style={styles.playerName}>
                                {playerName === winner ? '👑 ' : ''}
                                {playerName}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.playAgainButton}
                        onPress={() => router.push('/if-you-laugh-you-lose')}
                    >
                        <Text style={styles.playAgainText}>PLAY AGAIN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() => router.push('/')}
                    >
                        <Text style={styles.homeText}>HOME</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    radialOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    gameOverText: {
        fontSize: 56,
        fontWeight: 'bold',
        color: '#FFE0B2',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 10,
        letterSpacing: 2,
    },
    characterImage: {
        width: 280,
        height: 280,
        marginBottom: 20,
    },
    emoji: {
        position: 'absolute',
        fontSize: 40,
        fontWeight: 'bold',
    },
    emoji1: {
        top: '20%',
        left: '10%',
    },
    emoji2: {
        top: '25%',
        right: '10%',
    },
    emoji3: {
        top: '35%',
        left: '15%',
    },
    emoji4: {
        top: '40%',
        right: '15%',
    },
    winnerCard: {
        backgroundColor: '#8B4C1B',
        borderRadius: 25,
        borderWidth: 4,
        borderColor: '#FFE0B2',
        padding: 25,
        width: '90%',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 15,
        alignItems: 'center',
    },
    winnerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFE0B2',
        textAlign: 'center',
        marginBottom: 15,
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    winnerName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    winnerSubtitle: {
        fontSize: 18,
        color: '#FFE0B2',
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif-medium' }),
    },
    playersCard: {
        backgroundColor: 'rgba(24, 48, 74, 0.9)',
        borderRadius: 25,
        borderWidth: 4,
        borderColor: '#8B4C1B',
        padding: 25,
        width: '90%',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 15,
    },
    playersTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFE0B2',
        textAlign: 'center',
        marginBottom: 15,
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    playerRow: {
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(255, 224, 178, 0.3)',
    },
    playerName: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: '600',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    buttonContainer: {
        width: '90%',
        gap: 15,
    },
    playAgainButton: {
        backgroundColor: '#FFE0B2',
        paddingVertical: 18,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#8B4C1B',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    },
    playAgainText: {
        color: '#18304A',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    homeButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 18,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#FFE0B2',
    },
    homeText: {
        color: '#FFE0B2',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
});
