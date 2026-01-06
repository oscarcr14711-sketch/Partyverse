import { Asset } from 'expo-asset';
import React, { useEffect } from 'react';
import { Game, GameListScreen } from '../components/GameListScreen';
import { useLanguage } from '../utils/LanguageContext';
import { useTheme } from '../utils/ThemeContext';

export default function ActionAdrenalineGamesScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const games: Game[] = [
    { title: 'Hot Bomb', description: t('games.hotBomb.description'), emoji: '💣', logo: require('../assets/images/gameLogos/Hotbomblogo.png'), color: '#f94144', path: '/pre-game/hot-bomb' },
    { title: 'Stack Tower', description: t('games.stackTower.description'), emoji: '📦', logo: require('../assets/images/gameLogos/stacktowerlogo.png'), color: '#f8961e', path: '/pre-game/stack-tower' },
    { title: 'Lightning Rounds', description: t('games.lightningRounds.description'), emoji: '⚡', logo: require('../assets/images/gameLogos/lightingroundslogo.png'), color: '#f9c74f', path: '/pre-game/lightning-rounds' },
    { title: "Don't Let It PIC You", description: t('games.picYou.description'), emoji: '📸', logo: require('../assets/images/gameLogos/dontletitpiclogo.png'), color: '#90be6d', path: '/pre-game/pic-you' },
    { title: 'Blown Away', description: t('games.blownAway.description'), emoji: '🎈', logo: require('../assets/images/gameLogos/BlownLogo.png'), color: '#43aa8b', path: '/pre-game/blown-away' },
  ];

  // Preload Hot Bomb assets to reduce perceived load time when navigating
  useEffect(() => {
    const assets = [
      require('../assets/images/gameLogos/Hotbomblogo.png'),
      require('../assets/images/Boom.png'),
      require('../assets/images/bomb.png'),
      require('../assets/images/citydestroyed.png'),
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
