import React from 'react';
import { GameListScreen, Game } from '../components/GameListScreen';
import { useTheme } from '../utils/ThemeContext';

const games: Game[] = [
  { title: 'Truth or Bluff', description: 'Tell a story - real or fake. Others vote if it\'s true or a bluff!', emoji: '🤥', color: '#ff4f81', path: '/truth-or-bluff' },
  { title: 'If you Laugh you lose', description: 'Try not to laugh while others do their best to make you crack up!', emoji: '😆', color: '#36c9c6', path: '/if-you-laugh-you-lose' },
  { title: 'Extreme Challenge Roulette', description: 'Spin the wheel and complete wild challenges!', emoji: '🎡', color: '#f9c846', path: '/PreGameScreen' },
  { title: 'Lip Sync Chaos', description: 'Lip sync to random songs and let others guess!', emoji: '🎧', color: '#5f6bff', path: '/lip-sync-pre-game' },
  { title: 'Mic Madness', description: 'Sing, rap, or speak - the mic decides your fate!', emoji: '🎤', color: '#7dff6a', path: '/mic-madness' },
];

export default function HumorCreativityGamesScreen() {
  const { theme } = useTheme();

  // Use theme background if available, otherwise use default
  const backgroundImage = theme.categoryBackgrounds?.humorCreativity || require('../assets/images/HumorBg.png');

  return (
    <GameListScreen
      title="Humor / Creativity"
      games={games}
      backgroundImage={backgroundImage}
      backgroundColor="#2d1b69"
    />
  );
}
