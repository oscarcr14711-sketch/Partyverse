import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LipSyncGameOver() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const players = JSON.parse(params.players as string || '[]');

    // Sort players by score in descending order
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    return (
        <LinearGradient
            colors={['#4A1A5C', '#7B2D8F', '#4A1A5C']}
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
                    source={require('../assets/images/lipsync.png')}
                    style={styles.characterImage}
                    resizeMode="contain"
                />

                {/* Decorative Music Notes */}
                <Text style={[styles.musicNote, styles.musicNote1]}>♪</Text>
                <Text style={[styles.musicNote, styles.musicNote2]}>♫</Text>
                <Text style={[styles.musicNote, styles.musicNote3]}>♪</Text>
                <Text style={[styles.musicNote, styles.musicNote4]}>♫</Text>

                {/* Score Table */}
                <View style={styles.scoreCard}>
                    <Text style={styles.scoreTitle}>SCORE</Text>
                    {sortedPlayers.map((player, index) => (
                        <View key={index} style={styles.scoreRow}>
                            <Text style={styles.playerName}>{player.name}:</Text>
                            <Text style={styles.playerScore}>{player.score}</Text>
                        </View>
                    ))}
                    <View style={[styles.scoreRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalScore}>
                            {sortedPlayers.reduce((sum, p) => sum + p.score, 0)}
                        </Text>
                    </View>
                </View>

                {/* Band Promotion Section */}
                <View style={styles.bandSection}>
                    <Image
                        source={require('../assets/images/Reynalds.jpeg')}
                        style={styles.bandImage}
                        resizeMode="cover"
                    />
                    <View style={styles.bandTextContainer}>
                        <Text style={styles.bandText}>Listen to</Text>
                        <Text style={styles.bandName}>"The Reynalds"</Text>
                        <Text style={styles.bandPlatforms}>on Apple Music</Text>
                        <Text style={styles.bandPlatforms}>and Spotify</Text>
                    </View>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.playAgainButton}
                        onPress={() => router.push('/lip-sync-pre-game')}
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
        </LinearGradient >
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
    musicNote: {
        position: 'absolute',
        fontSize: 40,
        color: '#FF9800',
        fontWeight: 'bold',
    },
    musicNote1: {
        top: '20%',
        left: '10%',
    },
    musicNote2: {
        top: '25%',
        right: '10%',
        color: '#2196F3',
    },
    musicNote3: {
        top: '35%',
        left: '15%',
        color: '#2196F3',
    },
    musicNote4: {
        top: '40%',
        right: '15%',
        color: '#FF9800',
    },
    scoreCard: {
        backgroundColor: '#1A2332',
        borderRadius: 25,
        borderWidth: 4,
        borderColor: '#FF9800',
        padding: 25,
        width: '90%',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 15,
    },
    scoreTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FF9800',
        textAlign: 'center',
        marginBottom: 15,
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(255, 152, 0, 0.3)',
    },
    playerName: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: '600',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    playerScore: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    totalRow: {
        borderBottomWidth: 0,
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 3,
        borderTopColor: '#FF9800',
    },
    totalLabel: {
        fontSize: 26,
        color: '#FFE0B2',
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    totalScore: {
        fontSize: 26,
        color: '#FFE0B2',
        fontWeight: 'bold',
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    bandSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 15,
        width: '90%',
        marginBottom: 30,
        borderWidth: 2,
        borderColor: 'rgba(255, 224, 178, 0.3)',
    },
    bandImage: {
        width: 120,
        height: 120,
        borderRadius: 15,
        borderWidth: 3,
        borderColor: '#FFE0B2',
    },
    bandTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    bandText: {
        fontSize: 20,
        color: '#FFE0B2',
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif-medium' }),
    },
    bandName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFE0B2',
        marginVertical: 5,
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
    bandPlatforms: {
        fontSize: 18,
        color: '#FFE0B2',
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif-medium' }),
    },
    buttonContainer: {
        width: '90%',
        gap: 15,
    },
    playAgainButton: {
        backgroundColor: '#1ABC9C',
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
    playAgainText: {
        color: '#FFFFFF',
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
