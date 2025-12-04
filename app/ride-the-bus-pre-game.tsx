import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RideTheBusPreGame() {
    const router = useRouter();
    const [showRules, setShowRules] = useState(false);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#002000', '#005000']}
                style={styles.background}
            />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.gameIcon}>🚌🃏</Text>
                    </View>

                    <Text style={styles.title}>RIDE THE BUS</Text>
                    <Text style={styles.subtitle}>Can you survive the ride?</Text>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>HOW TO PLAY</Text>
                        <View style={styles.stepRow}>
                            <View style={styles.stepNumber}><Text style={styles.stepText}>1</Text></View>
                            <Text style={styles.stepDesc}>Collect cards by guessing their properties.</Text>
                        </View>
                        <View style={styles.stepRow}>
                            <View style={styles.stepNumber}><Text style={styles.stepText}>2</Text></View>
                            <Text style={styles.stepDesc}>Build the pyramid and assign drinks.</Text>
                        </View>
                        <View style={styles.stepRow}>
                            <View style={styles.stepNumber}><Text style={styles.stepText}>3</Text></View>
                            <Text style={styles.stepDesc}>Loser rides the bus! Don't hit a face card!</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => router.push('/ride-the-bus-game')}
                    >
                        <LinearGradient
                            colors={['#2E8B57', '#3CB371']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.startButtonText}>START GAME</Text>
                            <Ionicons name="play" size={24} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.rulesButton}
                        onPress={() => setShowRules(true)}
                    >
                        <Ionicons name="information-circle-outline" size={24} color="#3CB371" />
                        <Text style={styles.rulesButtonText}>Detailed Rules</Text>
                    </TouchableOpacity>
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
                                <Text style={styles.modalTitle}>Game Rules</Text>
                                <TouchableOpacity onPress={() => setShowRules(false)}>
                                    <Ionicons name="close" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.modalScroll}>
                                <Text style={styles.sectionTitle}>Phase 1: Collection</Text>
                                <Text style={styles.ruleText}>
                                    You will be dealt 4 cards. Before each card, you must guess:
                                    {'\n'}1. Red or Black?
                                    {'\n'}2. Higher or Lower?
                                    {'\n'}3. Inside or Outside?
                                    {'\n'}4. Guess the Suit
                                    {'\n'}Wrong guess = Drink!
                                </Text>

                                <Text style={styles.sectionTitle}>Phase 2: The Pyramid</Text>
                                <Text style={styles.ruleText}>
                                    Cards are flipped in a pyramid. If you have a matching card, place it to make someone drink!
                                    {'\n'}Row 1 = 1 Drink
                                    {'\n'}Row 5 = 5 Drinks
                                </Text>

                                <Text style={styles.sectionTitle}>Phase 3: Ride The Bus</Text>
                                <Text style={styles.ruleText}>
                                    The player with the most cards left must Ride the Bus.
                                    {'\n'}Flip cards one by one.
                                    {'\n'}Number card = Safe.
                                    {'\n'}Face card (J,Q,K,A) = Drink & Restart!
                                </Text>
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
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
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
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    iconContainer: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(46, 139, 87, 0.2)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#3CB371',
    },
    gameIcon: {
        fontSize: 50,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5,
        letterSpacing: 2,
        textShadowColor: '#3CB371',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#rgba(255,255,255,0.7)',
        marginBottom: 40,
        fontStyle: 'italic',
    },
    infoCard: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(60, 179, 113, 0.3)',
    },
    infoTitle: {
        color: '#3CB371',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 15,
        letterSpacing: 1,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    stepNumber: {
        width: 24,
        height: 24,
        backgroundColor: '#3CB371',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepText: {
        color: '#002000',
        fontWeight: 'bold',
        fontSize: 12,
    },
    stepDesc: {
        color: '#fff',
        fontSize: 14,
        flex: 1,
    },
    startButton: {
        width: '100%',
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#3CB371',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    gradientButton: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    rulesButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 10,
    },
    rulesButtonText: {
        color: '#3CB371',
        fontSize: 14,
        fontWeight: '600',
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
        borderColor: '#3CB371',
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
        color: '#3CB371',
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
