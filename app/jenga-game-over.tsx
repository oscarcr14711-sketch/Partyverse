import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Player {
    id: string;
    name: string;
    color: string;
}

export default function JengaGameOver() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const loserName = params.loserName as string || 'Unknown';
    const loserColor = params.loserColor as string || '#f94144';
    const blocksRemoved = parseInt(params.blocksRemoved as string) || 0;
    const players: Player[] = JSON.parse((params.players as string) || '[]');

    return (
        <LinearGradient colors={['#2d1810', '#3d2518', '#2d1810']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Text style={styles.crashEmoji}>💥</Text>
                    <Text style={styles.title}>TOWER COLLAPSED!</Text>

                    <View style={styles.loserCard}>
                        <View style={[styles.loserAvatar, { backgroundColor: loserColor }]}>
                            <Ionicons name="sad" size={40} color="#fff" />
                        </View>
                        <Text style={styles.loserLabel}>Knocked down by</Text>
                        <Text style={styles.loserName}>{loserName}</Text>
                    </View>

                    <View style={styles.statsCard}>
                        <View style={styles.statRow}>
                            <Ionicons name="cube" size={24} color="#D2B48C" />
                            <Text style={styles.statLabel}>Blocks Moved</Text>
                            <Text style={styles.statValue}>{blocksRemoved}</Text>
                        </View>
                    </View>

                    {players.length > 1 && (
                        <View style={styles.winnersCard}>
                            <Text style={styles.winnersTitle}>🏆 Survivors</Text>
                            {players.filter(p => p.name !== loserName).map((player, index) => (
                                <View key={player.id} style={styles.winnerRow}>
                                    <View style={[styles.winnerDot, { backgroundColor: player.color }]} />
                                    <Text style={styles.winnerName}>{player.name}</Text>
                                    {index === 0 && <Text style={styles.winnerBadge}>👑</Text>}
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.playAgainButton} onPress={() => router.replace('/jenga-setup')}>
                        <Ionicons name="refresh" size={22} color="#FFE0B2" />
                        <Text style={styles.playAgainText}>PLAY AGAIN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuButton} onPress={() => router.replace('/action-adrenaline-games')}>
                        <Text style={styles.menuText}>Back to Menu</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 25 },
    crashEmoji: { fontSize: 80, marginBottom: 10 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#FF6B6B', marginBottom: 30, fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-black' }) },
    loserCard: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: 25, marginBottom: 20, width: '100%', borderWidth: 2, borderColor: '#8B4513' },
    loserAvatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
    loserLabel: { fontSize: 14, color: '#D2B48C', marginBottom: 5 },
    loserName: { fontSize: 28, fontWeight: 'bold', color: '#FFE0B2' },
    statsCard: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 15, padding: 20, width: '100%', marginBottom: 20 },
    statRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    statLabel: { flex: 1, fontSize: 16, color: '#D2B48C' },
    statValue: { fontSize: 24, fontWeight: 'bold', color: '#FFE0B2' },
    winnersCard: { backgroundColor: 'rgba(144,190,109,0.15)', borderRadius: 15, padding: 20, width: '100%', borderWidth: 1, borderColor: 'rgba(144,190,109,0.3)' },
    winnersTitle: { fontSize: 18, fontWeight: 'bold', color: '#90be6d', marginBottom: 15, textAlign: 'center' },
    winnerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    winnerDot: { width: 16, height: 16, borderRadius: 8, marginRight: 12 },
    winnerName: { flex: 1, fontSize: 18, color: '#FFE0B2' },
    winnerBadge: { fontSize: 20 },
    footer: { padding: 20, gap: 12 },
    playAgainButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8B4513', borderRadius: 30, paddingVertical: 16, gap: 10, borderWidth: 1, borderColor: '#D2B48C' },
    playAgainText: { fontSize: 20, fontWeight: 'bold', color: '#FFE0B2' },
    menuButton: { alignItems: 'center', paddingVertical: 12 },
    menuText: { fontSize: 16, color: '#D2B48C' },
});
