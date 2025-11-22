import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MicMadnessGameScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mic Madness</Text>
      <Text style={styles.subtitle}>Let the voice party begin!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#C86A2A",
    marginBottom: 16,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 20,
    color: "#3576A8",
    marginTop: 8,
    textAlign: "center",
  },
});
