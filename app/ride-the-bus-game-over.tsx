import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayerStats } from '../utils/PlayerStatsContext';

export default function RideTheBusGameOver() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { recordGamePlayed } = usePlayerStats();
    const hasRecordedRef = useRef(false);

    // Parse survivors and eliminated from params
    const survivors: string[] = useMemo(() => {
        try {
            return JSON.parse(params.survivors as string) || [];
        } catch {
            return [];
        }
    }, [params.survivors]);

    const eliminated: string[] = useMemo(() => {
        try {
            return JSON.parse(params.eliminated as string) || [];
        } catch {
            return [];
        }
    }, [params.eliminated]);

    const hasSurvivors = survivors.length > 0;
    const hasEliminated = eliminated.length > 0;

    // Record game stats on mount
    useEffect(() => {
        if (!hasRecordedRef.current) {
            hasRecordedRef.current = true;
            recordGamePlayed('Ride the Bus', 'completed', '🚌');
        }
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#002000', '#005000']}
                style={styles.background}
            />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.content}>
                        {/* Header Icon */}
                        <View style={styles.iconContainer}>
                            <Text style={styles.gameIcon}>{hasSurvivors ? '🏆' : '💀'}</Text>
                        </View>

                        <Text style={styles.title}>GAME OVER</Text>
                        <Text style={styles.subtitle}>The bus ride is complete!</Text>

                        {/* Leaderboard */}
                        <View style={styles.leaderboard}>
                            {/* Survivors Section */}
                            {hasSurvivors && (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionIcon}>🎉</Text>
                                        <Text style={styles.sectionTitle}>SURVIVORS</Text>
                                    </View>
                                    {survivors.map((player, index) => (
                                        <View key={player} style={styles.survivorRow}>
                                            <View style={styles.rankBadge}>
                                                <Text style={styles.rankText}>{index + 1}</Text>
                                            </View>
                                            <Text style={styles.playerName}>{player}</Text>
                                            <Text style={styles.statusIcon}>✅</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Eliminated Section */}
                            {hasEliminated && (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionIcon}>💀</Text>
                                        <Text style={[styles.sectionTitle, styles.eliminatedTitle]}>ELIMINATED</Text>
                                    </View>
                                    {eliminated.map((player, index) => (
                                        <View key={player} style={styles.eliminatedRow}>
                                            <View style={styles.eliminatedBadge}>
                                                <Ionicons name="close" size={16} color="#FF6B6B" />
                                            </View>
                                            <Text style={styles.eliminatedName}>{player}</Text>
                                            <Text style={styles.statusIcon}>🍺</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* No one played message */}
                            {!hasSurvivors && !hasEliminated && (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyText}>No results to show</Text>
                                </View>
                            )}
                        </View>

                        {/* Stats Summary */}
                        <View style={styles.statsCard}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{survivors.length}</Text>
                                <Text style={styles.statLabel}>Survived</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{eliminated.length}</Text>
                                <Text style={styles.statLabel}>Eliminated</Text>
                            </View>
                        </View>

                        {/* Buttons */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => router.push('/ride-the-bus-pre-game')}
                        >
                            <LinearGradient
                                colors={['#2E8B57', '#3CB371']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.buttonText}>PLAY AGAIN</Text>
                                <Ionicons name="refresh" size={24} color="white" />
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={() => router.push('/spicy-games')}
                        >
                            <Text style={styles.secondaryButtonText}>BACK TO MENU</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 30,
    },
    iconContainer: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(46, 139, 87, 0.2)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#3CB371',
    },
    gameIcon: {
        fontSize: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 2,
        textShadowColor: '#3CB371',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 30,
        fontStyle: 'italic',
    },
    leaderboard: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(60, 179, 113, 0.3)',
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10,
    },
    sectionIcon: {
        fontSize: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3CB371',
        letterSpacing: 1,
    },
    eliminatedTitle: {
        color: '#FF6B6B',
    },
    survivorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(60,179,113,0.15)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        gap: 12,
    },
    rankBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFD700',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    playerName: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    statusIcon: {
        fontSize: 20,
    },
    eliminatedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,107,107,0.1)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        gap: 12,
    },
    eliminatedBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,107,107,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    eliminatedName: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
    },
    emptyState: {
        padding: 30,
        alignItems: 'center',
    },
    emptyText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 15,
        padding: 20,
        width: '100%',
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    statLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    button: {
        width: '100%',
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: 15,
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
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'transparent',
    },
    secondaryButtonText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
