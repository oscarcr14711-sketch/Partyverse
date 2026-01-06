import { Ionicons } from '@expo/vector-icons';
import { BackButton } from '@/components/BackButton';
import { CategoryCard } from '@/components/CategoryCard';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../utils/LanguageContext';
import { playSound } from '../utils/SoundManager';
import { useTheme } from '../utils/ThemeContext';

export default function PartyModeGamesScreen() {
  const router = useRouter();
  const { theme, themeId } = useTheme();
  const { t, language } = useLanguage();

  // Debug: Log current language and translation result
  console.log('Party Mode - Current language:', language);
  console.log('Party Mode - Action title translation:', t('categories.actionTitle'));

  // Only show 4 categories - hide Quick Competition, Social/Truth, and Specials
  const categories = [
    { title: t('categories.actionTitle'), subtitle: 'Move fast or lose!', icon: '⚡️', color: '#ff4d4d', path: '/action-adrenaline-games', id: 'action-adrenaline' },
    { title: t('categories.humorTitle'), subtitle: 'Laugh, draw, and act!', icon: '😂', color: '#ffc107', path: '/humor-creativity-games', id: 'humor-creativity' },
    { title: t('categories.wordMentalTitle'), subtitle: 'Quick wits win!', icon: '💡', color: '#1DE9B6', path: '/word-mental-games', id: 'word-mental' },
    { title: t('categories.spicyTitle'), subtitle: 'Play wild (adults only)!', icon: '🔥', color: '#9c27b0', path: '/spicy-games', id: 'spicy' },
  ];

  const isChristmasTheme = themeId === 'christmas';

  const screenContent = (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{t('gameMenu.partyMode.title')}</Text>
        </View>
        <Text style={styles.subtitle}>{t('gameMenu.moodQuestion')}</Text>
        <View style={styles.list}>
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              {...category}
              variant="list"
              locked={false}
              onPress={() => { playSound('ui.buttonClick'); if (category.path) router.push(category.path as any); }}
            />
          ))}
        </View>

        {/* Coming Soon Banner */}
        <View style={styles.bannerContainer}>
          <LinearGradient
            colors={['#2a1a4a', '#1a0a3a', '#0f0520']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            <View style={styles.bannerGlow} />
            <View style={styles.bannerInner}>
              <View style={styles.bannerIconRow}>
                <Text style={styles.bannerEmoji}>🎮</Text>
                <Text style={styles.bannerEmoji}>✨</Text>
                <Text style={styles.bannerEmoji}>🎁</Text>
              </View>
              <Text style={styles.bannerTitle}>NEW GAMES</Text>
              <Text style={styles.bannerSubtitle}>Coming Soon!</Text>
              <View style={styles.bannerDivider} />
              <Text style={styles.bannerDescription}>
                Special games and seasonal events{'\n'}will be available soon!
              </Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // Christmas theme: red to green gradient background with snow overlay
  if (isChristmasTheme) {
    return (
      <LinearGradient
        colors={['#c0392b', '#27ae60']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      >
        {screenContent}
        {/* Snow animation covers entire screen */}
        {theme.overlayAnimation && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'column' }} pointerEvents="none">
            <LottieView
              source={theme.overlayAnimation}
              autoPlay
              loop
              style={{ flex: 1, width: '100%' }}
            />
            <LottieView
              source={theme.overlayAnimation}
              autoPlay
              loop
              style={{ flex: 1, width: '100%' }}
            />
            <LottieView
              source={theme.overlayAnimation}
              autoPlay
              loop
              style={{ flex: 1, width: '100%' }}
            />
          </View>
        )}
      </LinearGradient>
    );
  }

  // Default background
  return (
    <View style={styles.background}>
      {screenContent}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#00a8ff',
  },
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 0,
  },
  backButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  list: {
    flexDirection: 'column',
    gap: 0,
    width: '100%',
    paddingHorizontal: 20,
  },
  // Coming Soon Banner
  bannerContainer: {
    marginTop: 25,
    marginBottom: 30,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  banner: {
    borderRadius: 24,
    padding: 4,
    position: 'relative',
  },
  bannerGlow: {
    position: 'absolute',
    top: -50,
    left: '50%',
    marginLeft: -100,
    width: 200,
    height: 100,
    backgroundColor: '#8B5CF6',
    opacity: 0.15,
    borderRadius: 100,
  },
  bannerInner: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
  },
  bannerIconRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  bannerEmoji: {
    fontSize: 36,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 3,
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  bannerSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B5CF6',
    marginTop: 5,
    letterSpacing: 1,
  },
  bannerDivider: {
    width: 80,
    height: 3,
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
    marginVertical: 15,
    opacity: 0.6,
  },
  bannerDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
