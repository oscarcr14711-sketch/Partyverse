import React from 'react';
import { GameListScreen, Game } from '../components/GameListScreen';

const games: Game[] = [
  { title: 'Last Spoon Standing', description: 'Collect four of the same digital cards as fast as you can. When you\'re ready — grab a spoon before anyone else! The last one without a spoon… is out.', emoji: '🥄', color: '#5390d9', path: '/last-spoon-standing' },
  { title: 'Poker Widow', description: 'Build the best poker hand by swapping cards with the five cards in the center — the Widow. In the first round, you can trade your entire hand for the Widow. After that, swap one card per turn until you decide to stay.', emoji: '♠️', color: '#7209b7', path: '/poker-widow' },
  { title: 'Party Poll', description: 'Guess the most popular answers to funny survey questions before the other team does! The faster and closer you get to the top answers, the more points you score.', emoji: '📊', color: '#ef476f', path: '/party-poll' },
  { title: 'Charades (Party Edition)', description: 'One player acts out a secret word while others try to guess it before time runs out — no speaking allowed!', emoji: '🎭', color: '#fca311', path: '/charades-party-edition' },
  { title: 'Card Clash', description: 'Choose the perfect card before time runs out! Outsmart, block, or steal your way to victory.', emoji: '🃏', color: '#006400', path: '/card-clash' },
];

export default function QuickCompetitionGamesScreen() {
  return (
    <GameListScreen
      title="Quick Competition"
      games={games}
      backgroundColor="#0a2239"
    />
  );
}
