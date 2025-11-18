import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TruthOrBluffGameScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Truth or Bluff</Text>
      {/* Add your game logic and UI here */}
      <View style={styles.cardContainer}>
        <Text style={styles.cardText}>Is this statement true or a bluff?</Text>
      </View>
      {/* Add buttons, timer, and other game elements as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6d8f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6c5ce7',
    marginBottom: 32,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  cardText: {
    fontSize: 24,
    color: '#232b32',
    textAlign: 'center',
  },
});

export default TruthOrBluffGameScreen;
