import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GameOverScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#6C3FA7', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
      <Text style={styles.title3d}>
        DID YOU COMPLETE ALL CHALLENGES OR WERE YOU{"\n"}
        TOO SCARED FOR SOME OF THEM?
      </Text>
      <Image source={require('../assets/images/ecgo.png')} style={{ width: 650, height: 400, marginTop: 0, marginBottom: 0 }} resizeMode="contain" />
      <Text style={styles.subtitle3d}>
        WHOEVER DID THE LEAST CHALLENGES HAS TO TAKE ON{"\n"}
        THE REAL CHALLENGE...
      </Text>
      <TouchableOpacity style={styles.button3d}>
        <Text style={styles.buttonText3d}>HARDCORE CHALLENGE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title3d: {
    color: '#fff200',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 70,
    marginBottom: 24,
    letterSpacing: 2,
    textShadowColor: '#3A2563',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 8,
    fontFamily: 'LuckiestGuy-Regular', // Use a bold, playful font if available
    elevation: 10,
  },
  subtitle3d: {
    color: '#ff006e',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 2,
    textShadowColor: '#fff200',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    fontFamily: 'LuckiestGuy-Regular',
    elevation: 8,
  },
  button3d: {
    backgroundColor: '#F47A1F',
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#fff200',
    marginBottom: 4,
  },
  buttonText3d: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 3,
    textShadowColor: '#3A2563',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    fontFamily: 'LuckiestGuy-Regular',
    elevation: 10,
  },
});
