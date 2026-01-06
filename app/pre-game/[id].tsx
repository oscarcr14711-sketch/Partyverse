
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { GameStartScreen } from '../../components/GameStartScreen';
import { RuleSection, RulesModal } from '../../components/RulesModal';
import { GAMES_CONFIG } from '../../constants/GameConfig';

import { useLanguage } from '../../utils/LanguageContext';

const GAME_ID_MAPPING: Record<string, string> = {
    'hot-bomb': 'hotBomb',
    'blown-away': 'blownAway',
    'truth-or-bluff': 'truthOrBluff',
    'if-you-laugh-you-lose': 'ifYouLaugh',
    'mic-madness': 'micMadness',
    'stack-tower': 'stackTower',
    'lightning-rounds': 'lightningRounds',
    'pic-you': 'picYou',
    'color-clash': 'colorClash',
    'memory-rush': 'memoryRush',
    'brain-vs-brain': 'brainVsBrain',
    'ride-the-bus': 'rideTheBus',
    'brain-buzzer': 'brainBuzzer',
    'lip-sync': 'lipSync',
    'stop-game': 'stopGame',
    'drink-domino': 'drinkDomino',
    'party-board': 'partyBoard',
    'hot-cup-spin': 'hotCupSpin',
    'extreme-challenge-roulette': 'extremeRoulette'
};

export default function DynamicPreGameScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [showRules, setShowRules] = useState(false);
    const { t } = useLanguage();

    // Get game config
    const gameConfig = id ? GAMES_CONFIG[id] : undefined;
    const [playerCount, setPlayerCount] = useState(gameConfig?.defaultPlayers || 2);

    if (!gameConfig || !id) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Game not found: {id}</Text>
            </View>
        );
    }

    // Resolve translations
    const translationKey = GAME_ID_MAPPING[id];
    const translatedGame = translationKey ? t(`games.${translationKey}`) : undefined;
    const translatedTitle = (translatedGame && typeof translatedGame === 'object') ? translatedGame.title : gameConfig.name;
    const translatedRules = (translatedGame && typeof translatedGame === 'object' && translatedGame.rules) ? translatedGame.rules : gameConfig.rules;

    // Determine Start Button Text
    // Favor common translations for standard values
    let startText = gameConfig.startButtonText;
    if (startText === 'START' || startText === 'START GAME') {
        startText = t('common.start');
    } else if (startText === 'Next') {
        startText = t('common.next');
    }
    // If not standard, keep english or add specific key later

    const handleStart = () => {
        const proceedToGame = () => {
            let params: any = { numPlayers: playerCount };

            // Generate players array if configured
            if (gameConfig.generatePlayers) {
                const players = Array.from({ length: playerCount }, (_, i) => ({
                    id: i + 1,
                    name: `Player ${i + 1}`, // Todo: user might want translated 'Player'
                    avatarIndex: i % 6
                }));
                params.players = JSON.stringify(players);
            }

            // Merge default params
            if (gameConfig.defaultParams) {
                params = { ...params, ...gameConfig.defaultParams };
            }

            router.push({ pathname: gameConfig.gameRoute as any, params });
        };

        if (gameConfig.startAlert) {
            Alert.alert(
                gameConfig.startAlert.title, // Should translate this too if possible
                gameConfig.startAlert.message,
                [
                    {
                        text: gameConfig.startAlert.cancelText || t('common.cancel'),
                        style: 'cancel'
                    },
                    {
                        text: gameConfig.startAlert.confirmText || t('common.start'),
                        onPress: proceedToGame
                    }
                ]
            );
        } else {
            proceedToGame();
        }
    };

    return (
        <GameStartScreen
            backgroundColor={gameConfig.backgroundColor}
            backgroundImage={gameConfig.backgroundImage}
            accentColor={gameConfig.accentColor}
            logoImage={gameConfig.logoImage}
            gameImage={gameConfig.gameImage}
            // title={translatedTitle} // Removed per user request to use logos instead of text title
            minPlayers={gameConfig.minPlayers}
            maxPlayers={gameConfig.maxPlayers}
            playerCount={playerCount}
            setPlayerCount={setPlayerCount}
            onStart={handleStart}
            onInstructions={() => setShowRules(true)}
            startButtonText={startText}
            hidePlayerSelection={gameConfig.hidePlayerSelection}
            playerCountLabel={t('common.players')} // Explicitly translate
        >
            <RulesModal
                visible={showRules}
                onClose={() => setShowRules(false)}
                title={translatedRules.title}
                accentColor={gameConfig.accentColor}
            >
                {translatedRules.sections.map((section: { title: string; content: string }, index: number) => (
                    <RuleSection key={index} title={section.title}>
                        {section.content}
                    </RuleSection>
                ))}
            </RulesModal>
        </GameStartScreen>
    );
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: 'white',
        fontSize: 18,
    },
});
