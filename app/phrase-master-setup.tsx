import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Platform, Image as RNImage, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const AVATAR_IMAGES = [
    require('../assets/images/avatars/avatar1.png'),
    require('../assets/images/avatars/avatar2.png'),
    require('../assets/images/avatars/avatar3.png'),
    require('../assets/images/avatars/avatar4.png'),
    require('../assets/images/avatars/avatar5.png'),
    require('../assets/images/avatars/avatar6.png'),
];

const PLAYER_COLORS = [
    '#f94144', '#f3722c', '#f8961e', '#90be6d', '#43aa8b', '#577590',
    '#9b5de5', '#f15bb5', '#00bbf9', '#00f5d4'
];

interface Player {
    id: string;
    name: string;
    color: string;
    avatarIndex: number;
}

export default function PhraseMasterSetup() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const category = (params.category as string) || 'Random Mix';

    const [players, setPlayers] = useState<Player[]>([
        { id: '1', name: '', color: PLAYER_COLORS[0], avatarIndex: 0 },
        { id: '2', name: '', color: PLAYER_COLORS[1], avatarIndex: 1 },
    ]);
    const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

    const addPlayer = () => {
        if (players.length >= 6) {
            Alert.alert('Max Players', 'You can have up to 6 players');
            return;
        }
        const newPlayer: Player = {
            id: String(Date.now()),
            name: '',
            color: PLAYER_COLORS[players.length % PLAYER_COLORS.length],
            avatarIndex: players.length % AVATAR_IMAGES.length
        };
        setPlayers([...players, newPlayer]);
    };

    const removePlayer = (id: string) => {
        if (players.length <= 2) {
            Alert.alert('Need Players', 'You need at least 2 players');
            return;
        }
        setPlayers(players.filter(p => p.id !== id));
    };

    const updatePlayerName = (id: string, name: string) => {
        setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
    };

    const updatePlayerAvatar = (id: string, avatarIndex: number) => {
        setPlayers(players.map(p => p.id === id ? { ...p, avatarIndex } : p));
        setEditingPlayerId(null);
    };

    const startGame = () => {
        const namedPlayers = players.map((p, index) => ({
            ...p,
            name: p.name.trim() || `Player ${index + 1}`
        }));

        router.push({
            pathname: '/phrase-master-game',
            params: {
                players: JSON.stringify(namedPlayers),
                category: category
            }
        });
    };

    return (
        <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Player Setup</Text>
                        <Text style={styles.subtitle}>📚 {category}</Text>
                    </View>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {players.map((player, index) => (
                        <View key={player.id} style={styles.playerCard}>
                            <TouchableOpacity
                                style={styles.avatarContainer}
                                onPress={() => setEditingPlayerId(editingPlayerId === player.id ? null : player.id)}
                            >
                                <RNImage
                                    source={AVATAR_IMAGES[player.avatarIndex]}
                                    style={[styles.avatar, { borderColor: player.color }]}
                                />
                                <View style={styles.editBadge}>
                                    <Text style={styles.editBadgeText}>✎</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.playerInfo}>
                                <Text style={styles.playerLabel}>Player {index + 1}</Text>
                                <TextInput
                                    style={[styles.nameInput, { borderColor: player.color }]}
                                    placeholder={`Enter name...`}
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={player.name}
                                    onChangeText={(text) => updatePlayerName(player.id, text)}
                                    maxLength={12}
                                />
                            </View>

                            {players.length > 2 && (
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removePlayer(player.id)}
                                >
                                    <Text style={styles.removeButtonText}>✕</Text>
                                </TouchableOpacity>
                            )}

                            {/* Avatar Selection Dropdown */}
                            {editingPlayerId === player.id && (
                                <View style={styles.avatarPicker}>
                                    <Text style={styles.avatarPickerTitle}>Choose Avatar</Text>
                                    <View style={styles.avatarGrid}>
                                        {AVATAR_IMAGES.map((avatar, i) => (
                                            <TouchableOpacity
                                                key={i}
                                                style={[
                                                    styles.avatarOption,
                                                    player.avatarIndex === i && styles.avatarOptionSelected
                                                ]}
                                                onPress={() => updatePlayerAvatar(player.id, i)}
                                            >
                                                <RNImage source={avatar} style={styles.avatarOptionImage} />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>
                    ))}

                    {players.length < 6 && (
                        <TouchableOpacity style={styles.addPlayerButton} onPress={addPlayer}>
                            <Text style={styles.addPlayerIcon}>+</Text>
                            <Text style={styles.addPlayerText}>Add Player</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>

                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.startButton} onPress={startGame}>
                        <LinearGradient
                            colors={['#00d4aa', '#00b4d8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.startButtonGradient}
                        >
                            <Text style={styles.startButtonText}>START GAME</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    backText: {
        fontSize: 24,
        color: 'white',
    },
    titleContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    subtitle: {
        fontSize: 16,
        color: '#00d4aa',
        marginTop: 4,
    },
    placeholder: {
        width: 44,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 30,
    },
    playerCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
    },
    editBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#00d4aa',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#1a1a2e',
    },
    editBadgeText: {
        fontSize: 14,
        color: '#1a1a2e',
        fontWeight: 'bold',
    },
    playerInfo: {
        flex: 1,
        marginLeft: 15,
    },
    playerLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 6,
    },
    nameInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 18,
        color: 'white',
        borderWidth: 2,
        fontFamily: Platform.select({ ios: 'Avenir-Medium', android: 'sans-serif' }),
    },
    removeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 100, 100, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 100, 100, 0.4)',
    },
    removeButtonText: {
        color: '#ff6b6b',
        fontSize: 18,
        fontWeight: 'bold',
    },
    avatarPicker: {
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 15,
        padding: 15,
        marginTop: 15,
    },
    avatarPickerTitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 12,
        textAlign: 'center',
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },
    avatarOption: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    avatarOptionSelected: {
        borderColor: '#00d4aa',
    },
    avatarOptionImage: {
        width: '100%',
        height: '100%',
    },
    addPlayerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 212, 170, 0.15)',
        borderRadius: 20,
        paddingVertical: 20,
        borderWidth: 2,
        borderColor: 'rgba(0, 212, 170, 0.4)',
        borderStyle: 'dashed',
        gap: 10,
    },
    addPlayerIcon: {
        fontSize: 28,
        color: '#00d4aa',
        fontWeight: 'bold',
    },
    addPlayerText: {
        fontSize: 18,
        color: '#00d4aa',
        fontWeight: 'bold',
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    startButton: {
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#00d4aa',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    startButtonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    startButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a2e',
        letterSpacing: 2,
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
    },
});
