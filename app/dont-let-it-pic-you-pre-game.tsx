import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DontLetItPicYouPreGame() {
    const router = useRouter();
    const [showRules, setShowRules] = useState(false);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1a3a5c" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {/* 3D Style Title */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleLine1}>DON'T LET IT</Text>
                        <View style={styles.title3DContainer}>
                            <Text style={styles.title3DShadow}>PIC YOU</Text>
                            <Text style={styles.title3DMain}>PIC YOU</Text>
                        </View>
                        <Text style={styles.cameraEmoji}>📸</Text>
                    </View>

                    <Image
                        source={require('../assets/images/picyou.png')}
                        style={styles.mainImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => router.push('/dont-let-it-pic-you-game')}
                    >
                        <Text style={styles.startButtonText}>START GAME</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.infoButton}
                        onPress={() => setShowRules(true)}
                    >
                        <Text style={styles.infoButtonText}>i</Text>
                    </TouchableOpacity>
                </View>

                {/* Rules Modal */}
                <Modal
                    visible={showRules}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowRules(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>How to Play</Text>
                                <TouchableOpacity onPress={() => setShowRules(false)}>
                                    <Ionicons name="close" size={24} color="#1a3a5c" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.modalScroll}>
                                <Text style={styles.sectionTitle}>🎯 Objective</Text>
                                <Text style={styles.ruleText}>
                                    Avoid being caught in photos! One player is the photographer,
                                    others must hide or dodge before the picture is taken.
                                </Text>

                                <Text style={styles.sectionTitle}>📱 Game Flow</Text>
                                <Text style={styles.ruleText}>
                                    1. One player becomes the photographer{'\n'}
                                    2. Other players must hide or cover their faces{'\n'}
                                    3. Photographer counts down and takes a photo{'\n'}
                                    4. Anyone caught in the photo gets a point{'\n'}
                                    5. Player with least points wins!
                                </Text>

                                <Text style={styles.sectionTitle}>⚡ Tips</Text>
                                <Text style={styles.ruleText}>
                                    • Move quickly when the countdown starts{'\n'}
                                    • Find creative ways to hide{'\n'}
                                    • Watch out for surprise photos!
                                </Text>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b8d935',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 20,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    titleLine1: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a3a5c',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-black' }),
        letterSpacing: 2,
    },
    title3DContainer: {
        position: 'relative',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title3DShadow: {
        position: 'absolute',
        fontSize: 52,
        fontWeight: 'bold',
        color: '#0d1f30',
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
        letterSpacing: 3,
        top: 4,
        left: 4,
    },
    title3DMain: {
        fontSize: 52,
        fontWeight: 'bold',
        color: '#1a3a5c',
        fontFamily: Platform.select({ ios: 'Avenir-Black', android: 'sans-serif-black' }),
        letterSpacing: 3,
        textShadowColor: '#ffffff',
        textShadowOffset: { width: -2, height: -2 },
        textShadowRadius: 0,
    },
    cameraEmoji: {
        fontSize: 32,
        marginTop: 5,
    },
    mainImage: {
        width: '100%',
        height: '65%',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
        paddingBottom: 50,
        paddingHorizontal: 20,
    },
    startButton: {
        backgroundColor: '#1a3a5c',
        borderRadius: 30,
        paddingHorizontal: 50,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        borderBottomWidth: 4,
        borderBottomColor: '#0d1f30',
    },
    startButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    infoButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1a3a5c',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderBottomWidth: 3,
        borderBottomColor: '#0d1f30',
    },
    infoButtonText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#b8d935',
        borderRadius: 20,
        maxHeight: '75%',
        borderWidth: 3,
        borderColor: '#1a3a5c',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(26,58,92,0.2)',
    },
    modalTitle: {
        color: '#1a3a5c',
        fontSize: 22,
        fontWeight: 'bold',
    },
    modalScroll: {
        padding: 20,
    },
    sectionTitle: {
        color: '#1a3a5c',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 6,
    },
    ruleText: {
        color: '#1a3a5c',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 8,
    },
});
