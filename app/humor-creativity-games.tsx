import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const games = [
  { 
    title: 'Truth or Bluff', 
    description: 'Describe the picture on screen — but you can either tell the truth or make up a lie. The other player must guess if you’re bluffing or being honest! A game of acting, deception, and laughter inspired by “Box of Lies.”', 
    emoji: '🤥', 
    color: '#ff9f43', 
    path: '/truth-or-bluff' 
  },
  { 
    title: 'If you Laugh you lose', 
    description: 'Try not to laugh while the app plays funny sounds, memes, or videos. Whoever laughs first… loses the round! Simple, chaotic, and guaranteed to break your poker face.', 
    emoji: '😆', 
    color: '#ff6b6b', 
    path: '/if-you-laugh-you-lose' 
  },
  { 
    title: 'Extreme Challenge Roulette', 
    description: 'Spin the wheel and complete the crazy dare that appears! Some are funny, some are ridiculous, and some… are just pure chaos. A fast-paced party classic with a Partyverse twist — laugh or lose!', 
    emoji: '🎡', 
    color: '#feca57', 
    path: '/extreme-challenge-roulette' 
  },
  { 
    title: 'Lip Sync Chaos', 
    description: 'Put on your headphones while loud music plays. Try to guess what your friend is saying just by reading their lips! The louder the music, the funnier it gets.', 
    emoji: '🎧', 
    color: '#48dbfb', 
    path: '/lip-sync-chaos' 
  },
  { 
    title: 'Mic Madness', 
    description: 'When the timer hits zero, a random word appears. Grab the mic and sing a line or lyric with that word before anyone else! Fast, chaotic, and full of hilarious performances — pure musical mayhem.', 
    emoji: '🎤', 
    color: '#a29bfe', 
    path: '/mic-madness' 
  },
];

const GameItem = ({ title, description, emoji, color, onPress }) => (
  <TouchableOpacity style={[styles.gameButton, { backgroundColor: color }]} onPress={onPress}>
    <Text style={styles.gameTitle}>{emoji} {title}</Text>
    <Text style={styles.gameDescription}>{description}</Text>
  </TouchableOpacity>
);

export default function HumorCreativityGamesScreen() {
  const router = useRouter();

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Humor / Creativity</Text>
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
    backgroundColor: '#ff9a8d',
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
    fontWeight: 'bold',
  },
  gameDescription: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
});
