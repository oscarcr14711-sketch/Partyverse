import { CategoryCard } from '@/components/CategoryCard';
import { BackButton } from '@/components/BackButton';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isCategoryLocked } from '../utils/devMode';
import { playSound } from '../utils/SoundManager';
import { useTheme } from '../utils/ThemeContext';

const categories = [
  { title: 'Action / Adrenaline', subtitle: 'Move fast or lose!', icon: '⚡️', color: '#ff4d4d', path: '/action-adrenaline-games', id: 'action-adrenaline' },
  { title: 'Humor / Creativity', subtitle: 'Laugh, draw, and act!', icon: '😂', color: '#ffc107', path: '/humor-creativity-games', id: 'humor-creativity' },
  { title: 'Word / Mental', subtitle: 'Quick wits win!', icon: '💡', color: '#1DE9B6', path: '/word-mental-games', id: 'word-mental' },
  { title: 'Quick Competition', subtitle: 'Fast duels, instant fun.', icon: '🏁', color: '#4caf50', path: '/quick-competition-games', id: 'quick-competition' },
  { title: 'Social / Truth', subtitle: 'Talk, reveal, and connect.', icon: '💬', color: '#4169E1', path: '/social-truth-games', id: 'social-truth' },
  { title: 'Spicy / 18+ / Alcohol', subtitle: 'Play wild (adults only)!', icon: '🔥', color: '#9c27b0', path: '/spicy-games', id: 'spicy' },
];

const specials = {
  title: 'Specials (Weekly / Festive',
  subtitle: 'Limited-time party themes.',
  icon: '🎁',
  color: '#ff9800',
  id: 'specials',
};

export default function PartyModeGamesScreen() {
  const router = useRouter();
  const { theme, themeId } = useTheme();

  const isChristmasTheme = themeId === 'christmas';

  const screenContent = (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Party Mode</Text>
        <View style={styles.spacer} />
      </View>
      <ScrollView>
        <Text style={styles.title}>What kind of fun are you in the mood for?</Text>
        <View style={styles.grid}>
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              {...category}
              locked={isCategoryLocked(category.id)}
              onPress={() => { playSound('ui.buttonClick'); if (category.path) router.push(category.path as any); }}
            />
          ))}
        </View>
        <View style={styles.fullWidth}>
          <CategoryCard {...specials} locked={isCategoryLocked(specials.id)} onPress={() => { }} />
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
        {/* Snow animation covers entire screen - stacked top, middle, bottom */}
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
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
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  fullWidth: {
    marginTop: 10,
  },
});
