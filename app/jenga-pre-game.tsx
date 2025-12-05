import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Player {
    id: string;
    name: string;
    color: string;
}

const PLAYER_COLORS = ['#f94144', '#f8961e', '#90be6d', '#577590', '#f3722c', '#43aa8b'];

export default function JengaPreGame() {
    const router = useRouter();
    const [gameMode, setGameMode] = useState<'single' | 'multiplayer' | null>(null);
    const [towerMode, setTowerMode] = useState<'classic' | 'build' | null>(null);
    const [showTowerSelection, setShowTowerSelection] = useState(false);
    const [players, setPlayers] = useState<Player[]>([
        { id: '1', name: '', color: PLAYER_COLORS[0] },
        { id: '2', name: '', color: PLAYER_COLORS[1] },
    ]);

    const addPlayer = () => {
        if (players.length < 6) {
            setPlayers([
                ...players,
                {
                    id: String(players.length + 1),
                    name: '',
                    color: PLAYER_COLORS[players.length % PLAYER_COLORS.length],
                },
            ]);
        }
    };

    const removePlayer = (id: string) => {
        if (players.length > 2) {
            setPlayers(players.filter(p => p.id !== id));
        }
    };

    const updatePlayerName = (id: string, name: string) => {
        setPlayers(players.map(p => (p.id === id ? { ...p, name } : p)));
    };

    const canStart = () => {
        if (!gameMode || !towerMode) return false;
        if (gameMode === 'single') return true;
        return players.every(p => p.name.trim() !== '');
    };

    const startGame = () => {
        if (!canStart()) return;

        const gamePlayers = gameMode === 'single'
            ? [{ id: '1', name: 'Player', color: PLAYER_COLORS[0] }]
            : players;

        router.push({
            pathname: '/stack-tower-game',
            params: {
                gameMode,
                towerMode,
                players: JSON.stringify(gamePlayers),
            },
        });
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#8B4513', '#A0522D', '#CD853F']}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                <Text style={styles.backText}>←</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>🎯 Jenga Tower</Text>
                            <View style={styles.placeholder} />
                        </View>

                        {/* Game Mode Selection */}
                        {!gameMode && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Select Game Mode</Text>
                                <TouchableOpacity
                                    style={styles.modeButton}
                                    onPress={() => setGameMode('single')}
                                >
                                    <Text style={styles.modeEmoji}>👤</Text>
                                    <Text style={styles.modeTitle}>Single Player</Text>
                                    <Text style={styles.modeDescription}>Play solo and beat your high score</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.modeButton}
                                    onPress={() => setGameMode('multiplayer')}
                                >
                                    <Text style={styles.modeEmoji}>👥</Text>
                                    <Text style={styles.modeTitle}>Multiplayer</Text>
                                    <Text style={styles.modeDescription}>2-6 players take turns</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Player Setup (Multiplayer) */}
                        {gameMode === 'multiplayer' && !towerMode && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Players ({players.length}/6)</Text>

                                {players.map((player, index) => (
                                    <View key={player.id} style={styles.playerRow}>
                                        <View style={[styles.colorIndicator, { backgroundColor: player.color }]} />
                                        <TextInput
                                            style={styles.playerInput}
                                            placeholder={`Player ${index + 1} Name`}
                                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                            value={player.name}
                                            onChangeText={(text) => updatePlayerName(player.id, text)}
                                            maxLength={15}
                                        />
                                        {players.length > 2 && (
                                            <TouchableOpacity
                                                onPress={() => removePlayer(player.id)}
                                                style={styles.removeButton}
                                            >
                                                <Text style={styles.removeText}>✕</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}

                                {players.length < 6 && (
                                    <TouchableOpacity style={styles.addButton} onPress={addPlayer}>
                                        <Text style={styles.addButtonText}>+ Add Player</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={[
                                        styles.continueButton,
                                        !players.every(p => p.name.trim() !== '') && styles.continueButtonDisabled,
                                    ]}
                                    onPress={() => players.every(p => p.name.trim() !== '') && setShowTowerSelection(true)}
                                    disabled={!players.every(p => p.name.trim() !== '')}
                                >
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Tower Mode Selection */}
                        {((gameMode === 'single' && !towerMode) || (gameMode === 'multiplayer' && showTowerSelection)) && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Select Tower Mode</Text>

                                <TouchableOpacity
                                    style={styles.modeButton}
                                    onPress={() => {
                                        setTowerMode('classic');
                                        setTimeout(startGame, 100);
                                    }}
                                >
                                    <Text style={styles.modeEmoji}>🏗️</Text>
                                    <Text style={styles.modeTitle}>Classic Tower</Text>
                                    <Text style={styles.modeDescription}>Start with 18-level pre-built tower</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.modeButton}
                                    onPress={() => {
                                        setTowerMode('build');
                                        setTimeout(startGame, 100);
                                    }}
                                >
                                    <Text style={styles.modeEmoji}>🔨</Text>
                                    <Text style={styles.modeTitle}>Build & Play</Text>
                                    <Text style={styles.modeDescription}>Start small, build as you remove blocks</Text>
                                </TouchableOpacity>

                                {gameMode === 'multiplayer' && (
                                    <TouchableOpacity
                                        style={styles.backToPlayersButton}
                                        onPress={() => setShowTowerSelection(false)}
                                    >
                                        <Text style={styles.backToPlayersText}>← Back to Players</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        {/* Instructions */}
                        <View style={styles.instructions}>
                            <Text style={styles.instructionsTitle}>How to Play:</Text>
                            <Text style={styles.instructionsText}>• Tap a block to select it</Text>
                            <Text style={styles.instructionsText}>• Tap again to remove it</Text>
                            <Text style={styles.instructionsText}>• Can't remove from top 3 levels</Text>
                            <Text style={styles.instructionsText}>• Don't let the tower fall!</Text>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backText: {
        fontSize: 24,
        color: 'white',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    placeholder: {
        width: 44,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
        textAlign: 'center',
    },
    modeButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    modeEmoji: {
        fontSize: 48,
        marginBottom: 10,
    },
    modeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    modeDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    colorIndicator: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
        borderWidth: 2,
        borderColor: 'white',
    },
    playerInput: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: 'white',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    removeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    removeText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderStyle: 'dashed',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    continueButton: {
        backgroundColor: '#f8961e',
        borderRadius: 15,
        padding: 18,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    continueButtonDisabled: {
        backgroundColor: 'rgba(248, 150, 30, 0.4)',
    },
    continueButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    backToPlayersButton: {
        marginTop: 15,
        padding: 10,
        alignItems: 'center',
    },
    backToPlayersText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
    },
    instructions: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 15,
        padding: 20,
        marginTop: 20,
    },
    instructionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    instructionsText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 5,
    },
});
