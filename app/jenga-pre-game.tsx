import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../components/BackButton';
import { RuleSection, RulesModal } from '../components/RulesModal';

export default function JengaPreGame() {
    const router = useRouter();
    const [showRules, setShowRules] = useState(false);

    return (
        <ImageBackground
            source={require('../assets/images/stack.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <BackButton color="#FFE0B2" />
                </View>

                <View style={styles.spacer} />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => router.push('/jenga-setup')}
                    >
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
                    accentColor="#D2B48C"
                >
                    <RuleSection title="🎯 Objective">
                        Remove blocks and stack them on top without letting the tower fall!
                    </RuleSection>
                    <RuleSection title="🎮 Controls">
                        • Swipe to rotate camera{"\n"}• Tap a block to grab it{"\n"}• Drag to move the block{"\n"}• Release to place on top
                    </RuleSection>
                    <RuleSection title="⚠️ Warning">
                        Removing bottom blocks is risky! The tower collapses when unstable.
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
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
    },
    spacer: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
        paddingBottom: 60,
        paddingHorizontal: 20,
    },
    startButton: {
        backgroundColor: '#8B4513',
        borderRadius: 30,
        paddingHorizontal: 50,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
        borderBottomWidth: 4,
        borderBottomColor: '#5a2d0a',
        borderWidth: 1,
        borderColor: '#D2B48C',
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
        backgroundColor: '#8B4513',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderBottomWidth: 3,
        borderBottomColor: '#5a2d0a',
    },
    infoButtonText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFE0B2',
    },
});
