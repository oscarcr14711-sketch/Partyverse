import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameStartScreen } from '../components/GameStartScreen';
import { RuleSection, RulesModal } from '../components/RulesModal';

const CATEGORIES = [
    { id: 'Random Mix', label: '🎲 Random Mix', description: 'Mix of all categories' },
    { id: 'Movie Quotes', label: '🎬 Movie Quotes', description: 'Famous movie lines' },
    { id: 'Song Lyrics', label: '🎵 Song Lyrics', description: 'Popular song phrases' },
    { id: 'Famous Sayings', label: '💬 Famous Sayings', description: 'Common expressions' },
    { id: 'TV Shows', label: '📺 TV Shows', description: 'Television classics' },
    { id: 'Book Titles', label: '📚 Book Titles', description: 'Literary favorites' },
    { id: 'Common Expressions', label: '🗣️ Expressions', description: 'Idioms & phrases' },
];

export default function PhraseMasterPreGame() {
    const router = useRouter();
    const [showRules, setShowRules] = useState(false);
    const [showCategories, setShowCategories] = useState(false);

    const handleStartGame = (category: string = 'Random Mix') => {
        setShowCategories(false);
        router.push({
            pathname: '/phrase-master-setup',
            params: { category }
        });
    };

    return (
        <GameStartScreen
            backgroundColor="#8B0000"
            gameImage={require('../assets/images/Newguessphrase.png')}
            gameImageResizeMode="cover"
            logoImage={require('../assets/images/gameLogos/guess_phrase_logo.png')}
            onStart={() => setShowCategories(true)}
            onInstructions={() => setShowRules(true)}
            minPlayers={0}
            maxPlayers={0}
            playerCount={0}
            setPlayerCount={() => { }}
            hidePlayerSelection={true}
            startButtonText="PLAY"
            accentColor="#263238"
        >
            {/* Category Selection Modal */}
            {showCategories && (
                <View style={styles.modalOverlay}>
                    <View style={styles.categoryModal}>
                        <Text style={styles.modalTitle}>Choose Category</Text>
                        <ScrollView style={styles.categoryScroll} showsVerticalScrollIndicator={false}>
                            {CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={styles.categoryButton}
                                    onPress={() => handleStartGame(cat.id)}
                                >
                                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                                    <Text style={styles.categoryDesc}>{cat.description}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowCategories(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <RulesModal
                visible={showRules}
                onClose={() => setShowRules(false)}
                title="How to Play"
                accentColor="#FF6B9D"
            >
                <RuleSection title="Objective">
                    Guess letters to reveal a hidden common phrase using clues! Solve it before your opponent or time runs out.
                </RuleSection>
                <RuleSection title="Game Flow">
                    1. A phrase is hidden with blank spaces{'\n'}
                    2. Use the clue to help figure it out{'\n'}
                    3. Tap letters to reveal them{'\n'}
                    4. 3 wrong guesses = switch to next player{'\n'}
                    5. 60 seconds per turn - timer resets on switch!
                </RuleSection>
                <RuleSection title="Scoring">
                    • Base 10 points for solving{'\n'}
                    • Time bonus: +1 point per 2 seconds left{'\n'}
                    • Using clue: -5 point penalty{'\n'}
                    • Each correct letter: +1 point per occurrence
                </RuleSection>
                <RuleSection title="Tips">
                    • Use the clue - it's there to help!{'\n'}
                    • Start with common letters (E, A, R, T){'\n'}
                    • Watch the timer - solve quickly for bonus points{'\n'}
                    • Strategic guessing beats random tapping!
                </RuleSection>
            </RulesModal>
        </GameStartScreen>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 50, // Ensure it's above other content
    },
    categoryModal: {
        backgroundColor: '#1a1a2e',
        borderRadius: 25,
        padding: 25,
        width: '100%',
        maxWidth: 350,
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    categoryScroll: {
        maxHeight: 350,
    },
    categoryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 15,
        padding: 18,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    categoryLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    categoryDesc: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    cancelButton: {
        backgroundColor: 'rgba(255, 100, 100, 0.2)',
        borderRadius: 15,
        paddingVertical: 14,
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 100, 100, 0.3)',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff6b6b',
        textAlign: 'center',
    },
});
