import { CategoryCard } from '@/components/CategoryCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isCategoryLocked } from '../utils/devMode';

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

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Party Mode</Text>
          <View style={{ width: 26 }} />
        </View>
        <ScrollView>
          <Text style={styles.title}>What kind of fun are you in the mood for?</Text>
          <View style={styles.grid}>
            {categories.map((category) => (
              <CategoryCard
                key={category.title}
                {...category}
                locked={isCategoryLocked(category.id)}
                onPress={() => category.path && router.push(category.path as any)}
              />
            ))}
          </View>
          <View style={styles.fullWidth}>
            <CategoryCard {...specials} locked={isCategoryLocked(specials.id)} onPress={() => { }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View >
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#00a8ff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
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
