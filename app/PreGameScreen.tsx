import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

export default function PreGameScreen() {
  const router = useRouter();
  const [numPlayers, setNumPlayers] = useState(2);
  const [showRules, setShowRules] = useState(false);
  const [showPackSelector, setShowPackSelector] = useState(false);
  const [selectedPack, setSelectedPack] = useState<'pack1' | 'pack2'>('pack1');
  const [ownsPack2, setOwnsPack2] = useState(false); // Will be true if purchased from store

  return (
    <View style={{ flex: 1, backgroundColor: '#3B1A5A', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#f9c846" />
      </TouchableOpacity>

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
          onPress={() => setShowPackSelector(true)}
        >
          <Text style={[styles.setupStartButtonText, { fontSize: 20 }]}>START</Text>
        </PulsingButton>
        <TouchableOpacity style={styles.infoButton} onPress={() => setShowRules(true)}>
          <Text style={styles.infoButtonText}>i</Text>
        </TouchableOpacity>
      </View>

      <RulesModal
        visible={showRules}
        onClose={() => setShowRules(false)}
        title="How to Play"
        accentColor="#3B1A5A"
      >
        <RuleSection title="🎯 Objective">
          Spin and complete crazy challenges!
        </RuleSection>
        <RuleSection title="🎰 How It Works">
          • Press the button to spin{'\n'}• The wheel picks a random challenge{'\n'}• Complete the challenge shown{'\n'}• Tap to dismiss and spin again!
        </RuleSection>
        <RuleSection title="💡 Tips">
          Be brave! Some challenges are extreme!
        </RuleSection>
      </RulesModal>

      {/* Pack Selection Modal */}
      <Modal visible={showPackSelector} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { padding: 25 }]}>
            <Text style={[styles.modalTitle, { fontSize: 24, marginBottom: 20, textAlign: 'center' }]}>Choose Challenge Pack</Text>

            <TouchableOpacity
              style={[styles.packOption, selectedPack === 'pack1' && styles.packOptionSelected]}
              onPress={() => setSelectedPack('pack1')}
            >
              <Text style={styles.packTitle}>🎰 Original Pack</Text>
              <Text style={styles.packDesc}>15 classic extreme challenges</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.packOption, selectedPack === 'pack2' && styles.packOptionSelected, !ownsPack2 && { opacity: 0.6 }]}
              onPress={() => {
                if (ownsPack2) {
                  setSelectedPack('pack2');
                } else {
                  Alert.alert(
                    '🔒 Pack 2 Locked',
                    'Purchase Extreme Roulette Pack 2 from the Store to unlock!',
                    [{ text: 'OK' }]
                  );
                }
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.packTitle}>🔥 Pack 2</Text>
                  <Text style={styles.packDesc}>15 NEW extreme challenges</Text>
                </View>
                {!ownsPack2 && <Text style={{ fontSize: 24 }}>🔒</Text>}
              </View>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.modalButton, { flex: 1, backgroundColor: '#999' }]}
                onPress={() => setShowPackSelector(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { flex: 1 }]}
                onPress={() => {
                  setShowPackSelector(false);
                  const route = selectedPack === 'pack1' ? '/extreme-challenge-roulette' : '/extreme-roulette-pack2';
                  router.push(route);
                }}
              >
                <Text style={styles.modalButtonText}>Play</Text>
              </TouchableOpacity>
            </View>
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
  packOption: {
    backgroundColor: 'rgba(59, 26, 90, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  packOptionSelected: {
    borderColor: '#E74C3C',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  packTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B1A5A',
    marginBottom: 5,
  },
  packDesc: {
    fontSize: 14,
    color: '#666',
  },
  modalButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
