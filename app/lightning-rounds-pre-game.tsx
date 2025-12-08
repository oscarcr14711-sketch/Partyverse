import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
            <SafeAreaView style={styles.safeArea}>
                {/* Main Image - Full Width, Proper Fit */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/images/rounds.png')}
                        style={styles.mainImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Buttons Container */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.startButton} onPress={startGame}>
                        <Text style={styles.startButtonText}>START GAME</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.infoButton} onPress={() => setShowRules(true)}>
                        <Text style={styles.infoButtonText}>i</Text>
                    </TouchableOpacity>
                </View>

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
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9c74f', // Fallback yellow bg matching lightning theme
    },
    safeArea: {
        flex: 1,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0,
    },
    mainImage: {
        width: width,
        height: height * 0.75,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 30,
        gap: 15,
    },
    startButton: {
        flex: 1,
        backgroundColor: '#f8961e',
        paddingVertical: 20,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 3,
        borderColor: '#fff',
    },
    startButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    infoButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f8961e',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    infoButtonText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        ...Platform.select({ ios: { fontFamily: 'Georgia' }, android: { fontFamily: 'serif' } }),
    },
});
