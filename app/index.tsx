import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function MainScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />
      <TouchableOpacity 
        style={[styles.button, styles.playNowButton]}
        onPress={() => router.push('/(tabs)/games')}
      >
        <Text style={styles.buttonText}>LET THE GAMES BEGIN!</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.button, styles.spicyButton]}
        onPress={() => router.push('/spicy-games')}
      >
        <Text style={styles.buttonText}>SPICY MODE 18+</Text>
      </TouchableOpacity>
      <Text style={styles.subText}>Tap to start the fun!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 50,
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  playNowButton: {
    backgroundColor: '#32CD32',
  },
  spicyButton: {
    backgroundColor: '#C70039',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subText: {
    marginTop: 20,
    fontSize: 16,
    color: 'white',
  },
});
