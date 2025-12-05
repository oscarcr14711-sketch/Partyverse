import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StopGameIntro() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <Text style={styles.header}>MY PARTYVERSE</Text>

                {/* Title */}
                <Text style={styles.title}>STOP GAME</Text>

                {/* Character Illustration */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/images/stop.png')}
                        style={styles.characterImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Choose Players Button */}
                <TouchableOpacity
                    style={styles.choosePlayersButton}
                    onPress={() => router.push('/stop-game-pre-game')}
                >
                    <Text style={styles.buttonText}>Choose Players</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5DADE2', // Light blue background from reference
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1B4F72', // Dark blue
        letterSpacing: 1,
        marginTop: 20,
        ...Platform.select({
            ios: { fontFamily: 'Avenir-Black' },
            android: { fontFamily: 'sans-serif-black' }
        }),
    },
    title: {
        fontSize: 56,
        fontWeight: 'bold',
        color: '#FF8C00', // Orange
        textShadowColor: '#1B4F72', // Dark blue outline
        textShadowOffset: { width: -3, height: 3 },
        textShadowRadius: 1,
        letterSpacing: 3,
        marginTop: -20,
        ...Platform.select({
            ios: { fontFamily: 'Avenir-Black' },
            android: { fontFamily: 'sans-serif-black' }
        }),
    },
    imageContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    characterImage: {
        width: '90%',
        height: '100%',
        maxHeight: 500,
    },
    choosePlayersButton: {
        backgroundColor: '#FF8C00', // Orange
        paddingHorizontal: 50,
        paddingVertical: 18,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: 3,
        borderColor: '#1B4F72', // Dark blue border
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 1,
        textShadowColor: '#1B4F72',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 1,
        ...Platform.select({
            ios: { fontFamily: 'Avenir-Black' },
            android: { fontFamily: 'sans-serif-black' }
        }),
    },
});
