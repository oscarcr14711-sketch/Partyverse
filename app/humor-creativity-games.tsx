import React from 'react';
import { GameListScreen, Game } from '../components/GameListScreen';
import { useTheme } from '../utils/ThemeContext';
import { useLanguage } from '../utils/LanguageContext';

export default function HumorCreativityGamesScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const games: Game[] = [
    { title: 'Truth or Bluff', description: t('games.truthOrBluff.description'), emoji: '🤥', logo: require('../assets/images/gameLogos/truthlogo.png'), color: '#ff4f81', path: '/pre-game/truth-or-bluff' },
    { title: 'If You Laugh... You Lose', description: t('games.ifYouLaugh.description'), emoji: '😆', logo: require('../assets/images/gameLogos/ifyoulaughlogo.png'), color: '#36c9c6', path: '/pre-game/if-you-laugh-you-lose' },
    { title: 'Extreme Roulette', description: t('games.extremeRoulette.description'), emoji: '🎡', logo: require('../assets/images/gameLogos/extremechallengeLogo.png'), color: '#f9c846', path: '/pre-game/extreme-challenge-roulette' },
    { title: 'Lip Sync Battle', description: t('games.lipSync.description'), emoji: '🎧', logo: require('../assets/images/gameLogos/lipsynclogo.png'), color: '#5f6bff', path: '/pre-game/lip-sync' },
    { title: 'Mic Madness', description: t('games.micMadness.description'), emoji: '🎤', logo: require('../assets/images/gameLogos/micmadnesslogo.png'), color: '#7dff6a', path: '/pre-game/mic-madness' },
  ];

  // Use theme background if available, otherwise use default
  const backgroundImage = theme.categoryBackgrounds?.humorCreativity || require('../assets/images/HumorBg.png');

  return (
    <GameListScreen
      title={t('categories.humorCreativityTitle')}
      games={games}
      backgroundImage={backgroundImage}
      backgroundColor="#2d1b69"
    />
  );
}
