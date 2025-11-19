import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ExtremeChallengeRouletteScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Extreme Challenge Roulette</Text>
      {/* Placeholder for future roulette image and game logic */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f72585',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: '#7209b7',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  rouletteImage: {
    width: 220,
    height: 220,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 32,
    textAlign: 'center',
  },
  spinButton: {
    backgroundColor: '#3a86ff',
    borderRadius: 32,
    paddingVertical: 18,
    paddingHorizontal: 48,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  spinButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
});

export default ExtremeChallengeRouletteScreen;
