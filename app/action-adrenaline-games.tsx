
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const games = [
  { title: 'Hot Bomb', description: 'Pass the bomb before it explodes!', emoji: '💣', color: '#f94144', path: '/hot-bomb-game' },
  { title: 'Dance Copy', description: 'Mimic the dance moves shown on screen. Others judge', emoji: '💃', color: '#f8961e', path: '/dance-copy' },
  { title: 'SpinFreeze', description: 'Music plays; when it stops, freeze.', emoji: '🥶', color: '#f9c74f', path: '/spin-freeze' },
  { title: 'Selfie Challenge', description: 'Take a selfie in 3 sec showing a prompted emotion', emoji: '🤳', color: '#90be6d', path: '/selfie-challenge' },
  { title: 'Blown Away', description: 'Players blow into the phone mic and whoever blows the bigger balloon without popping it, wins', emoji: '🎈', color: '#43aa8b', path: '/blown-away' },
];

const GameItem = ({ title, description, emoji, color, onPress }) => (
  <TouchableOpacity style={[styles.gameButton, { backgroundColor: color }]} onPress={onPress}>
    <Text style={styles.gameTitle}>{emoji} {title}</Text>
    <Text style={styles.gameDescription}>{description}</Text>
  </TouchableOpacity>
);

export default function ActionAdrenalineGamesScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Action / Adrenaline</Text>
      </View>
      <View style={styles.grid}>
        {games.map((game) => (
          <GameItem key={game.title} {...game} onPress={() => router.push(game.path)} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#277da1',
    padding: 20,
    paddingTop: 50, // Added padding top to avoid overlap with status bar
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
