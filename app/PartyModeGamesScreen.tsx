import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CategoryCard } from '@/components/CategoryCard';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { title: 'Action / Adrenaline', subtitle: 'Move fast or lose!', icon: '⚡️', color: '#ff4d4d', route: 'ActionAdrenalineGamesScreen' },
  { title: 'Humor / Creativity', subtitle: 'Laugh, draw, and act!', icon: '😂', color: '#ffc107', route: 'HumorCreativityGamesScreen' },
  { title: 'Word / Mental', subtitle: 'Quick wits win!', icon: '💡', color: '#ffeb3b', route: 'WordMentalGamesScreen' },
  { title: 'Quick Competition', subtitle: 'Fast duels, instant fun.', icon: '🏁', color: '#4caf50', route: 'QuickCompetitionGamesScreen' },
  { title: 'Social / Truth', subtitle: 'Talk, reveal, and connect.', icon: '💬', color: '#2196f3', route: 'SocialTruthGamesScreen' },
  { title: 'Spicy / 18+ / Alcohol', subtitle: 'Play wild (adults only)!', icon: '🔥', color: '#9c27b0', route: 'SpicyGamesScreen' },
];

const specials = {
  title: 'Specials (Weekly / Festive)',
  subtitle: 'Limited-time party themes.',
  icon: '🎁',
  color: '#ff9800',
};

export default function PartyModeGamesScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
                onPress={() => category.route && navigation.navigate(category.route)}
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
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  fullWidth: {
    width: '100%',
    marginTop: 12,
  },
});
