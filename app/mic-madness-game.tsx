import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { PulsingButton } from "../components/PulsingButton";

export default function MicMadnessGameScreen() {
  const { numPlayers } = useLocalSearchParams();
  const router = useRouter();
  let playerCount = 3;
  if (typeof numPlayers === 'string') {
    playerCount = parseInt(numPlayers) || 3;
  } else if (Array.isArray(numPlayers) && numPlayers.length > 0) {
    playerCount = parseInt(numPlayers[0]) || 3;
  }

  const avatarImages = [
    require('../assets/images/avatars/avatar1.png'),
    require('../assets/images/avatars/avatar2.png'),
    require('../assets/images/avatars/avatar3.png'),
    require('../assets/images/avatars/avatar4.png'),
    require('../assets/images/avatars/avatar5.png'),
    require('../assets/images/avatars/avatar6.png'),
  ];
  const [names, setNames] = useState(Array(playerCount).fill(""));

  const handleNameChange = (text: string, idx: number) => {
    const updated = [...names];
    updated[idx] = text;
    setNames(updated);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Array.from({ length: playerCount }).map((_, i) => (
          <View key={i} style={styles.playerRow}>
            <Image source={avatarImages[i % avatarImages.length]} style={styles.avatar} />
            <TextInput
              style={styles.input}
              placeholder={`Player ${i + 1} Name`}
              value={names[i]}
              onChangeText={text => handleNameChange(text, i)}
              placeholderTextColor="#A0A0A0"
            />
          </View>
        ))}
      </ScrollView>
      <PulsingButton style={styles.startButton} onPress={() => router.push({ pathname: "/start", params: { playerNames: JSON.stringify(names) } })}>
        <Text style={styles.startButtonText}>START</Text>
      </PulsingButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#114D2D",
  },
  scrollContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    marginTop: 80,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    width: "80%",
    alignSelf: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#263238",
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: "#263238",
    color: "#FFE0B2",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 20,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#1a2e1a",
  },
  startButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 32,
    backgroundColor: '#263238',
    borderRadius: 30,
    paddingHorizontal: 80,
    paddingVertical: 16,
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
  },
  countdownContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  countdownText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFE0B2',
    textAlign: 'center',
  },
  firstCardContainer: {
    // Add styles for the first card if needed
    display: 'none',
  },
  animationContainer: {
    // Add styles for the animation if needed
    display: 'none',
  },
  wordCardContainer: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  wordCardImage: {
    width: 260,
    height: 260,
  },
});
