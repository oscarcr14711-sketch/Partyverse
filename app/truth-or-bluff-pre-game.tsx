import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PulsingButton } from '../components/PulsingButton';
import { RuleSection, RulesModal } from '../components/RulesModal';

const avatarImages = [
  require('../assets/images/avatars/avatar1.png'),
  require('../assets/images/avatars/avatar2.png'),
  require('../assets/images/avatars/avatar3.png'),
  require('../assets/images/avatars/avatar4.png'),
  require('../assets/images/avatars/avatar5.png'),
  require('../assets/images/avatars/avatar6.png'),
];

export default function TruthOrBluffPreGameScreen() {
  const router = useRouter();
  const [numPlayers, setNumPlayers] = useState(2);
  const [showRules, setShowRules] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Players</Text>
      <View style={styles.avatarsRow}>
        {Array.from({ length: numPlayers }).map((_, i) => (
          <Image key={i} source={avatarImages[i % avatarImages.length]} style={styles.avatar} />
        ))}
      </View>
      <View style={styles.playerCountPill}>
        <PulsingButton style={styles.playerCountCircle} onPress={() => setNumPlayers(Math.max(2, numPlayers - 1))}>
          <Text style={styles.playerCountCircleText}>−</Text>
        </PulsingButton>
        <Text style={styles.playerCountText}>{numPlayers} Players</Text>
        <PulsingButton style={styles.playerCountCircle} onPress={() => setNumPlayers(Math.min(6, numPlayers + 1))}>
          <Text style={styles.playerCountCircleText}>+</Text>
        </PulsingButton>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={() => router.push({ pathname: '/truth-or-bluff-game', params: { numPlayers } })}>
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoButton} onPress={() => setShowRules(true)}>
          <Text style={styles.infoButtonText}>i</Text>
        </TouchableOpacity>
      </View>

      <RulesModal
        visible={showRules}
        onClose={() => setShowRules(false)}
        title="How to Play"
        accentColor="#6c5ce7"
      >
        <RuleSection title="🎯 Objective">
          Read statements and guess if they're TRUTH or BLUFF!
        </RuleSection>
        <RuleSection title="🎮 How It Works">
          • One player reads a statement{'\n'}
          • Others vote Truth or Bluff{'\n'}
          • Reveal the answer{'\n'}
          • Points for correct guesses!
        </RuleSection>
        <RuleSection title="🏆 Strategy">
          Keep a poker face when it's your turn to fool others!
        </RuleSection>
      </RulesModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6d8f7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3d348b',
    marginBottom: 24,
  },
  avatarsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginHorizontal: 6,
  },
  playerCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c5ce7',
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
    gap: 18,
  },
  playerCountCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6c5ce7',
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
    color: '#fff',
    textAlign: 'center',
    lineHeight: 56,
    width: '100%',
    includeFontPadding: false,
  },
  playerCountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    minWidth: 120,
  },
  startButton: {
    width: 180,
    height: 62,
    borderRadius: 30,
    backgroundColor: '#6c5ce7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#1a1f23',
    marginBottom: 8,
  },
  startButtonText: { fontSize: 24, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  buttonContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 10 },
  infoButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#6c5ce7', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  infoButtonText: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
});
