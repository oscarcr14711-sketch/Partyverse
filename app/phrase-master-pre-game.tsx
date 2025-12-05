import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.spacer} />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={() => router.push('/phrase-master-game')}
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

                {/* Rules Modal */}
                <Modal
                    visible={showRules}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowRules(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>How to Play</Text>
                                <TouchableOpacity onPress={() => setShowRules(false)}>
                                    <Ionicons name="close" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.modalScroll}>
                                <Text style={styles.sectionTitle}>Objective</Text>
                                <Text style={styles.ruleText}>
                                    Guess the hidden phrase by revealing letters! Use your vocabulary skills and deduction to solve the puzzle before time runs out.
                                </Text>

                                <Text style={styles.sectionTitle}>Game Flow</Text>
                                <Text style={styles.ruleText}>
                                    1. A phrase is hidden with blank spaces
                                    {'\n'}2. Tap letters to reveal them in the phrase
                                    {'\n'}3. Correct letters appear in all positions
                                    {'\n'}4. Wrong letters count against you
                                    {'\n'}5. Solve the phrase before running out of guesses!
                                </Text>

                                <Text style={styles.sectionTitle}>Scoring</Text>
                                <Text style={styles.ruleText}>
                                    • Faster solves = Higher scores
                                    {'\n'}• Fewer wrong guesses = Bonus points
                                    {'\n'}• Complete phrases unlock new categories
                                </Text>

                                <Text style={styles.sectionTitle}>Tips</Text>
                                <Text style={styles.ruleText}>
                                    • Start with common letters (E, A, R, T)
                                    {'\n'}• Look for word patterns and lengths
                                    {'\n'}• Use context clues from revealed letters
                                    {'\n'}• Don't guess randomly - think strategically!
                                </Text>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: '#FF6B9D',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    modalTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalScroll: {
        padding: 20,
    },
    sectionTitle: {
        color: '#FF6B9D',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 8,
    },
    ruleText: {
        color: '#ccc',
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 10,
    },
});
