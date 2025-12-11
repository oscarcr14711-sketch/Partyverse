import React from 'react';
import { GameListScreen, Game } from '../components/GameListScreen';

const games: Game[] = [
  { title: 'Most Likely To…', description: 'Everyone votes who\'s most likely to X.', emoji: '🤔', color: '#8e44ad', path: '/most-likely-to' },
  { title: '2 Truths, 1 Lie', description: 'Classic guessing game.', emoji: '🤥', color: '#3498db', path: '/two-truths-one-lie' },
  { title: 'Never Have I Ever (Light)', description: 'Soft, family-friendly version.', emoji: '😇', color: '#2ecc71', path: '/never-have-i-ever' },
  { title: 'Funny Confessions', description: 'Answer silly questions.', emoji: '😂', color: '#f1c40f', path: '/funny-confessions' },
  { title: 'Know your crew', description: 'The app chooses a player and draws a card with a question, current player has to answer the question to prove how much knowledge of their family and friends they have.', emoji: '💞', color: '#e74c3c', path: '/know-your-crew' },
];

export default function SocialTruthGamesScreen() {
  return (
    <GameListScreen
      title="Social / Truth"
      games={games}
      backgroundColor="#1a1a2e"
    />
  );
}
