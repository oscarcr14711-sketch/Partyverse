import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { CategoryCard } from '@/components/CategoryCard';
import { useRouter } from 'expo-router'; // Import useRouter
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = [
  { title: 'Action / Adrenaline', subtitle: 'Move fast or lose!', icon: '⚡️', color: '#ff4d4d', path: '/action-adrenaline-games' },
  { title: 'Humor / Creativity', subtitle: 'Laugh, draw, and act!', icon: '😂', color: '#ffc107', path: '/humor-creativity-games' },
  { title: 'Word / Mental', subtitle: 'Quick wits win!', icon: '💡', color: '#ffeb3b', path: '/word-mental-games' },
  { title: 'Quick Competition', subtitle: 'Fast duels, instant fun.', icon: '🏁', color: '#4caf50', path: '/quick-competition-games' },
  { title: 'Social / Truth', subtitle: 'Talk, reveal, and connect.', icon: '💬', color: '#2196f3', path: '/social-truth-games' },
  { title: 'Spicy / 18+ / Alcohol', subtitle: 'Play wild (adults only)!', icon: '🔥', color: '#9c27b0' },
];

const specials = {
  title: 'Specials (Weekly / Festive',
  subtitle: 'Limited-time party themes.',
  icon: '🎁',
  color: '#ff9800',
};

export default function PartyModeGamesScreen() {
  const router = useRouter(); // Initialize router

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>What kind of fun are you in the mood for?</Text>
          <View style={styles.grid}>
            {categories.map((category) => (
              <CategoryCard 
                key={category.title} 
                {...category} 
                onPress={() => category.path && router.push(category.path)} // Navigate on press
              />
            ))}
          </View>
          <View style={styles.fullWidth}>
            <CategoryCard {...specials} onPress={() => {}} />
          </View>
        </ScrollView>
      </SafeAreaView>
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
    padding: 20,
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
