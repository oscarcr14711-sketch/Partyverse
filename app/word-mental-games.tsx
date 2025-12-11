import React from 'react';
import { GameListScreen, Game } from '../components/GameListScreen';
import { useTheme } from '../utils/ThemeContext';

const games: Game[] = [
  { title: 'Brain Buzzer', description: 'The app gives you a quick trick question. Answer fast — but think twice before you speak!', emoji: '🧩', color: '#ff6b6b', path: '/brain-buzzer-pre-game' },
  { title: 'Brain vs Brain', description: 'Two players face off. The app shows a question. The first one to shout the right answer gets the point!', emoji: '⚔️', color: '#feca57', path: '/brain-vs-brain-pre-game' },
  { title: 'Stop Game', description: 'Be the fastest to type, write or say words that start with a specific letter before everyone else.', emoji: '🛑', color: '#48dbfb', path: '/stop-game-intro' },
  { title: 'Memory Rush', description: 'The app flashes a list of words for 5 seconds. Players must recall as many as possible when time runs out.', emoji: '🧠💨', color: '#ff9f43', path: '/memory-rush-pre-game' },
  { title: 'Phrase Master', description: 'Guess the hidden phrase letter by letter. Like Wheel of Fortune but with friends!', emoji: '🎯', color: '#00ffff', path: '/phrase-master-pre-game' },
];

export default function WordMentalGamesScreen() {
  const { theme } = useTheme();

  // Use theme background if available, otherwise use default
  const backgroundImage = theme.categoryBackgrounds?.wordMental || require('../assets/images/wordbg.png');

  return (
    <GameListScreen
      title="Word / Mental"
      games={games}
      backgroundImage={backgroundImage}
      backgroundColor="#0f3460"
    />
  );
}
