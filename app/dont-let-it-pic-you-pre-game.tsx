import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PulsingButton } from '../components/PulsingButton';

const AVATAR_IMAGES = [
    require('../assets/images/avatars/avatar1.png'),
    require('../assets/images/avatars/avatar2.png'),
    require('../assets/images/avatars/avatar3.png'),
    require('../assets/images/avatars/avatar4.png'),
    require('../assets/images/avatars/avatar5.png'),
    require('../assets/images/avatars/avatar6.png'),
];

interface Player {
    id: number;
    name: string;
    avatarIndex: number;
}

export default function DontLetItPicYouPreGame() {
    const router = useRouter();
    const [numPlayers, setNumPlayers] = useState(2);
    const [numRounds, setNumRounds] = useState(3);
    const [cameraType, setCameraType] = useState<'front' | 'back'>('front');
    const [players, setPlayers] = useState<Player[]>([
        { id: 0, name: 'Player 1', avatarIndex: 0 },
        { id: 1, name: 'Player 2', avatarIndex: 1 },
    ]);
    const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);

    const updatePlayerCount = (newCount: number) => {
        setNumPlayers(newCount);
        const currentPlayers = [...players];

        if (newCount > players.length) {
            // Add new players
            for (let i = players.length; i < newCount; i++) {
                currentPlayers.push({
                    id: i,
                    name: `Player ${i + 1}`,
                    avatarIndex: i % AVATAR_IMAGES.length,
                });
            }
        } else {
            // Remove excess players
            currentPlayers.splice(newCount);
        }

        setPlayers(currentPlayers);
    };

    const updatePlayerName = (id: number, name: string) => {
        setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
    };

    const updatePlayerAvatar = (id: number, avatarIndex: number) => {
        setPlayers(players.map(p => p.id === id ? { ...p, avatarIndex } : p));
    };

    const handleStart = () => {
        // Randomize player order
        const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);

        router.push({
            pathname: '/dont-let-it-pic-you-game',
            params: {
                players: JSON.stringify(shuffledPlayers),
                numRounds,
                cameraType,
            }
        });
    };

    return (
        <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={28} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.title}>📸 DON'T GET CAUGHT</Text>
                    </View>

                    <Text style={styles.subtitle}>Don't Let It PIC You!</Text>

                    {/* Camera Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📷 Camera</Text>
                        <View style={styles.cameraContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.cameraButton,
                                    cameraType === 'front' && styles.cameraButtonActive
                                ]}
                                onPress={() => setCameraType('front')}
                            >
                                <Ionicons
                                    name="camera-reverse"
                                    size={32}
                                    color={cameraType === 'front' ? '#fff' : 'rgba(255,255,255,0.5)'}
                                />
                                <Text style={[
                                    styles.cameraText,
                                    cameraType === 'front' && styles.cameraTextActive
                                ]}>Front Camera</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.cameraButton,
                                    cameraType === 'back' && styles.cameraButtonActive
                                ]}
                                onPress={() => setCameraType('back')}
                            >
                                <Ionicons
                                    name="camera"
                                    size={32}
                                    color={cameraType === 'back' ? '#fff' : 'rgba(255,255,255,0.5)'}
                                />
                                <Text style={[
                                    styles.cameraText,
                                    cameraType === 'back' && styles.cameraTextActive
                                ]}>Rear Camera</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Players Counter */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>👥 Number of Players</Text>
                        <View style={styles.counterPill}>
                            <PulsingButton
                                style={styles.counterButton}
                                onPress={() => updatePlayerCount(Math.max(2, numPlayers - 1))}
                            >
                                <Text style={styles.counterButtonText}>−</Text>
                            </PulsingButton>
                            <Text style={styles.counterText}>{numPlayers}</Text>
                            <PulsingButton
                                style={styles.counterButton}
                                onPress={() => updatePlayerCount(Math.min(8, numPlayers + 1))}
                            >
                                <Text style={styles.counterButtonText}>+</Text>
                            </PulsingButton>
                        </View>
                    </View>

                    {/* Rounds Counter */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🔄 Number of Rounds</Text>
                        <View style={styles.counterPill}>
                            <PulsingButton
                                style={styles.counterButton}
                                onPress={() => setNumRounds(Math.max(3, numRounds - 1))}
                            >
                                <Text style={styles.counterButtonText}>−</Text>
                            </PulsingButton>
                            <Text style={styles.counterText}>{numRounds}</Text>
                            <PulsingButton
                                style={styles.counterButton}
                                onPress={() => setNumRounds(Math.min(5, numRounds + 1))}
                            >
                                <Text style={styles.counterButtonText}>+</Text>
                            </PulsingButton>
                        </View>
                    </View>

                    {/* Player Setup */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🎭 Player Setup</Text>
                        <Text style={styles.sectionHint}>Tap name to edit, tap avatar to change</Text>

                        {players.map((player) => (
                            <View key={player.id} style={styles.playerCard}>
                                <TouchableOpacity
                                    style={styles.avatarButton}
                                    onPress={() => {
                                        const nextIndex = (player.avatarIndex + 1) % AVATAR_IMAGES.length;
                                        updatePlayerAvatar(player.id, nextIndex);
                                    }}
                                >
                                    <Image
                                        source={AVATAR_IMAGES[player.avatarIndex]}
                                        style={styles.avatar}
                                    />
                                    <View style={styles.avatarOverlay}>
                                        <Ionicons name="sync" size={20} color="#fff" />
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.playerInfo}>
                                    {editingPlayerId === player.id ? (
                                        <TextInput
                                            style={styles.nameInput}
                                            value={player.name}
                                            onChangeText={(text) => updatePlayerName(player.id, text)}
                                            onBlur={() => setEditingPlayerId(null)}
                                            autoFocus
                                            maxLength={20}
                                            placeholderTextColor="rgba(255,255,255,0.5)"
                                        />
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => setEditingPlayerId(player.id)}
                                            style={styles.nameButton}
                                        >
                                            <Text style={styles.playerName}>{player.name}</Text>
                                            <Ionicons name="pencil" size={16} color="rgba(255,255,255,0.6)" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Info Box */}
                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle" size={24} color="#ffd32a" />
                        <Text style={styles.infoText}>
                            Players will be randomized at the start. Avoid being in the photo when it's taken!
                        </Text>
                    </View>

                    {/* Start Button */}
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={handleStart}
                    >
                        <LinearGradient
                            colors={['#e74c3c', '#c0392b']}
                            style={styles.startButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons name="camera" size={28} color="#fff" />
                            <Text style={styles.startButtonText}>START GAME</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        zIndex: 10,
        padding: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        flex: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    subtitle: {
        fontSize: 18,
        color: '#ffd32a',
        textAlign: 'center',
        marginBottom: 30,
        fontStyle: 'italic',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    sectionHint: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 12,
        fontStyle: 'italic',
    },
    cameraContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    cameraButton: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    cameraButtonActive: {
        backgroundColor: 'rgba(231, 76, 60, 0.3)',
        borderColor: '#e74c3c',
        shadowColor: '#e74c3c',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    cameraText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 8,
    },
    cameraTextActive: {
        color: '#fff',
    },
    counterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 50,
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    counterButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e74c3c',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    counterButtonText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    counterText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        minWidth: 60,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    playerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    avatarButton: {
        position: 'relative',
        marginRight: 15,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#ffd32a',
    },
    avatarOverlay: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: '#e74c3c',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    playerInfo: {
        flex: 1,
    },
    nameButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    nameInput: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 2,
        borderColor: '#ffd32a',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 211, 42, 0.1)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 211, 42, 0.3)',
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 20,
    },
    startButton: {
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
    startButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 12,
    },
    startButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
});
