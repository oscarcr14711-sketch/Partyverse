import { Asset } from 'expo-asset';
import React, { useEffect } from 'react';
import { GameListScreen, Game } from '../components/GameListScreen';
import { useTheme } from '../utils/ThemeContext';

const games: Game[] = [
  { title: 'Hot Bomb', description: 'Pass the bomb before it explodes!', emoji: '💣', color: '#f94144', path: '/hot-bomb-game' },
  { title: 'Stack Tower', description: 'Stack blocks as high as you can without falling!', emoji: '📦', color: '#f8961e', path: '/stack-tower-pre-game' },
  { title: 'Lightning Rounds', description: 'Race to complete physical challenges - last one gets a strike!', emoji: '⚡', color: '#f9c74f', path: '/lightning-rounds-pre-game' },
  { title: 'Don\'t Let It PIC You', description: 'Avoid being caught in surprise photos!', emoji: '📸', color: '#90be6d', path: '/dont-let-it-pic-you-pre-game' },
  { title: 'Blown Away', description: 'Players blow into the phone mic and whoever blows the bigger balloon without popping it, wins', emoji: '🎈', color: '#43aa8b', path: '/blown-away' },
];

export default function ActionAdrenalineGamesScreen() {
  const { theme } = useTheme();

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
      title="Action / Adrenaline"
      games={games}
      backgroundImage={backgroundImage}
      backgroundColor="#1a1a2e"
    />
  );
}
