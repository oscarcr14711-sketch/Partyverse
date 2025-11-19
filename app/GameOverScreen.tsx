import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const GameOverScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { player1Score = 0, player2Score = 0 } = route.params || {};
  const handleContinue = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.gameOverContainer}>
      <Text style={styles.gameOverTitleParty}>GAME OVER</Text>
      <Image source={require('../assets/images/BluffGameover.png')} style={styles.gameOverLogo} resizeMode="contain" />
      <View style={styles.gameOverScoresRow}>
        <View style={styles.gameOverPlayerCol}>
          <Image source={require('../assets/images/Truth or bluff images/Truthhappy.png')} style={styles.gameOverAvatar} />
          <Text style={styles.gameOverPlayerLabel}>PLAYER 1</Text>
          <Text style={styles.gameOverScore}>{player1Score}</Text>
          <Text style={styles.gameOverCorrect}>CORRECT</Text>
        </View>
        <View style={styles.gameOverPlayerCol}>
          <Image source={require('../assets/images/Truth or bluff images/Truthsad.png')} style={styles.gameOverAvatar} />
          <Text style={styles.gameOverPlayerLabel}>PLAYER 2</Text>
          <Text style={styles.gameOverScore}>{player2Score}</Text>
          <Text style={styles.gameOverCorrect}>CORRECT</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.gameOverContinueButton} onPress={handleContinue}>
        <Text style={styles.gameOverContinueTextParty}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    gameOverTitleParty: {
      fontSize: 54,
      fontWeight: 'bold',
      color: '#ff006e',
      marginBottom: 16,
      letterSpacing: 3,
      textAlign: 'center',
      textShadowColor: '#fff200',
      textShadowOffset: { width: 3, height: 3 },
      textShadowRadius: 8,
      fontStyle: 'italic',
      // If you have a party font, e.g. 'LuckiestGuy-Regular', add: fontFamily: 'LuckiestGuy-Regular',
    },
    gameOverContinueTextParty: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#ffbe0b',
      letterSpacing: 3,
      textShadowColor: '#3a86ff',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 6,
      fontStyle: 'italic',
      // If you have a party font, e.g. 'LuckiestGuy-Regular', add: fontFamily: 'LuckiestGuy-Regular',
    },
  gameOverContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a78bfa',
    paddingTop: 48,
  },
  gameOverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3d348b',
    marginBottom: 16,
    letterSpacing: 2,
    textAlign: 'center',
  },
  gameOverLogo: {
    width: 260,
    height: 80,
    marginBottom: 24,
  },
  gameOverScoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
  },
  gameOverPlayerCol: {
    alignItems: 'center',
    flex: 1,
  },
  gameOverAvatar: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  gameOverPlayerLabel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffbe0b',
    marginBottom: 8,
    letterSpacing: 2,
    textShadowColor: '#ff006e',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontStyle: 'italic',
    // If you have a party font, e.g. 'LuckiestGuy-Regular', add: fontFamily: 'LuckiestGuy-Regular',
  },
  gameOverScore: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#3d348b',
    marginBottom: 4,
  },
  gameOverCorrect: {
    fontSize: 24,
    color: '#43ff64',
    marginBottom: 8,
    letterSpacing: 2,
    textShadowColor: '#3a86ff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontWeight: 'bold',
    fontStyle: 'italic',
    // If you have a party font, e.g. 'LuckiestGuy-Regular', add: fontFamily: 'LuckiestGuy-Regular',
  },
  gameOverContinueButton: {
    width: 320,
    height: 62,
    borderRadius: 32,
    backgroundColor: '#3d348b',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gameOverContinueText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
});

export default GameOverScreen;
