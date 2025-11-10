
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type GamePackCardProps = {
  name: string;
  games: number;
  icon: string;
  premium: boolean;
  onPress: () => void;
};

export function GamePackCard({ name, games, icon, premium, onPress }: GamePackCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView style={styles.card}>
        <ThemedText style={styles.icon}>{icon}</ThemedText>
        <ThemedText style={styles.name}>{name}</ThemedText>
        <ThemedText style={styles.games}>{games} games</ThemedText>
        {premium && <ThemedText style={styles.premium} lightColor="red" darkColor="red">🔥 Premium</ThemedText>}
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 150,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 40,
  },
  name: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  games: {
    marginTop: 5,
  },
  premium: {
    marginTop: 5,
    fontWeight: 'bold',
  }
});
