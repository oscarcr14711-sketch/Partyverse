import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function PartyPollScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Party Poll</Text>
      <Text style={styles.description}>Guess the most popular answers to funny survey questions before the other team does! The faster and closer you get to the top answers, the more points you score.</Text>
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
