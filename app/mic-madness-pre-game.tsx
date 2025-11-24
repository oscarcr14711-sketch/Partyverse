import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Adjust the path if needed
const micMadnessImage = require("../assets/images/micmadness.png");

export default function MicMadnessPreGame() {
  const router = useRouter();
  // Start with 3 players and show 3 avatars
  const [numPlayers, setNumPlayers] = useState(3);
  const avatarImages = [
    require('../assets/images/avatars/avatar1.png'),
    require('../assets/images/avatars/avatar2.png'),
    require('../assets/images/avatars/avatar3.png'),
    require('../assets/images/avatars/avatar4.png'),
    require('../assets/images/avatars/avatar5.png'),
    require('../assets/images/avatars/avatar6.png'),
  ];

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/mictitle.png')} style={styles.titleImage} resizeMode="contain" />
      <Image source={micMadnessImage} style={styles.image} resizeMode="contain" />
      {/* Avatars above player count */}
      <View style={styles.avatarsRow}>
        {[...Array(numPlayers)].map((_, i) => (
          <Image
            key={i}
            source={avatarImages[i % avatarImages.length]}
            style={styles.avatar}
          />
        ))}
      </View>
      <View style={styles.playerCountPill}>
        <TouchableOpacity
          style={styles.playerCountCircle}
          onPress={() => setNumPlayers(Math.max(2, numPlayers - 1))}
        >
          <Text style={styles.playerCountCircleText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.playerCountText}>{numPlayers} Players</Text>
        <TouchableOpacity
          style={styles.playerCountCircle}
          onPress={() => setNumPlayers(Math.min(6, numPlayers + 1))}
        >
          <Text style={styles.playerCountCircleText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={() => router.push({ pathname: "/mic-madness-game", params: { numPlayers } })}>  
          <Text style={styles.startButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#114D2D", // dark green
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  titleImage: {
    width: 200,
    height: 200,
    marginBottom: 0,
    marginTop: 0,
    alignSelf: 'center',
  },
  image: {
    width: 400,
    height: 400,
    marginBottom: 0,
    marginTop: 0,
    alignSelf: 'center',
  },
  avatarsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#263238',
  },
  playerCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#263238',
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginVertical: 16,
    width: 320,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  playerCountCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#114D2D', // match dark green background
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#1a2e1a',
  },
  playerCountCircleText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFE0B2',
    textAlign: 'center',
    ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
  },
  playerCountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFE0B2',
    textAlign: 'center',
    minWidth: 120,
    ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
  },
  buttonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#263238',
    borderRadius: 30,
    paddingHorizontal: 80,
    paddingVertical: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#1a1f23',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFE0B2',
    letterSpacing: 1,
    ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
  },
});
