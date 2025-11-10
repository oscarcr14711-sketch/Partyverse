import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function LastSpoonStandingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last Spoon Standing</Text>
      <Text style={styles.description}>Collect four of the same digital cards as fast as you can. When you’re ready — grab a spoon before anyone else! The last one without a spoon… is out.</Text>
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
