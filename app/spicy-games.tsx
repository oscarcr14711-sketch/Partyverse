import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SpicyGame = {
  title: string;
  description: string;
  emoji: string;
  path: string;
  gradient: [string, string];
  darkGradient: [string, string];
};

const games: SpicyGame[] = [
  { title: 'Drink Domino', description: 'Players drink in a chain reaction following the order of the cards (A, 2, 3… K).', emoji: '🔥🍻', path: '/drink-domino', gradient: ['#FF4500', '#DC143C'], darkGradient: ['#500000', '#A01010'] },
  { title: 'Color Clash', description: 'Guess whether the next card will be red ♥️ or black ♠️.\nIf players fail to guess the color they drink, if they get it right they choose who drinks.', emoji: '♥️♠️', path: '/color-clash', gradient: ['#4169E1', '#1E90FF'], darkGradient: ['#00003B', '#1C2E5D'] },
  { title: 'Ride The Bus', description: 'Complete 4 card predictions in a row: Color → Higher or Lower → Inside or Outside → Suit. If you fail at any step → start over and drink.', emoji: '🚌🃏', path: '/ride-the-bus', gradient: ['#2E8B57', '#3CB371'], darkGradient: ['#002000', '#005000'] },
  { title: 'PartyBoard: Roll & Cheers', description: 'Move around the board completing dares, mini–games, and drink challenges. Each victory earns you a Beer Can Token. First to collect 6 tokens wins.', emoji: '🎲🍻', path: '/party-board', gradient: ['#DA70D6', '#BA55D3'], darkGradient: ['#2B0042', '#6A006A'] },
  { title: 'Hot Cup Spin', description: 'Place shots, dares, prizes, or safe cards hidden under face–down cups. Spin the arrow. Reveal the cup it points to and do whatever it says.', emoji: '🥤🔄', path: '/hot-cup-spin', gradient: ['#CD5C5C', '#F08080'], darkGradient: ['#400000', '#902020'] }
];

const GameItem = ({ title, description, emoji, gradient, darkGradient, onPress }: {
  title: string;
  description: string;
  emoji: string;
  gradient: [string, string];
  darkGradient: [string, string];
  onPress: () => void;
}) => (
    <TouchableOpacity onPress={onPress}>
        <LinearGradient
            colors={gradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.gameButtonOuter, { shadowColor: gradient[0] }]}
        >
      <LinearGradient
        colors={[darkGradient[1], darkGradient[0]]} // Dark-to-light for the button face
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

export default function SpicyGamesScreen() {
  const router = useRouter();

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <View>
              <Text style={[styles.title, styles.cursive, styles.titleShadow]}>Spicy </Text>
              <Text style={[styles.title, styles.cursive, styles.titlePink]}>Spicy </Text>
            </View>
            <View>
              <Text style={[styles.title, styles.blocky, styles.titleBlueOutline]}>Mode 18+</Text>
              <Text style={[styles.title, styles.blocky, styles.titleBlueFill]}>Mode 18+</Text>
            </View>
          </View>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView>
          <View style={styles.grid}>
            {games.map((game) => (
              <GameItem key={game.title} {...game} onPress={() => router.push(game.path as any)} />
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
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  backButton: {},
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  title: {
    fontWeight: 'bold',
  },
  cursive: {
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'cursive',
    fontSize: 42,
  },
  blocky: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 20,
    fontWeight: '900',
  },
  titleShadow: {
    color: 'transparent',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  titlePink: {
    position: 'absolute',
    left: 0,
    top: 0,
    color: '#FFA9FF',
    textShadowColor: '#FF00FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleBlueOutline: {
    color: '#00FFFF',
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  titleBlueFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    color: '#121212',
  },
  grid: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  gameButtonOuter: {
    borderRadius: 18,
    padding: 3,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 12,
  },
  gameButtonInner: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  gameEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  gameTextContainer: {
    flex: 1,
  },
  gameTitle: {
    color: '#CCCCCC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    marginTop: 5,
  },
});