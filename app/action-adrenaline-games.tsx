import { Asset } from 'expo-asset';
import React, { useEffect } from 'react';
import { Game, GameListScreen } from '../components/GameListScreen';
import { useLanguage } from '../utils/LanguageContext';
import { useTheme } from '../utils/ThemeContext';

export default function ActionAdrenalineGamesScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const games: Game[] = [
    { title: t('games.hotBomb.title'), description: t('games.hotBomb.description'), emoji: '💣', color: '#f94144', path: '/hot-bomb-game' },
    { title: t('games.stackTower.title'), description: t('games.stackTower.description'), emoji: '📦', color: '#f8961e', path: '/stack-tower-pre-game' },
    { title: t('games.lightningRounds.title'), description: t('games.lightningRounds.description'), emoji: '⚡', color: '#f9c74f', path: '/lightning-rounds-pre-game' },
    { title: t('games.picYou.title'), description: t('games.picYou.description'), emoji: '📸', color: '#90be6d', path: '/dont-let-it-pic-you-pre-game' },
    { title: t('games.blownAway.title'), description: t('games.blownAway.description'), emoji: '🎈', color: '#43aa8b', path: '/blown-away' },
  ];

  // Preload Hot Bomb assets to reduce perceived load time when navigating
  useEffect(() => {
    const assets = [
      require('../assets/images/Hotbombtitle.png'),
      require('../assets/images/Boom.png'),
      require('../assets/images/bomb1.png'),
      require('../assets/images/citydestroyed.jpeg'),
    ];
    Asset.loadAsync(assets).catch(() => { });
  }, []);

  // Use theme background if available, otherwise use default
  const backgroundImage = theme.categoryBackgrounds?.actionAdrenaline || require('../assets/images/Actionbg.png');

  return (
    <GameListScreen
      title={t('categories.actionTitle')}
      games={games}
      backgroundImage={backgroundImage}
      backgroundColor="#1a1a2e"
    />
  );
}
