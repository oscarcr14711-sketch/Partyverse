import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const games = [
  { title: 'Last Spoon Standing', description: 'Collect four of the same digital cards as fast as you can.\nWhen you’re ready — grab a spoon before anyone else!\nThe last one without a spoon… is out.', emoji: '🥄', color: '#5390d9', path: '/last-spoon-standing' },
  { title: 'Poker Widow', description: 'Build the best poker hand by swapping cards with the five cards in the center — the Widow.\nIn the first round, you can trade your entire hand for the Widow.\nAfter that, swap one card per turn until you decide to stay.', emoji: '♠️', color: '#7209b7', path: '/poker-widow' },
  { title: 'Party Poll', description: 'Guess the most popular answers to funny survey questions before the other team does! The faster and closer you get to the top answers, the more points you score.', emoji: '📊', color: '#ef476f', path: '/party-poll' },
  { title: 'Charades (Party Edition)', description: 'One player acts out a secret word while others try to guess it before time runs out — no speaking allowed!', emoji: '🎭', color: '#fca311', path: '/charades-party-edition' },
  { title: 'Card Clash', description: 'Choose the perfect card before time runs out!\nOutsmart, block, or steal your way to victory.', emoji: '🃏', color: '#00b4d8', path: '/card-clash' },
];

const GameItem = ({ title, description, emoji, color, onPress }) => (
  <TouchableOpacity style={[styles.gameButton, { backgroundColor: color }]} onPress={onPress}>
    <Text style={styles.gameTitle}>{emoji} {title}</Text>
    <Text style={styles.gameDescription}>{description}</Text>
  </TouchableOpacity>
);

export default function QuickCompetitionGamesScreen() {
  const router = useRouter();

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Quick Competition</Text>
          </View>
          <View style={styles.grid}>
            {games.map((game) => (
              <GameItem key={game.title} {...game} onPress={() => router.push(game.path)} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#43aa8b',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  grid: {
    justifyContent: 'space-around',
  },
  gameButton: {
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  gameTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold'
  },
  gameDescription: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
});
