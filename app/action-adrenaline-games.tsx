
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const games = [
  { title: 'Hot Bomb', description: 'Pass the bomb before it explodes!', emoji: '💣', color: '#f94144', path: '/hot-bomb-game' },
  { title: 'Dance Copy', description: 'Mimic the dance moves shown on screen. Others judge', emoji: '💃', color: '#f8961e', path: '/dance-copy' },
  { title: 'SpinFreeze', description: 'Music plays; when it stops, freeze.', emoji: '🥶', color: '#f9c74f', path: '/spin-freeze' },
  { title: 'Selfie Challenge', description: 'Take a selfie in 3 sec showing a prompted emotion', emoji: '🤳', color: '#90be6d', path: '/selfie-challenge' },
  { title: 'Blown Away', description: 'Players blow into the phone mic and whoever blows the bigger balloon without popping it, wins', emoji: '🎈', color: '#43aa8b', path: '/blown-away' },
];

const GameItem = ({ title, description, emoji, color, onPress }: any) => {
  // Create a lighter gradient from the bright color
  const lighterColor = color + '99'; // Add transparency for lighter effect
  
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={[color, color]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.gameButtonOuter, { shadowColor: color }]}
      >
        <LinearGradient
          colors={[color, color]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gameButtonInner}
        >
          <Text style={styles.gameEmoji}>{emoji}</Text>
          <View style={styles.gameTextContainer}>
            <Text style={styles.gameTitle}>{title}</Text>
            <Text style={styles.gameDescription}>{description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function ActionAdrenalineGamesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Action / Adrenaline</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView style={styles.grid}>
          {games.map((game) => (
            <GameItem key={game.title} {...game} onPress={() => router.push(game.path as any)} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  grid: {
    paddingHorizontal: 5,
  },
  gameButtonOuter: {
    borderRadius: 18,
    padding: 3,
    marginBottom: 15,
    marginHorizontal: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 12,
  },
  gameButtonInner: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },
  gameEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  gameTextContainer: {
    flex: 1,
  },
  gameTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gameDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
});
