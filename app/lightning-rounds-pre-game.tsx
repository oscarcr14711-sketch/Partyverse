import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RuleSection, RulesModal } from '../components/RulesModal';

const { width, height } = Dimensions.get('window');

export default function LightningRoundsPreGame() {
    const router = useRouter();
    const [showRules, setShowRules] = useState(false);

    const startGame = () => {
        // Default 4 players
        const players = [
            { id: 1, name: 'Player 1', avatarIndex: 0 },
            { id: 2, name: 'Player 2', avatarIndex: 1 },
            { id: 3, name: 'Player 3', avatarIndex: 2 },
            { id: 4, name: 'Player 4', avatarIndex: 3 },
        ];
        router.push({
            pathname: '/lightning-rounds-game',
            params: { players: JSON.stringify(players) }
        });
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/rounds.png')}
                style={styles.backgroundImage}
                resizeMode="contain"
                imageStyle={{ alignSelf: 'center' }}
            >
                <SafeAreaView style={styles.safeArea}>
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>

                    {/* Spacer to push buttons to bottom */}
                    <View style={styles.spacer} />

                    {/* Buttons Container */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.startButton} onPress={startGame}>
                            <Text style={styles.startButtonText}>START GAME</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.infoButton} onPress={() => setShowRules(true)}>
                            <Text style={styles.infoButtonText}>i</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

                {/* Rules Modal */}
                <RulesModal
                    visible={showRules}
                    onClose={() => setShowRules(false)}
                    title="How to Play"
                    accentColor="#f9c74f"
                >
                    <RuleSection title="⚡ Objective">
                        Complete physical challenges faster than everyone else! Last person to finish gets a STRIKE. 3 strikes = OUT!
                    </RuleSection>
                    <RuleSection title="🎮 How It Works">
                        • A challenge appears on screen{'\n'}
                        • Everyone races to complete it{'\n'}
                        • Phone holder taps when someone is last{'\n'}
                        • That player gets a STRIKE
                    </RuleSection>
                    <RuleSection title="🏆 Winning">
                        • 3 strikes and you're eliminated{'\n'}
                        • Last player standing wins!{'\n'}
                        • Stay fast, stay alert!
                    </RuleSection>
                    <RuleSection title="💡 Tips">
                        • Clear some space to move around{'\n'}
                        • Watch the challenge carefully{'\n'}
                        • Be honest - no cheating!
                    </RuleSection>
                </RulesModal>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b99e66', // Darker sand to match rounds.png background
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    emojiContainer: {
        paddingTop: 40,
        alignItems: 'center',
    },
    lightningEmoji: {
        fontSize: 80,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
    },
    spacer: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40,
        gap: 15,
    },
    startButton: {
        flex: 1,
        backgroundColor: '#f8961e',
        borderRadius: 30,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
        borderBottomWidth: 4,
        borderBottomColor: '#d97706',
        borderWidth: 1,
        borderColor: '#fbbf24',
    },
    startButtonText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    infoButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f8961e',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderBottomWidth: 3,
        borderBottomColor: '#d97706',
    },
    infoButtonText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        ...Platform.select({ ios: { fontFamily: 'Georgia' }, android: { fontFamily: 'serif' } }),
    },
});

