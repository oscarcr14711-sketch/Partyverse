import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function KnowYourCrewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Know Your Crew</Text>
      <Text style={styles.description}>The app chooses a player and draws a card with a question, current player has to answer the question to prove how much knowledge of their family and friends they have.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 40,
  },
});
