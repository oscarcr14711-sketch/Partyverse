import React from 'react';
import { GameListScreen, Game } from '../components/GameListScreen';
import { useTheme } from '../utils/ThemeContext';
import { useLanguage } from '../utils/LanguageContext';

export default function WordMentalGamesScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const games: Game[] = [
    { title: 'Brain Buzzer', description: t('games.brainBuzzer.description'), emoji: '🧩', logo: require('../assets/images/gameLogos/brain_buzzer_logo.png'), color: '#ff6b6b', path: '/pre-game/brain-buzzer' },
    { title: 'Brain vs Brain', description: t('games.brainVsBrain.description'), emoji: '⚔️', logo: require('../assets/images/gameLogos/brainvsbrain_logo.png'), color: '#feca57', path: '/pre-game/brain-vs-brain' },
    { title: 'Stop Game', description: t('games.stopGame.description'), emoji: '🛑', logo: require('../assets/images/gameLogos/stop_game_logo.png'), color: '#48dbfb', path: '/pre-game/stop-game' },
    { title: 'Memory Rush', description: t('games.memoryRush.description'), emoji: '🧠💨', logo: require('../assets/images/gameLogos/memory_rush_logo.png'), color: '#ff9f43', path: '/pre-game/memory-rush' },
    { title: 'Phrase Master', description: t('games.phraseMaster.description'), emoji: '🎯', logo: require('../assets/images/gameLogos/guess_phrase_logo.png'), color: '#00ffff', path: '/phrase-master-pre-game' },
  ];

  // Use theme background if available, otherwise use default
  const backgroundImage = theme.categoryBackgrounds?.wordMental || require('../assets/images/wordbg.png');

  return (
    <GameListScreen
      title={t('categories.wordMentalTitle')}
      games={games}
      backgroundImage={backgroundImage}
      backgroundColor="#0f3460"
    />
  );
}
