import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const games = [
  { title: 'Most Likely To…', description: 'Everyone votes who’s most likely to X.', emoji: '🤔', color: '#8e44ad', path: '/most-likely-to' },
  { title: '2 Truths, 1 Lie', description: 'Classic guessing game.', emoji: '🤥', color: '#3498db', path: '/two-truths-one-lie' },
  { title: 'Never Have I Ever (Light)', description: 'Soft, family-friendly version.', emoji: '😇', color: '#2ecc71', path: '/never-have-i-ever' },
  { title: 'Funny Confessions', description: 'Answer silly questions.', emoji: '😂', color: '#f1c40f', path: '/funny-confessions' },
  { title: 'Know your crew', description: 'The app chooses a player and draws a card with a question, current player has to answer the question to prove how much knowledge of their family and friends they have.', emoji: '💞', color: '#e74c3c', path: '/know-your-crew' },
];

const GameItem = ({ title, description, emoji, color, onPress }) => (
  <TouchableOpacity style={[styles.gameButton, { backgroundColor: color }]} onPress={onPress}>
    <Text style={styles.gameTitle}>{emoji} {title}</Text>
    <Text style={styles.gameDescription}>{description}</Text>
  </TouchableOpacity>
);

export default function SocialTruthGamesScreen() {
  const router = useRouter();

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Social / Truth</Text>
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
    backgroundColor: '#9b59b6',
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
