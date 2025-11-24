import React from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";

export default function MicMadnessGameStartScreen() {
  return (
    <View style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.text}>Mic Madness Game Started!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17,77,45,0.5)', // semi-transparent overlay for text readability
  },
  text: {
    fontSize: 32,
    color: "#FFE0B2",
    fontWeight: "bold",
  },
});
