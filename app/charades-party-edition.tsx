import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function CharadesPartyEditionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Charades (Party Edition)</Text>
      <Text style={styles.description}>One player acts out a secret word while others try to guess it before time runs out — no speaking allowed!</Text>
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
