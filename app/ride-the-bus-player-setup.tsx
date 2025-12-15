import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RideTheBusPlayerSetup() {
    const router = useRouter();
    const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2']);

    const updatePlayerName = (index: number, name: string) => {
        const newNames = [...playerNames];
        newNames[index] = name;
        setPlayerNames(newNames);
    };

    const addPlayer = () => {
        if (playerNames.length < 6) {
            setPlayerNames([...playerNames, `Player ${playerNames.length + 1}`]);
        }
    };

    const removePlayer = (index: number) => {
        if (playerNames.length > 2) {
            const newNames = playerNames.filter((_, i) => i !== index);
            setPlayerNames(newNames);
        }
    };

    const startGame = () => {
        const activePlayers = playerNames.map((name, i) =>
            name.trim() || `Player ${i + 1}`
        );

        router.push({
            pathname: '/ride-the-bus-game',
            params: { players: JSON.stringify(activePlayers) }
        });
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#1a3c34', '#0d1f1a']} style={styles.gradient} />
            <SafeAreaView style={styles.safeArea}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFE0B2" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Enter Player Names</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Player Name Inputs */}
                    <View style={styles.namesContainer}>
                        {playerNames.map((name, index) => (
                            <View key={index} style={styles.nameInputRow}>
                                <View style={styles.playerBadge}>
                                    <Text style={styles.playerBadgeText}>{index + 1}</Text>
                                </View>
                                <TextInput
                                    style={styles.nameInput}
                                    placeholder={`Player ${index + 1}`}
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={name}
                                    onChangeText={(text) => updatePlayerName(index, text)}
                                    maxLength={15}
                                    selectTextOnFocus
                                />
                                {playerNames.length > 2 && (
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => removePlayer(index)}
                                    >
                                        <Ionicons name="close" size={20} color="#FF6B6B" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}

                        {/* Add Player Button */}
                        {playerNames.length < 6 && (
                            <TouchableOpacity style={styles.addPlayerButton} onPress={addPlayer}>
                                <Ionicons name="add-circle" size={28} color="#3CB371" />
                                <Text style={styles.addPlayerText}>Add Player</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Start Game Button */}
                    <TouchableOpacity style={styles.startButton} onPress={startGame}>
                        <Ionicons name="play" size={28} color="#1a3c34" />
                        <Text style={styles.startButtonText}>START GAME</Text>
                    </TouchableOpacity>
                </ScrollView>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFE0B2',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    namesContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        borderWidth: 2,
        borderColor: 'rgba(60,179,113,0.4)',
    },
    nameInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 12,
    },
    playerBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#3CB371',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3CB371',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 5,
    },
    playerBadgeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    nameInput: {
        flex: 1,
        height: 54,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        paddingHorizontal: 20,
        fontSize: 18,
        color: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif' }),
    },
    removeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,107,107,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addPlayerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(60,179,113,0.2)',
        borderRadius: 15,
        paddingVertical: 15,
        gap: 10,
        borderWidth: 2,
        borderColor: 'rgba(60,179,113,0.5)',
        borderStyle: 'dashed',
    },
    addPlayerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#3CB371',
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif-medium' }),
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFD700',
        borderRadius: 30,
        paddingVertical: 18,
        paddingHorizontal: 50,
        gap: 12,
        marginTop: 40,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    startButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a3c34',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
});
