import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../components/BackButton';
import { PulsingButton } from '../components/PulsingButton';
import { useLanguage } from '../utils/LanguageContext';
import { playSound } from '../utils/SoundManager';
import { useTheme } from '../utils/ThemeContext';

// Color helpers for 3D effect
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

export default function SpicyGamesScreen() {
  const router = useRouter();
  const { theme, themeId } = useTheme();
  const { t } = useLanguage();

  const games = [
    { title: 'Color Clash', description: t('games.colorClash.description'), emoji: '♥️♠️', logo: require('../assets/images/gameLogos/Colorclashlogo.png'), color: '#4169E1', path: '/pre-game/color-clash' },
    { title: 'Ride the Bus', description: t('games.rideTheBus.description'), emoji: '🚌🃏', logo: require('../assets/images/gameLogos/Ridethebuslogo.png'), color: '#2E8B57', path: '/pre-game/ride-the-bus' },
    // { title: 'Drink Domino', description: t('games.drinkDomino.description'), emoji: '🔥🍻', color: '#FF4500', path: '/drink-domino' },
    // { title: t('games.partyBoard.title'), description: t('games.partyBoard.description'), emoji: '🎲🍻', color: '#DA70D6', path: '/party-board' },
    // { title: t('games.hotCupSpin.title'), description: t('games.hotCupSpin.description'), emoji: '🥤🔄', color: '#CD5C5C', path: '/hot-cup-spin' },
  ].slice(0, 2); // Only show first 2 games as requested

  // Use Christmas background if theme has it, otherwise black
  const isChristmas = themeId === 'christmas';
  const christmasBackground = theme.categoryBackgrounds?.spicy;

  // Always use spicy.png as the logo/title
  const spicyLogo = require('../assets/images/spicy.png');

  const handleGamePress = (path: string) => {
    playSound('ui.buttonClick');
    router.push(path as any);
  };

  const renderGameButton = (game: { title: string; description: string; emoji: string; logo?: any; color: string; path: string }) => {
    const top = lighten(game.color, 0.30);
    const bottom = darken(game.color, 0.30);
    const ringLight = lighten(game.color, 0.45);
    const ringDark = darken(game.color, 0.45);

    return (
      <PulsingButton key={game.path} onPress={() => handleGamePress(game.path)}>
        <LinearGradient
          colors={[ringLight, ringDark]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={[styles.gameButtonOuter, { shadowColor: ringDark }]}
        >
          <LinearGradient
            colors={[top, bottom]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.gameButtonInner}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.22)"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.buttonInnerShadow}
            />
            {game.logo ? (
              <Image source={game.logo} style={styles.gameLogo} resizeMode="contain" />
            ) : (
              <Text style={styles.gameEmoji}>{game.emoji}</Text>
            )}
            <View style={styles.gameTextContainer}>
              <Text style={styles.gameTitle}>{game.title}</Text>
              <Text style={styles.gameDescription}>{game.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#E8E8E8" />
          </LinearGradient>
        </LinearGradient>
      </PulsingButton>
    );
  };

  const content = (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <View style={styles.header}>
        <BackButton />
        <View style={styles.spacer} />
      </View>

      <Image
        source={spicyLogo}
        style={styles.logoImage}
        resizeMode="contain"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {games.map(renderGameButton)}
      </ScrollView>
    </SafeAreaView>
  );

  // If Christmas theme with background, wrap in ImageBackground
  if (isChristmas && christmasBackground) {
    return (
      <ImageBackground
        source={christmasBackground}
        style={styles.container}
        resizeMode="cover"
      >
        {content}
      </ImageBackground>
    );
  }

  // Otherwise use black background
  return (
    <View style={styles.container}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  spacer: {
    width: 40,
  },
  logoImage: {
    width: '100%',
    height: 150,
    marginTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 10,
    gap: 12,
  },
  gameButtonOuter: {
    borderRadius: 24,
    padding: 2, // Reduced from 4
    marginBottom: 4,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  gameButtonInner: {
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingRight: 18,
    paddingLeft: 0,
    minHeight: 100,
    overflow: 'hidden',
  },
  buttonInnerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderRadius: 20,
  },
  gameEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  gameLogo: {
    width: 110,
    height: 90,
    marginRight: 8,
  },
  gameTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  gameTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  gameDescription: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 18,
  },
});
