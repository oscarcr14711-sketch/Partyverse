import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StopGameIntro() {
    const router = useRouter();
    const [showRules, setShowRules] = useState(false);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Character Illustration */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/images/stop.png')}
                        style={styles.characterImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Choose Players Button */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <TouchableOpacity
                        style={styles.choosePlayersButton}
                        onPress={() => router.push('/stop-game-pre-game')}
                    >
                        <Text style={styles.buttonText}>Choose Players</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.infoButton} onPress={() => setShowRules(true)}>
                        <Text style={styles.infoButtonText}>i</Text>
                    </TouchableOpacity>
                </View>

                {/* Rules Modal */}
                <Modal visible={showRules} transparent animationType="slide" onRequestClose={() => setShowRules(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>How to Play</Text>
                                <TouchableOpacity onPress={() => setShowRules(false)}>
                                    <Ionicons name="close" size={24} color="#0abde3" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.modalScroll}>
                                <Text style={styles.sectionTitle}>🎯 Objective</Text>
                                <Text style={styles.ruleText}>Come up with words for each category that start with a random letter!</Text>
                                <Text style={styles.sectionTitle}>🎮 How It Works</Text>
                                <Text style={styles.ruleText}>• Random letter is chosen{'\n'}• Fill each category with a word{'\n'}• Shout "STOP!" when done{'\n'}• Unique answers = points!</Text>
                                <Text style={styles.sectionTitle}>🏆 Scoring</Text>
                                <Text style={styles.ruleText}>Unique answers score! Duplicate answers with other players = no points.</Text>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5DADE2', // Light blue background from reference
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1B4F72', // Dark blue
        letterSpacing: 1,
        marginTop: 20,
        ...Platform.select({
            ios: { fontFamily: 'Avenir-Black' },
            android: { fontFamily: 'sans-serif-black' }
        }),
    },
    title: {
        fontSize: 56,
        fontWeight: 'bold',
        color: '#FF8C00', // Orange
        textShadowColor: '#1B4F72', // Dark blue outline
        textShadowOffset: { width: -3, height: 3 },
        textShadowRadius: 1,
        letterSpacing: 3,
        marginTop: -20,
        ...Platform.select({
            ios: { fontFamily: 'Avenir-Black' },
            android: { fontFamily: 'sans-serif-black' }
        }),
    },
    imageContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    characterImage: {
        width: '90%',
        height: '100%',
        maxHeight: 500,
    },
    choosePlayersButton: {
        backgroundColor: '#FF8C00', // Orange
        paddingHorizontal: 50,
        paddingVertical: 18,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: 3,
        borderColor: '#1B4F72', // Dark blue border
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 1,
        textShadowColor: '#1B4F72',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 1,
        ...Platform.select({
            ios: { fontFamily: 'Avenir-Black' },
            android: { fontFamily: 'sans-serif-black' }
        }),
    },
    infoButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FF8C00', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8, borderWidth: 3, borderColor: '#1B4F72' },
    infoButtonText: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#5DADE2', borderRadius: 20, maxHeight: '65%', borderWidth: 2, borderColor: '#FF8C00' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(27,79,114,0.3)' },
    modalTitle: { color: '#1B4F72', fontSize: 22, fontWeight: 'bold' },
    modalScroll: { padding: 20 },
    sectionTitle: { color: '#1B4F72', fontSize: 18, fontWeight: 'bold', marginTop: 8, marginBottom: 5 },
    ruleText: { color: '#fff', fontSize: 15, lineHeight: 21, marginBottom: 6 },
});
