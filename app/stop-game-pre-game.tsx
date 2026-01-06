
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameStartScreen } from '../components/GameStartScreen';
import { PulsingButton } from '../components/PulsingButton';
import { RuleSection, RulesModal } from '../components/RulesModal';

const DEFAULT_CATEGORIES = [
    'Food', 'Animal', 'Celebrity', 'Object', 'App',
    'Silly excuse', 'Something embarrassing', 'Color',
    'Place', 'TikTok trend', 'Something your mom says', 'Movie'
];

export default function StopGamePreGame() {
    const router = useRouter();
    const [numPlayers, setNumPlayers] = useState(2);
    const [numRounds, setNumRounds] = useState(3);
    const [gameMode, setGameMode] = useState<'pass-phone' | 'team'>('pass-phone');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        DEFAULT_CATEGORIES.slice(0, 8)
    );
    const [showRules, setShowRules] = useState(false);

    const toggleCategory = (category: string) => {
        if (selectedCategories.includes(category)) {
            if (selectedCategories.length > 4) {
                setSelectedCategories(selectedCategories.filter(c => c !== category));
            }
        } else {
            if (selectedCategories.length < 12) {
                setSelectedCategories([...selectedCategories, category]);
            }
        }
    };

    const handleStart = () => {
        router.push({
            pathname: '/stop-game',
            params: {
                numPlayers,
                numRounds,
                gameMode,
                categories: JSON.stringify(selectedCategories)
            }
        });
    };

    return (
        <LinearGradient
            colors={['#48dbfb', '#0abde3', '#48dbfb']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <GameStartScreen
                backgroundColor="transparent"
                backgroundImage={require('../assets/images/wordbg.png')}
                logoImage={require('../assets/images/gameLogos/stop_game_logo.png')}
                minPlayers={2}
                maxPlayers={10}
                playerCount={numPlayers}
                setPlayerCount={setNumPlayers}
                onStart={handleStart}
                onInstructions={() => setShowRules(true)}
                hideStartButton={true}
                playerCountLabel={gameMode === 'team' ? 'Teams' : 'Players'}
                accentColor="#0abde3"
            >
                <View style={{ flex: 1, width: '100%' }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Game Mode Selection */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Game Mode</Text>
                            <View style={styles.modeContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.modeButton,
                                        gameMode === 'pass-phone' && styles.modeButtonActive
                                    ]}
                                    onPress={() => {
                                        setGameMode('pass-phone');
                                        setNumPlayers(Math.min(numPlayers, 10)); // Re-validate if needed
                                    }}
                                >
                                    <Text style={[
                                        styles.modeIcon,
                                        gameMode === 'pass-phone' && styles.modeIconActive
                                    ]}>📱</Text>
                                    <Text style={[
                                        styles.modeText,
                                        gameMode === 'pass-phone' && styles.modeTextActive
                                    ]}>Pass-the-Phone</Text>
                                    <Text style={styles.modeDescription}>One player at a time</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.modeButton,
                                        gameMode === 'team' && styles.modeButtonActive
                                    ]}
                                    onPress={() => {
                                        setGameMode('team');
                                        // Maybe adjust max teams? For now 10 is fine.
                                    }}
                                >
                                    <Text style={[
                                        styles.modeIcon,
                                        gameMode === 'team' && styles.modeIconActive
                                    ]}>👥</Text>
                                    <Text style={[
                                        styles.modeText,
                                        gameMode === 'team' && styles.modeTextActive
                                    ]}>Team Mode</Text>
                                    <Text style={styles.modeDescription}>Teams compete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Rounds Counter */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Number of Rounds</Text>
                            <View style={styles.counterPill}>
                                <PulsingButton
                                    style={styles.counterButton}
                                    onPress={() => setNumRounds(Math.max(3, numRounds - 1))}
                                >
                                    <Text style={styles.counterButtonText}>−</Text>
                                </PulsingButton>
                                <Text style={styles.counterText}>{numRounds}</Text>
                                <PulsingButton
                                    style={styles.counterButton}
                                    onPress={() => setNumRounds(Math.min(5, numRounds + 1))}
                                >
                                    <Text style={styles.counterButtonText}>+</Text>
                                </PulsingButton>
                            </View>
                        </View>

                        {/* Categories Section */}
                        <View style={styles.section}>
                            <View style={styles.categoryHeader}>
                                <Text style={styles.sectionTitle}>
                                    Categories ({selectedCategories.length}/12)
                                </Text>
                                <TouchableOpacity
                                    style={styles.autoGenButton}
                                    onPress={() => {
                                        const shuffled = [...DEFAULT_CATEGORIES].sort(() => Math.random() - 0.5);
                                        setSelectedCategories(shuffled.slice(0, 8));
                                    }}
                                >
                                    <Ionicons name="shuffle" size={18} color="#fff" />
                                    <Text style={styles.autoGenText}>Auto</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.categoriesGrid}>
                                {DEFAULT_CATEGORIES.map((category) => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.categoryChip,
                                            selectedCategories.includes(category) && styles.categoryChipActive
                                        ]}
                                        onPress={() => toggleCategory(category)}
                                    >
                                        <Text style={[
                                            styles.categoryChipText,
                                            selectedCategories.includes(category) && styles.categoryChipTextActive
                                        ]}>
                                            {category}
                                        </Text>
                                        {selectedCategories.includes(category) && (
                                            <Ionicons name="checkmark-circle" size={16} color="#fff" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.categoryHint}>
                                Select 4-12 categories. Tap to add/remove.
                            </Text>
                        </View>

                        {/* Start Button */}
                        <TouchableOpacity
                            style={[
                                styles.startButton,
                                selectedCategories.length < 4 && styles.startButtonDisabled
                            ]}
                            onPress={handleStart}
                            disabled={selectedCategories.length < 4}
                        >
                            <LinearGradient
                                colors={selectedCategories.length >= 4 ? ['#ffd32a', '#ff9f1a'] : ['#999', '#666']}
                                style={styles.startButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.startButtonText}>START GAME</Text>
                                <Ionicons name="play-circle" size={28} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                <RulesModal
                    visible={showRules}
                    onClose={() => setShowRules(false)}
                    title="How to Play"
                    accentColor="#0abde3"
                >
                    <RuleSection title="🎯 Objective">
                        Come up with words for each category that start with a random letter!
                    </RuleSection>
                    <RuleSection title="🎮 How It Works">
                        • Random letter is chosen{'\n'}
                        • Fill each category with a word{'\n'}
                        • Shout "STOP!" when done{'\n'}
                        • Unique answers = points!
                    </RuleSection>
                    <RuleSection title="🏆 Scoring">
                        Unique answers score! Duplicate answers with other players = no points.
                    </RuleSection>
                </RulesModal>
            </GameStartScreen>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
        paddingTop: 10,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    modeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    modeButton: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'transparent',
    },
    modeButtonActive: {
        backgroundColor: '#fff',
        borderColor: '#ffd32a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modeIcon: {
        fontSize: 36,
        marginBottom: 8,
    },
    modeIconActive: {
        transform: [{ scale: 1.1 }],
    },
    modeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 4,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    modeTextActive: {
        color: '#0abde3',
    },
    modeDescription: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    counterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 50,
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: 'space-between',
        borderWidth: 3,
        borderColor: '#ffd32a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    counterButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#0abde3',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    counterButtonText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
    },
    counterText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0abde3',
        minWidth: 60,
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    autoGenButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    autoGenText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryChip: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    categoryChipActive: {
        backgroundColor: '#0abde3',
        borderColor: '#fff',
    },
    categoryChipText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        fontWeight: '600',
    },
    categoryChipTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    categoryHint: {
        marginTop: 12,
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        fontStyle: 'italic',
    },
    startButton: {
        marginTop: 10,
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
        marginBottom: 40,
    },
    startButtonDisabled: {
        opacity: 0.5,
    },
    startButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 12,
    },
    startButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
});

