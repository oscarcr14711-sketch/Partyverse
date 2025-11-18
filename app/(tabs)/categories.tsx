
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const categories = [
    { id: '1', title: 'Action / Adrenaline', icon: '⚡️', color: '#F44336', path: '/action-adrenaline-games' },
    { id: '2', title: 'Humor / Creativity', icon: '😂', color: '#FF9800', path: '/humor-creativity-games' },
    { id: '3', title: 'Word / Mental', icon: '💡', color: '#FFC107', path: '/word-mental-games' },
    { id: '4', title: 'Quick Competition', icon: '🏁', color: '#4CAF50', path: '/quick-competition-games' },
    { id: '5', title: 'Social / Truth', icon: '💬', color: '#000000', path: '/social-truth-games' },
    { id: '6', title: 'Spicy / 18+ / Alcohol', icon: '🔥', color: '#9C27B0', path: '/spicy-games' },
    { id: '7', title: 'Specials (Weekly / Festive) (Coming Soon)', icon: '🎁', color: '#FF9800', path: null, disabled: true },
];

export default function Categories() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Choose a Category</Text>
            <View style={styles.grid}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.buttonOuter, cat.disabled && { opacity: 0.5 }]}
                        activeOpacity={cat.disabled ? 1 : 0.85}
                        disabled={cat.disabled}
                        onPress={() => cat.path && router.push(cat.path)}
                    >
                        <LinearGradient
                            colors={[cat.color, '#fff']}
                            start={{ x: 0.2, y: 0 }}
                            end={{ x: 0.8, y: 1 }}
                            style={styles.buttonInner}
                        >
                            <View style={styles.iconCircle}>
                                <Text style={styles.icon}>{cat.icon}</Text>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{cat.title}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.chevron} />
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#230E4B',
        paddingTop: 48,
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 32,
        letterSpacing: 1.2,
    },
    grid: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 22,
    },
    buttonOuter: {
        width: '98%',
        borderRadius: 40,
        marginBottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 14,
    },
    buttonInner: {
        borderRadius: 36,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 22,
        paddingHorizontal: 28,
        justifyContent: 'flex-start',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.35)',
        borderBottomWidth: 3,
        borderBottomColor: 'rgba(0,0,0,0.25)',
        minHeight: 80,
        gap: 18,
    },
    iconCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18,
    },
    icon: {
        fontSize: 32,
        color: '#fff',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    chevron: {
        marginLeft: 8,
    },
});