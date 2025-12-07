import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StackTowerPreGame() {
    const router = useRouter();
    const [showRules, setShowRules] = useState(false);
    const [numPlayers, setNumPlayers] = useState(2);

    const startGame = () => {
        const players = Array.from({ length: numPlayers }, (_, i) => ({
            id: String(i + 1),
            name: `Player ${i + 1}`,
            color: ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b'][i % 6],
        }));

        router.push({
            pathname: '/stack-tower-game',
            params: { players: JSON.stringify(players) }
        });
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFE0B2" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <Image
                        source={require('../assets/images/stack.png')}
                        style={styles.mainImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Player Counter */}
                <View style={styles.playerCountContainer}>
                    <TouchableOpacity
                        style={styles.countButton}
                        onPress={() => setNumPlayers(Math.max(1, numPlayers - 1))}
                    >
                        <Text style={styles.countButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.playerCountText}>{numPlayers} Players</Text>
                    <TouchableOpacity
                        style={styles.countButton}
                        onPress={() => setNumPlayers(Math.min(6, numPlayers + 1))}
                    >
                        <Text style={styles.countButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.startButton} onPress={startGame}>
                        <Text style={styles.startButtonText}>START GAME</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.infoButton} onPress={() => setShowRules(true)}>
                        <Text style={styles.infoButtonText}>i</Text>
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
                                <Text style={styles.modalTitle}>How to Play Jenga</Text>
                                <TouchableOpacity onPress={() => setShowRules(false)}>
                                    <Ionicons name="close" size={24} color="#FFE0B2" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.modalScroll}>
                                <Text style={styles.sectionTitle}>🎯 Objective</Text>
                                <Text style={styles.ruleText}>
                                    Remove blocks from the tower and stack them on top without
                                    making the tower collapse! The player who knocks it down loses.
                                </Text>

                                <Text style={styles.sectionTitle}>🎮 How to Play</Text>
                                <Text style={styles.ruleText}>
                                    1. Swipe to rotate the camera view{'\n'}
                                    2. Tap any block to grab it{'\n'}
                                    3. Drag the block around{'\n'}
                                    4. Release to place it on top{'\n'}
                                    5. Take turns with other players
                                </Text>

                                <Text style={styles.sectionTitle}>⚠️ Be Careful!</Text>
                                <Text style={styles.ruleText}>
                                    • Removing bottom blocks is risky!{'\n'}
                                    • Tower collapses when unstable{'\n'}
                                    • Don't remove too many from one level{'\n'}
                                    • Watch the tower's balance!
                                </Text>

                                <Text style={styles.sectionTitle}>🏆 Winning</Text>
                                <Text style={styles.ruleText}>
                                    The player who causes the tower to collapse loses!
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
        backgroundColor: '#3d2518',
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
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    playerCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginHorizontal: 40,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#8B4513',
    },
    countButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#8B4513',
        alignItems: 'center',
        justifyContent: 'center',
    },
    countButtonText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFE0B2',
    },
    playerCountText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFE0B2',
        marginHorizontal: 25,
        minWidth: 100,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
        paddingBottom: 40,
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
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#3d2518',
        borderRadius: 20,
        maxHeight: '80%',
        borderWidth: 2,
        borderColor: '#8B4513',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(139,69,19,0.5)',
    },
    modalTitle: {
        color: '#FFE0B2',
        fontSize: 22,
        fontWeight: 'bold',
    },
    modalScroll: {
        padding: 20,
    },
    sectionTitle: {
        color: '#D2B48C',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 6,
    },
    ruleText: {
        color: '#FFE0B2',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 8,
    },
});
