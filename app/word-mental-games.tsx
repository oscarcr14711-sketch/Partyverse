import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const games = [
  { title: 'Brain Buzzer', description: 'The app gives you a quick trick question. Answer fast — but think twice before you speak!', emoji: '🧩', color: '#ff6b6b', path: '/brain-buzzer' },
  { title: 'Brain vs Brain', description: 'Two players face off. The app shows a question. The first one to shout the right answer gets the point!', emoji: '⚔️', color: '#feca57', path: '/brain-vs-brain' },
  { title: 'Stop Game', description: 'Be the fastest to type, write or say words that start with a specific letter before everyone else.', emoji: '🛑', color: '#48dbfb', path: '/stop-game' },
  { title: 'Memory Rush', description: 'The app flashes a list of words for 5 seconds. Players must recall as many as possible when time runs out.', emoji: '🧠💨', color: '#ff9f43', path: '/memory-rush' },
  { title: 'Pop Culture Trivia', description: 'Questions related to Musicians, Actors, Movies or Video Games', emoji: '🎤', color: '#a29bfe', path: '/pop-culture-trivia' },
];

const GameItem = ({ title, description, emoji, color, onPress }) => (
  <TouchableOpacity style={[styles.gameButton, { backgroundColor: color }]} onPress={onPress}>
    <Text style={styles.gameTitle}>{emoji} {title}</Text>
    <Text style={styles.gameDescription}>{description}</Text>
  </TouchableOpacity>
);

export default function WordMentalGamesScreen() {
  const router = useRouter();

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Word / Mental</Text>
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
    backgroundColor: '#ffeb3b',
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
