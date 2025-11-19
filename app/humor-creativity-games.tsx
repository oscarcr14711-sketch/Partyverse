import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import JoyLaughIcon from '../components/JoyLaughIcon';

const games = [
  { 
    title: 'Truth or Bluff', 
    description: '', 
    emoji: '🤥', 
    color: '#ff4f81', // Vibrant pink
    path: '/truth-or-bluff' 
  },
  { 
    title: 'If you Laugh you lose', 
    description: '', 
    emoji: '😆', 
    color: '#36c9c6', // Vibrant teal
    path: '/if-you-laugh-you-lose' 
  },
  { 
    title: 'Extreme Challenge Roulette', 
    description: '', 
    emoji: '🎡', 
    color: '#f9c846', // Vibrant yellow
    path: '/extreme-challenge-roulette' 
  },
  { 
    title: 'Lip Sync Chaos', 
    description: '', 
    emoji: '🎧', 
    color: '#5f6bff', // Vibrant blue
    path: '/lip-sync-chaos' 
  },
  { 
    title: 'Mic Madness', 
    description: '', 
    emoji: '🎤', 
    color: '#7dff6a', // Vibrant green
    path: '/mic-madness' 
  },
];

// Color helpers to create light/dark shades for the 3D pill effect
const clamp = (v) => Math.max(0, Math.min(255, v));
const hexToRgb = (hex) => {
  const full = hex.replace('#', '');
  const h = full.length === 3 ? full.split('').map((c) => c + c).join('') : full;
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};
const rgbToHex = (r, g, b) =>
  '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
const lighten = (hex, amt = 0.2) => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    clamp(Math.round(r + (255 - r) * amt)),
    clamp(Math.round(g + (255 - g) * amt)),
    clamp(Math.round(b + (255 - b) * amt))
  );
};
const darken = (hex, amt = 0.2) => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    clamp(Math.round(r * (1 - amt))),
    clamp(Math.round(g * (1 - amt))),
    clamp(Math.round(b * (1 - amt)))
  );
};

const GameItem = ({ title, description, emoji, color, onPress }) => {
  const top = lighten(color, 0.30);
  const bottom = darken(color, 0.30);
  const ringLight = lighten(color, 0.45);
  const ringDark = darken(color, 0.45);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
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

          {color === '#f9c74f' ? (
            <JoyLaughIcon />
          ) : (
            <Text style={styles.gameEmoji}>{emoji}</Text>
          )}
          <View style={styles.gameTextContainer}>
            <Text style={styles.gameTitle}>{title}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#E8E8E8" />
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function HumorCreativityGamesScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={require('../assets/images/HumorBg.png')} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.partyHeader}>Humor / Creativity</Text>
          </View>
          <View style={styles.grid}>
            {games.map((game) => (
              <GameItem key={game.title} {...game} onPress={() => router.push(game.path)} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  partyHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffbe0b',
    marginBottom: 8,
    letterSpacing: 2,
    textShadowColor: '#ff006e',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  gameButtonOuter: {
    borderRadius: 40,
    padding: 4,
    marginBottom: 40,
    marginHorizontal: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 14,
  },
  grid: {
    marginTop: 150, // Lower the buttons so the first button is farther from the header
    marginBottom: 12,
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
