import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function CardClashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Card Clash</Text>
      <Text style={styles.description}>Choose the perfect card before time runs out! Outsmart, block, or steal your way to victory.</Text>
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
