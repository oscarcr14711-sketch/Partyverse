import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameStartScreen } from '../components/GameStartScreen';
import { RuleSection, RulesModal } from '../components/RulesModal';

export default function PreGameScreen() {
  const router = useRouter();
  const [numPlayers, setNumPlayers] = useState(2);
  const [showRules, setShowRules] = useState(false);
  const [showPackSelector, setShowPackSelector] = useState(false);
  const [selectedPack, setSelectedPack] = useState<'pack1' | 'pack2'>('pack1');
  const [ownsPack2, setOwnsPack2] = useState(false); // Will be true if purchased from store

  return (
    <GameStartScreen
      backgroundColor="#8B5CF6"
      accentColor="#E74C3C"
      logoImage={require('../assets/images/gameLogos/extremechallengeLogo.png')}
      minPlayers={2}
      maxPlayers={6}
      playerCount={numPlayers}
      setPlayerCount={setNumPlayers}
      onStart={() => setShowPackSelector(true)}
      onInstructions={() => setShowRules(true)}
    >
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

      {/* Side-by-side images container */}
      <View style={{
        position: 'absolute',
        top: 280,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        zIndex: 10,
      }}>
        <Image
          source={require('../assets/images/2roulette.png')}
          style={{ width: 220, height: 220 }}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/charac.png')}
          style={{ width: 220, height: 220, marginLeft: -70 }}
          resizeMode="contain"
        />
      </View>

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
    </GameStartScreen>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#f9c846', borderRadius: 20, maxHeight: '65%', borderWidth: 2, borderColor: '#FFD700' },
  modalTitle: { color: '#3B1A5A', fontSize: 22, fontWeight: 'bold' },
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
});
