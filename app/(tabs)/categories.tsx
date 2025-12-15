import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Only show 4 categories in 2x2 grid
// Row 1: Action (left), Humor (right)
// Row 2: Word/Mental (left), Spicy (right)
const categories = [
    { id: '1', title: 'Action Rush', icon: '⚡️', color: '#F44336', path: '/action-adrenaline-games' },
    { id: '2', title: 'Humor Fun', icon: '😂', color: '#FF9800', path: '/humor-creativity-games' },
    { id: '3', title: 'Word / Mental', icon: '💡', color: '#FFC107', path: '/word-mental-games' },
    { id: '6', title: 'Spicy / 18+', icon: '🔥', color: '#9C27B0', path: '/spicy-games' },
];

export default function Categories() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.header}>Choose a Category</Text>

                {/* 2x2 Grid */}
                <View style={styles.grid}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={styles.buttonOuter}
                            activeOpacity={0.85}
                            onPress={() => {
                                if (cat.path) router.push(cat.path);
                            }}
                        >
                            <LinearGradient
                                colors={[cat.color, adjustColor(cat.color, -30)]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.buttonInner}
                            >
                                <View style={styles.iconCircle}>
                                    <Text style={styles.icon}>{cat.icon}</Text>
                                </View>
                                <Text style={styles.title}>{cat.title}</Text>
                                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" style={styles.chevron} />
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Coming Soon Banner */}
                <View style={styles.bannerContainer}>
                    <LinearGradient
                        colors={['#2a1a4a', '#1a0a3a', '#0f0520']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.banner}
                    >
                        {/* 3D Effect layers */}
                        <View style={styles.bannerGlow} />
                        <View style={styles.bannerInner}>
                            <View style={styles.bannerIconRow}>
                                <Text style={styles.bannerEmoji}>🎮</Text>
                                <Text style={styles.bannerEmoji}>✨</Text>
                                <Text style={styles.bannerEmoji}>🎁</Text>
                            </View>
                            <Text style={styles.bannerTitle}>NEW GAMES</Text>
                            <Text style={styles.bannerSubtitle}>Coming Soon!</Text>
                            <View style={styles.bannerDivider} />
                            <Text style={styles.bannerDescription}>
                                Special games and seasonal events{'\n'}will be available soon!
                            </Text>
                        </View>
                    </LinearGradient>
                </View>
            </ScrollView>
        </View>
    );
}

// Helper to darken a hex color
function adjustColor(hex: string, amount: number): string {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#230E4B',
    },
    scrollContent: {
        paddingTop: 60,
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
        letterSpacing: 1.2,
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 15,
    },
    buttonOuter: {
        width: '47%',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 12,
    },
    buttonInner: {
        borderRadius: 24,
        overflow: 'hidden',
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        minHeight: 140,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    icon: {
        fontSize: 32,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.3,
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    chevron: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    // Coming Soon Banner
    bannerContainer: {
        marginTop: 35,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 15,
    },
    banner: {
        borderRadius: 24,
        padding: 4,
        position: 'relative',
    },
    bannerGlow: {
        position: 'absolute',
        top: -50,
        left: '50%',
        marginLeft: -100,
        width: 200,
        height: 100,
        backgroundColor: '#8B5CF6',
        opacity: 0.15,
        borderRadius: 100,
    },
    bannerInner: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(139,92,246,0.3)',
    },
    bannerIconRow: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 15,
    },
    bannerEmoji: {
        fontSize: 36,
    },
    bannerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 3,
        textShadowColor: '#8B5CF6',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    bannerSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#8B5CF6',
        marginTop: 5,
        letterSpacing: 1,
    },
    bannerDivider: {
        width: 80,
        height: 3,
        backgroundColor: '#8B5CF6',
        borderRadius: 2,
        marginVertical: 15,
        opacity: 0.6,
    },
    bannerDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 20,
    },
});