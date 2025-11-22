import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Adjust the path if needed
const micMadnessImage = require("../assets/images/micmadness.png");

export default function MicMadnessPreGame() {
  const navigation = useNavigation();
  const [numPlayers, setNumPlayers] = useState(3);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/mictitle.png')} style={styles.titleImage} resizeMode="contain" />
      <Image source={micMadnessImage} style={styles.image} resizeMode="contain" />
      {/* Player counter styled like Truth or Bluff */}
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
        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate("MicMadnessGame")}>  
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    titleImage: {
      width: '80%',
      height: 60,
      marginBottom: 16,
      marginTop: 32,
      alignSelf: 'center',
    },
  container: {
    flex: 1,
    backgroundColor: "#C86A2A", // matches mockup
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFF3E2",
    marginBottom: 16,
    marginTop: 32,
    letterSpacing: 2,
  },
  image: {
    width: "100%",
    height: 420,
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 48,
  },
  chooseButton: {
    backgroundColor: '#FFE0B2',
    borderRadius: 30,
    paddingHorizontal: 80,
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#D4A574',
    alignItems: 'center',
  },
  chooseButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#263238',
    letterSpacing: 1,
    ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
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
    backgroundColor: '#C86A2A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
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
});
