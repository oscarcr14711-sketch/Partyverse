import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PulsingButton } from '../components/PulsingButton';

const games = [
  { title: 'Brain Buzzer', description: 'The app gives you a quick trick question. Answer fast — but think twice before you speak!', emoji: '🧩', color: '#ff6b6b', path: '/brain-buzzer-pre-game' },
  { title: 'Brain vs Brain', description: 'Two players face off. The app shows a question. The first one to shout the right answer gets the point!', emoji: '⚔️', color: '#feca57', path: '/brain-vs-brain-pre-game' },
  { title: 'Stop Game', description: 'Be the fastest to type, write or say words that start with a specific letter before everyone else.', emoji: '🛑', color: '#48dbfb', path: '/stop-game-pre-game' },
  { title: 'Memory Rush', description: 'The app flashes a list of words for 5 seconds. Players must recall as many as possible when time runs out.', emoji: '🧠💨', color: '#ff9f43', path: '/memory-rush-pre-game' },
  { title: 'Pop Culture Trivia', description: 'Questions related to Musicians, Actors, Movies or Video Games', emoji: '🎤', color: '#a29bfe', path: '/pop-culture-trivia' },
];

// Color helpers to create light/dark shades for the 3D pill effect
const clamp = (v: number) => Math.max(0, Math.min(255, v));
const hexToRgb = (hex: string) => {
  const full = hex.replace('#', '');
  const h = full.length === 3 ? full.split('').map((c) => c + c).join('') : full;
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};
const rgbToHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
const lighten = (hex: string, amt = 0.2) => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    clamp(Math.round(r + (255 - r) * amt)),
    clamp(Math.round(g + (255 - g) * amt)),
    clamp(Math.round(b + (255 - b) * amt))
  );
};
const darken = (hex: string, amt = 0.2) => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    clamp(Math.round(r * (1 - amt))),
    clamp(Math.round(g * (1 - amt))),
    clamp(Math.round(b * (1 - amt)))
  );
};

const GameItem = ({ title, description, emoji, color, onPress }: any) => {
  // Boost contrast for a more colorful look
  const top = lighten(color, 0.30);
  const bottom = darken(color, 0.30);
  const ringLight = lighten(color, 0.45);
  const ringDark = darken(color, 0.45);

  return (
    <PulsingButton onPress={onPress}>
      {/* Outer ring/glow */}
      <LinearGradient
        colors={[ringLight, ringDark]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.gameButtonOuter, { shadowColor: ringDark }]}
      >
        {/* Main pill */}
        <LinearGradient
          colors={[top, bottom]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gameButtonInner}
        >
          {/* Bottom inner shadow */}
          <LinearGradient
            colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.22)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.buttonInnerShadow}
          />

          <Text style={styles.gameEmoji}>{emoji}</Text>
          <View style={styles.gameTextContainer}>
            <Text style={styles.gameTitle}>{title}</Text>
            <Text style={styles.gameDescription}>{description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#E8E8E8" />
        </LinearGradient>
      </LinearGradient>
    </PulsingButton>
  );
};

export default function WordMentalGamesScreen() {
  const router = useRouter();

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Word / Mental</Text>
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
  background: {
    flex: 1,
    backgroundColor: '#ffeb3b',
  },
  container: {
    flex: 1,
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
    borderRadius: 40,
    padding: 4,
    marginBottom: 16,
    marginHorizontal: 6,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 14,
  },
  gameButtonInner: {
    borderRadius: 36,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.35)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.25)',
  },
  buttonInnerShadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
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
