import { Ionicons } from '@expo/vector-icons';
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

export default function JengaSetup() {
    const router = useRouter();
    const [step, setStep] = useState<'mode' | 'players' | 'tower'>('mode');
    const [gameMode, setGameMode] = useState<'single' | 'multiplayer' | null>(null);
    const [towerMode, setTowerMode] = useState<'classic' | 'build' | null>(null);
    const [players, setPlayers] = useState<Player[]>([
        { id: '1', name: '', color: PLAYER_COLORS[0] },
        { id: '2', name: '', color: PLAYER_COLORS[1] },
    ]);

    const addPlayer = () => {
        if (players.length < 6) {
            setPlayers([
                ...players,
                { id: String(players.length + 1), name: '', color: PLAYER_COLORS[players.length % PLAYER_COLORS.length] },
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

    const canProceed = () => {
        if (step === 'mode') return gameMode !== null;
        if (step === 'players') {
            if (gameMode === 'single') return true;
            return players.every(p => p.name.trim() !== '');
        }
        if (step === 'tower') return towerMode !== null;
        return false;
    };

    const handleNext = () => {
        if (step === 'mode') {
            if (gameMode === 'single') {
                setStep('tower');
            } else {
                setStep('players');
            }
        } else if (step === 'players') {
            setStep('tower');
        } else if (step === 'tower') {
            startGame();
        }
    };

    const handleBack = () => {
        if (step === 'tower') {
            if (gameMode === 'single') {
                setStep('mode');
            } else {
                setStep('players');
            }
        } else if (step === 'players') {
            setStep('mode');
        } else {
            router.back();
        }
    };

    const startGame = () => {
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
        <LinearGradient colors={['#3d2518', '#5a3d25', '#3d2518']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFE0B2" />
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        {step === 'mode' ? 'Game Mode' : step === 'players' ? 'Players' : 'Tower Type'}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {/* Step 1: Game Mode */}
                    {step === 'mode' && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>How do you want to play?</Text>

                            <TouchableOpacity
                                style={[styles.optionCard, gameMode === 'single' && styles.optionCardSelected]}
                                onPress={() => setGameMode('single')}
                            >
                                <Text style={styles.optionEmoji}>👤</Text>
                                <View style={styles.optionText}>
                                    <Text style={styles.optionTitle}>Single Player</Text>
                                    <Text style={styles.optionDesc}>Practice your skills alone</Text>
                                </View>
                                {gameMode === 'single' && <Ionicons name="checkmark-circle" size={28} color="#90be6d" />}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.optionCard, gameMode === 'multiplayer' && styles.optionCardSelected]}
                                onPress={() => setGameMode('multiplayer')}
                            >
                                <Text style={styles.optionEmoji}>👥</Text>
                                <View style={styles.optionText}>
                                    <Text style={styles.optionTitle}>Multiplayer</Text>
                                    <Text style={styles.optionDesc}>Challenge your friends</Text>
                                </View>
                                {gameMode === 'multiplayer' && <Ionicons name="checkmark-circle" size={28} color="#90be6d" />}
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Step 2: Players */}
                    {step === 'players' && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Enter Player Names</Text>

                            {players.map((player, index) => (
                                <View key={player.id} style={styles.playerRow}>
                                    <View style={[styles.playerColor, { backgroundColor: player.color }]} />
                                    <TextInput
                                        style={styles.playerInput}
                                        placeholder={`Player ${index + 1}`}
                                        placeholderTextColor="rgba(255,224,178,0.5)"
                                        value={player.name}
                                        onChangeText={(text) => updatePlayerName(player.id, text)}
                                    />
                                    {players.length > 2 && (
                                        <TouchableOpacity onPress={() => removePlayer(player.id)} style={styles.removeBtn}>
                                            <Ionicons name="close-circle" size={24} color="#f94144" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}

                            {players.length < 6 && (
                                <TouchableOpacity style={styles.addPlayerBtn} onPress={addPlayer}>
                                    <Ionicons name="add-circle" size={24} color="#90be6d" />
                                    <Text style={styles.addPlayerText}>Add Player</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* Step 3: Tower Mode */}
                    {step === 'tower' && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Choose Tower Type</Text>

                            <TouchableOpacity
                                style={[styles.optionCard, towerMode === 'classic' && styles.optionCardSelected]}
                                onPress={() => setTowerMode('classic')}
                            >
                                <Text style={styles.optionEmoji}>🏗️</Text>
                                <View style={styles.optionText}>
                                    <Text style={styles.optionTitle}>Classic Tower</Text>
                                    <Text style={styles.optionDesc}>Pre-built 10-level tower</Text>
                                </View>
                                {towerMode === 'classic' && <Ionicons name="checkmark-circle" size={28} color="#90be6d" />}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.optionCard, towerMode === 'build' && styles.optionCardSelected]}
                                onPress={() => setTowerMode('build')}
                            >
                                <Text style={styles.optionEmoji}>🔨</Text>
                                <View style={styles.optionText}>
                                    <Text style={styles.optionTitle}>Build Your Own</Text>
                                    <Text style={styles.optionDesc}>Stack blocks to create tower</Text>
                                </View>
                                {towerMode === 'build' && <Ionicons name="checkmark-circle" size={28} color="#90be6d" />}
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
                        onPress={handleNext}
                        disabled={!canProceed()}
                    >
                        <Text style={styles.nextButtonText}>
                            {step === 'tower' ? 'START GAME' : 'NEXT'}
                        </Text>
                        <Ionicons name={step === 'tower' ? 'play' : 'arrow-forward'} size={22} color="#FFE0B2" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#FFE0B2' },
    content: { flexGrow: 1, paddingHorizontal: 20 },
    section: { marginTop: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#D2B48C', marginBottom: 20, textAlign: 'center' },
    optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 15, padding: 20, marginBottom: 15, borderWidth: 2, borderColor: 'transparent' },
    optionCardSelected: { borderColor: '#90be6d', backgroundColor: 'rgba(144,190,109,0.15)' },
    optionEmoji: { fontSize: 40, marginRight: 15 },
    optionText: { flex: 1 },
    optionTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFE0B2' },
    optionDesc: { fontSize: 14, color: '#D2B48C', marginTop: 4 },
    playerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 12, marginBottom: 12 },
    playerColor: { width: 30, height: 30, borderRadius: 15, marginRight: 12 },
    playerInput: { flex: 1, fontSize: 18, color: '#FFE0B2', padding: 8, fontFamily: Platform.select({ ios: 'Avenir', android: 'sans-serif' }) },
    removeBtn: { padding: 5 },
    addPlayerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(144,190,109,0.5)', borderStyle: 'dashed' },
    addPlayerText: { fontSize: 16, color: '#90be6d', marginLeft: 8, fontWeight: '600' },
    footer: { padding: 20 },
    nextButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8B4513', borderRadius: 30, paddingVertical: 16, gap: 10, borderWidth: 1, borderColor: '#D2B48C' },
    nextButtonDisabled: { opacity: 0.5 },
    nextButtonText: { fontSize: 20, fontWeight: 'bold', color: '#FFE0B2' },
});
