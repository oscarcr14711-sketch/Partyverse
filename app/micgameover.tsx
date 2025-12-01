import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PulsingButton } from '../components/PulsingButton';

export default function MicGameOverScreen() {
    const router = useRouter();
    const { playerNames, finalScores } = useLocalSearchParams();

    // Parse player names or use defaults if not provided
    const players = playerNames
        ? JSON.parse(playerNames as string)
        : ["Craig", "John", "Sarah"];

    // Parse final scores or use defaults
    const parsedScores = finalScores ? JSON.parse(finalScores as string) : {};

    // Map players to scores and sort
    const scores = players.map((player: string, index: number) => ({
        name: player,
        score: parsedScores[player] || 0,
        avatar: index % 6 // Cycle through 6 avatars
    })).sort((a: any, b: any) => b.score - a.score); // Sort by score descending

    const avatarImages = [
        require('../assets/images/avatars/avatar1.png'),
        require('../assets/images/avatars/avatar2.png'),
        require('../assets/images/avatars/avatar3.png'),
        require('../assets/images/avatars/avatar4.png'),
        require('../assets/images/avatars/avatar5.png'),
        require('../assets/images/avatars/avatar6.png'),
    ];

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerText}>Who got the best singing spirit?</Text>
                <Text style={styles.titleText}>GAME OVER</Text>

                {/* Illustration */}
                <Image
                    source={require('../assets/images/singer.png')}
                    style={styles.illustration}
                    resizeMode="contain"
                />

                {/* Scoreboard */}
                <View style={styles.scoreboardContainer}>
                    {scores.map((player: any, index: number) => (
                        <View
                            key={index}
                            style={[
                                styles.scoreRow,
                                // Removed alternating colors to match the solid button look requested
                                { borderBottomWidth: index < scores.length - 1 ? 1 : 0, borderBottomColor: 'rgba(255, 224, 178, 0.2)' }
                            ]}
                        >
                            <View style={styles.playerInfo}>
                                <Image source={avatarImages[player.avatar]} style={styles.avatar} />
                                <Text style={[
                                    styles.playerName,
                                    { color: '#FFE0B2' } // Cream color
                                ]}>
                                    {player.name}
                                </Text>
                            </View>
                            <Text style={[
                                styles.scoreText,
                                { color: '#FFE0B2' } // Cream color
                            ]}>
                                {player.score}
                            </Text>
                        </View>
                    ))}
                </View>

                <PulsingButton
                    style={styles.homeButton}
                    onPress={() => router.push('/mic-madness-pre-game')}
                >
                    <Text style={styles.homeButtonText}>Play Again</Text>
                </PulsingButton>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#114D2D', // Dark green background matching PreGameScreen
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 22,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 60,
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif-medium' }),
    },
    titleText: {
        fontSize: 48,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 2,
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    illustration: {
        width: 280,
        height: 280,
        marginBottom: 30,
    },
    scoreboardContainer: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#1a1f23', // Dark border matching PreGameScreen button border
        backgroundColor: '#263238', // Black/Dark Grey background
        marginBottom: 30,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#FFE0B2', // Cream border for avatar
    },
    playerName: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    scoreText: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    homeButton: {
        backgroundColor: '#263238', // Black/Dark Grey background
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderBottomWidth: 4,
        borderBottomColor: '#1a1f23', // Dark border
    },
    homeButtonText: {
        color: '#FFE0B2', // Cream color
        fontSize: 20,
        fontWeight: 'bold',
    },
});
