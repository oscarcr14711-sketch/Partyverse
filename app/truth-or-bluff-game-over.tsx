
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TruthOrBluffGameOverScreen() {
  const { player1Score = 0, player2Score = 0 } = useLocalSearchParams();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GAME OVER</Text>
      <Image source={require('../assets/images/BluffGameover.png')} style={styles.logo} resizeMode="contain" />
      <View style={styles.playersRow}>
        <View style={styles.playerCol}>
          <Image source={require('../assets/images/Truth or bluff images/Truthhappy.png')} style={styles.avatar} resizeMode="contain" />
          <Text style={styles.playerLabel}>PLAYER 1</Text>
          <Text style={styles.playerScore}>{player1Score}</Text>
          <Text style={styles.playerCorrect}>CORRECT</Text>
        </View>
        <View style={styles.playerCol}>
          <Image source={require('../assets/images/Truth or bluff images/Truthsad.png')} style={styles.avatar} resizeMode="contain" />
          <Text style={styles.playerLabel}>PLAYER 2</Text>
          <Text style={styles.playerScore}>{player2Score}</Text>
          <Text style={styles.playerCorrect}>CORRECT</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/truth-or-bluff')}> 
        <Text style={styles.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d1c4e9',
    alignItems: 'center',
    paddingTop: 48,
  },
  title: {
    color: '#3d348b',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 2,
  },
  logo: {
    width: 340,
    height: 100,
    marginBottom: 24,
  },
  playersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 32,
    gap: 32,
  },
  playerCol: {
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  playerLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 1,
  },
  playerScore: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    letterSpacing: 2,
  },
  playerCorrect: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    letterSpacing: 1,
  },
  button: {
    backgroundColor: '#3d348b',
    borderRadius: 32,
    paddingVertical: 18,
    paddingHorizontal: 64,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
});
