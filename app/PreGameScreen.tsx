import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PulsingButton } from '../components/PulsingButton';

const avatarImages = [
  require('../assets/images/avatars/avatar1.png'),
  require('../assets/images/avatars/avatar2.png'),
  require('../assets/images/avatars/avatar3.png'),
  require('../assets/images/avatars/avatar4.png'),
  require('../assets/images/avatars/avatar5.png'),
  require('../assets/images/avatars/avatar6.png'),
];

export default function PreGameScreen() {
  const router = useRouter();
  const [numPlayers, setNumPlayers] = useState(2);
  const [showRules, setShowRules] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#3B1A5A', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
      {/* Removed EXTREME CHALLENGE and ROULETTE text */}
      <View style={{ alignItems: 'center', marginTop: 60, marginBottom: 0 }}>
        <Image source={require('../assets/images/extreme.png')} style={{ width: 500, height: 140, marginBottom: -35 }} resizeMode="contain" />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
          <Image source={require('../assets/images/2roulette.png')} style={{ width: 360, height: 360, marginRight: 12 }} resizeMode="contain" />
          <Image source={require('../assets/images/charac.png')} style={{ width: 250, height: 250, marginLeft: -110 }} resizeMode="contain" />
        </View>
      </View>
      <View style={[styles.playerAvatarsContainer, { marginTop: 30 }]}>
        {Array.from({ length: Math.min(numPlayers, 6) }, (_, i) => (
          <View key={i} style={[styles.playerAvatar, { width: 60, height: 60 }]}>
            <Image
              source={avatarImages[i]}
              style={[styles.playerAvatarImage, { width: 60, height: 60 }, i === 5 && styles.playerAvatarImageAdjusted]}
              resizeMode={i === 5 ? 'cover' : 'contain'}
            />
          </View>
        ))}
      </View>
      <View style={[styles.playerCounterContainer, { paddingHorizontal: 12, paddingVertical: 10, marginTop: 18 }]}>
        <PulsingButton
          style={[styles.playerCounterButton, { width: 44, height: 44, borderRadius: 22 }]}
          onPress={() => setNumPlayers(Math.max(2, numPlayers - 1))}
        >
          <Text style={[styles.playerCounterButtonText, { fontSize: 24 }]}>−</Text>
        </PulsingButton>
        <Text style={[styles.playerCounterText, { fontSize: 20, minWidth: 90 }]}>{numPlayers} Players</Text>
        <PulsingButton
          style={[styles.playerCounterButton, { width: 44, height: 44, borderRadius: 22 }]}
          onPress={() => setNumPlayers(Math.min(6, numPlayers + 1))}
        >
          <Text style={[styles.playerCounterButtonText, { fontSize: 24 }]}>+</Text>
        </PulsingButton>
      </View>
      <View style={styles.buttonContainer}>
        <PulsingButton
          style={[styles.setupStartButton, { paddingHorizontal: 50, paddingVertical: 10, borderRadius: 22, marginTop: 18 }]}
          onPress={() => router.push('/extreme-challenge-roulette')}
        >
          <Text style={[styles.setupStartButtonText, { fontSize: 20 }]}>START</Text>
        </PulsingButton>
        <TouchableOpacity style={styles.infoButton} onPress={() => setShowRules(true)}>
          <Text style={styles.infoButtonText}>i</Text>
        </TouchableOpacity>
      </View>

      {/* Rules Modal */}
      <Modal visible={showRules} transparent animationType="slide" onRequestClose={() => setShowRules(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>How to Play</Text>
              <TouchableOpacity onPress={() => setShowRules(false)}>
                <Ionicons name="close" size={24} color="#3B1A5A" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.sectionTitle}>🎯 Objective</Text>
              <Text style={styles.ruleText}>Spin and complete crazy challenges!</Text>
              <Text style={styles.sectionTitle}>🎰 How It Works</Text>
              <Text style={styles.ruleText}>• Press the button to spin{'\n'}• The wheel picks a random challenge{'\n'}• Complete the challenge shown{'\n'}• Tap to dismiss and spin again!</Text>
              <Text style={styles.sectionTitle}>💡 Tips</Text>
              <Text style={styles.ruleText}>Be brave! Some challenges are extreme!</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  playerAvatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  playerAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    overflow: 'hidden',
  },
  playerAvatarImage: {
    width: 80,
    height: 80,
  },
  playerAvatarImageAdjusted: {
    transform: [{ scale: 1.22 }],
  },
  playerCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E74C3C',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#C0392B',
    marginBottom: 20,
  },
  playerCounterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#C0392B',
  },
  playerCounterButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  playerCounterText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFE0B2',
    minWidth: 140,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  setupStartButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 30,
    paddingHorizontal: 80,
    paddingVertical: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#C0392B',
  },
  setupStartButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  buttonContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 18 },
  infoButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E74C3C', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8, borderBottomWidth: 3, borderBottomColor: '#C0392B' },
  infoButtonText: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#f9c846', borderRadius: 20, maxHeight: '65%', borderWidth: 2, borderColor: '#FFD700' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
  modalTitle: { color: '#3B1A5A', fontSize: 22, fontWeight: 'bold' },
  modalScroll: { padding: 20 },
  sectionTitle: { color: '#3B1A5A', fontSize: 18, fontWeight: 'bold', marginTop: 8, marginBottom: 5 },
  ruleText: { color: '#333', fontSize: 15, lineHeight: 21, marginBottom: 6 },
});
