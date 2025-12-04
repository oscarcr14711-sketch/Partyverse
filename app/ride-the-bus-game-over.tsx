import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RideTheBusGameOver() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#002000', '#005000']}
                style={styles.background}
            />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.gameIcon}>🎉</Text>
                    </View>

                    <Text style={styles.title}>YOU SURVIVED!</Text>
                    <Text style={styles.subtitle}>The bus ride is over.</Text>

                    <View style={styles.statsCard}>
                        <Text style={styles.statText}>Hope you're not too dizzy!</Text>
                    </View>

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
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    iconContainer: {
        width: 120,
        height: 120,
        backgroundColor: 'rgba(46, 139, 87, 0.2)',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 3,
        borderColor: '#3CB371',
    },
    gameIcon: {
        fontSize: 60,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        letterSpacing: 2,
        textShadowColor: '#3CB371',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#rgba(255,255,255,0.7)',
        marginBottom: 50,
        fontStyle: 'italic',
    },
    statsCard: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 30,
        width: '100%',
        marginBottom: 50,
        borderWidth: 1,
        borderColor: 'rgba(60, 179, 113, 0.3)',
        alignItems: 'center',
    },
    statText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        width: '100%',
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: 20,
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
