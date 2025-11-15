
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Asset } from 'expo-asset';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const games = [
  { title: 'Hot Bomb', description: 'Pass the bomb before it explodes!', emoji: '💣', color: '#f94144', path: '/hot-bomb-game' },
  { title: 'Dance Copy', description: 'Mimic the dance moves shown on screen. Others judge', emoji: '💃', color: '#f8961e', path: '/dance-copy' },
  { title: 'SpinFreeze', description: 'Music plays; when it stops, freeze.', emoji: '🥶', color: '#f9c74f', path: '/spin-freeze' },
  { title: 'Selfie Challenge', description: 'Take a selfie in 3 sec showing a prompted emotion', emoji: '🤳', color: '#90be6d', path: '/selfie-challenge' },
  { title: 'Blown Away', description: 'Players blow into the phone mic and whoever blows the bigger balloon without popping it, wins', emoji: '🎈', color: '#43aa8b', path: '/blown-away' },
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

          <Text style={styles.gameEmoji}>{emoji}</Text>
          <View style={styles.gameTextContainer}>
            <Text style={styles.gameTitle}>{title}</Text>
            <Text style={styles.gameDescription}>{description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#E8E8E8" />
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function ActionAdrenalineGamesScreen() {
  const router = useRouter();

  // Preload Hot Bomb assets to reduce perceived load time when navigating
  useEffect(() => {
    const assets = [
      require('../assets/images/Hotbombtitle.png'),
      require('../assets/images/Boom.png'),
      require('../assets/images/bomb1.png'),
      require('../assets/images/citydestroyed.jpeg'),
      require('../assets/images/avatars/avatar1.png'),
      require('../assets/images/avatars/avatar2.png'),
      require('../assets/images/avatars/avatar3.png'),
      require('../assets/images/avatars/avatar4.png'),
      require('../assets/images/avatars/avatar5.png'),
      require('../assets/images/avatars/avatar6.png'),
    ];
    Asset.loadAsync(assets).catch(() => {});
  }, []);

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
