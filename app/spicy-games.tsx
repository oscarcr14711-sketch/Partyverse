import React from 'react';
import { GameListScreen, Game } from '../components/GameListScreen';
import { useTheme } from '../utils/ThemeContext';

const games: Game[] = [
  { title: 'Color Clash', description: 'Red or Black? Guess the card color and drink if you\'re wrong!', emoji: '♥️♠️', color: '#4169E1', path: '/color-clash-pre-game' },
  { title: 'Ride The Bus', description: 'A classic drinking card game with escalating challenges!', emoji: '🚌🃏', color: '#2E8B57', path: '/ride-the-bus-pre-game' },
  { title: 'Drink Domino', description: 'One domino falls, everyone drinks! Chain reactions guaranteed.', emoji: '🔥🍻', color: '#FF4500', path: '/drink-domino' },
  { title: 'PartyBoard: Roll & Cheers', description: 'Roll the dice and move around the party board!', emoji: '🎲🍻', color: '#DA70D6', path: '/party-board' },
  { title: 'Hot Cup Spin', description: 'Spin the cup and face the consequences!', emoji: '🥤🔄', color: '#CD5C5C', path: '/hot-cup-spin' },
];

export default function SpicyGamesScreen() {
  const { theme } = useTheme();

  // Use theme background if available, otherwise use default
  const backgroundImage = theme.categoryBackgrounds?.spicy || require('../assets/images/spicy.png');

  return (
    <GameListScreen
      title="Spicy / 18+ / Alcohol"
      games={games}
      backgroundImage={backgroundImage}
      backgroundColor="#1a0a2e"
    />
  );
}
