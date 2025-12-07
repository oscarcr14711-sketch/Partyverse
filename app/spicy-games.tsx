import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PulsingButton } from '../components/PulsingButton';
import { isGameLocked } from '../utils/devMode';

type SpicyGame = {
  title: string;
  emoji: string;
  path: string;
  gradient: [string, string];
  darkGradient: [string, string];
  id: string;
};

const games: SpicyGame[] = [
  { title: 'Color Clash', emoji: '♥️♠️', path: '/color-clash-pre-game', gradient: ['#4169E1', '#1E90FF'], darkGradient: ['#00003B', '#1C2E5D'], id: 'color-clash' },
  { title: 'Ride The Bus', emoji: '🚌🃏', path: '/ride-the-bus-pre-game', gradient: ['#2E8B57', '#3CB371'], darkGradient: ['#002000', '#005000'], id: 'ride-the-bus' },
  { title: 'Drink Domino', emoji: '🔥🍻', path: '/drink-domino', gradient: ['#FF4500', '#DC143C'], darkGradient: ['#500000', '#A01010'], id: 'drink-domino' },
  { title: 'PartyBoard: Roll & Cheers', emoji: '🎲🍻', path: '/party-board', gradient: ['#DA70D6', '#BA55D3'], darkGradient: ['#2B0042', '#6A006A'], id: 'party-board' },
  { title: 'Hot Cup Spin', emoji: '🥤🔄', path: '/hot-cup-spin', gradient: ['#CD5C5C', '#F08080'], darkGradient: ['#400000', '#902020'], id: 'hot-cup-spin' }
];

const GameItem = ({ title, emoji, gradient, darkGradient, onPress, locked = false }: {
  title: string;
  emoji: string;
  gradient: [string, string];
  darkGradient: [string, string];
  onPress: () => void;
  locked?: boolean;
}) => (
  <PulsingButton onPress={onPress} style={locked && styles.lockedWrapper}>
    <LinearGradient
      colors={gradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.gameButtonOuter, { shadowColor: gradient[0] }]}
    >
      {locked && <View style={styles.grayOverlay} />}
      {locked && (
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>COMING SOON</Text>
        </View>
      )}
      <LinearGradient
        colors={[darkGradient[1], darkGradient[0]]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gameButtonInner}
      >
        {locked ? (
          <Ionicons name="lock-closed" size={28} color="#fff" style={{ opacity: 0.9 }} />
        ) : (
          <Text style={styles.gameEmoji}>{emoji}</Text>
        )}
        <View style={styles.gameTextContainer}>
          <Text style={[styles.gameTitle, locked && styles.gameTitleLocked]}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={locked ? "#999999" : "#CCCCCC"} />
      </LinearGradient>
    </LinearGradient>
  </PulsingButton>
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
              <GameItem
                key={game.title}
                {...game}
                locked={isGameLocked(game.id)}
                onPress={() => router.push(game.path as any)}
              />
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
    marginTop: 150,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  gameButtonOuter: {
    borderRadius: 18,
    padding: 3,
    marginBottom: 40,
    marginHorizontal: 10,
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
  lockedWrapper: {
    opacity: 0.65,
  },
  grayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(80, 80, 80, 0.7)',
    borderRadius: 18,
    zIndex: 1,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  comingSoonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  gameTitleLocked: {
    opacity: 0.7,
  },
});
