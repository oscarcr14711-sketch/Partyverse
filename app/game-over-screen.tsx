import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HARDCORE_CHALLENGES = [
  { emoji: '🔥', challenge: 'Do 50 burpees right now!', description: 'No breaks allowed' },
  { emoji: '🧊', challenge: 'Ice bucket challenge!', description: 'Dump cold water over your head' },
  { emoji: '📱', challenge: 'Post an embarrassing selfie on your social media!', description: 'Keep it up for 24 hours' },
  { emoji: '🍋', challenge: 'Eat a whole lemon without making a face!', description: 'Peel and all!' },
  { emoji: '💃', challenge: 'Dance in public for 2 minutes!', description: 'The group picks the music' },
  { emoji: '📞', challenge: 'Call your ex and tell them you miss them!', description: 'Speaker phone required' },
  { emoji: '🎤', challenge: 'Sing a love song to a stranger!', description: 'Full commitment required' },
  { emoji: '🥵', challenge: 'Eat the spiciest thing available!', description: 'No water for 5 minutes after' },
  { emoji: '🙃', challenge: 'Let the group post anything on your social media!', description: 'You cant delete for 24h' },
  { emoji: '👗', challenge: 'Wear your clothes inside out for the rest of the night!', description: 'Own it!' },
  { emoji: '🐔', challenge: 'Do the chicken dance in public for 1 minute!', description: 'Full sound effects required' },
  { emoji: '💋', challenge: 'Kiss the floor right now!', description: 'A good peck!' },
  { emoji: '🗣️', challenge: 'Text your crush something embarrassing!', description: 'Group writes the message' },
  { emoji: '🎭', challenge: 'Act like a baby for 5 minutes!', description: 'Complete with crying and crawling' },
  { emoji: '🧎', challenge: 'Do wall sits until you collapse!', description: 'No giving up early' },
];

export default function GameOverScreen() {
  const [showModal, setShowModal] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(HARDCORE_CHALLENGES[0]);

  const showRandomChallenge = () => {
    const randomIndex = Math.floor(Math.random() * HARDCORE_CHALLENGES.length);
    setCurrentChallenge(HARDCORE_CHALLENGES[randomIndex]);
    setShowModal(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#6C3FA7', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
      <Text style={styles.title3d}>
        DID YOU COMPLETE ALL CHALLENGES OR WERE YOU{"\n"}
        TOO SCARED FOR SOME OF THEM?
      </Text>
      <Image source={require('../assets/images/ecgo.png')} style={{ width: 650, height: 400, marginTop: 0, marginBottom: 0 }} resizeMode="contain" />
      <Text style={styles.subtitle3d}>
        WHOEVER DID THE LEAST CHALLENGES HAS TO TAKE ON{"\n"}
        THE REAL CHALLENGE...
      </Text>
      <TouchableOpacity style={styles.button3d} onPress={showRandomChallenge}>
        <Text style={styles.buttonText3d}>HARDCORE CHALLENGE</Text>
      </TouchableOpacity>

      {/* Hardcore Challenge Modal */}
      <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🔥 HARDCORE CHALLENGE 🔥</Text>
            </View>

            <View style={styles.challengeContainer}>
              <Text style={styles.challengeEmoji}>{currentChallenge.emoji}</Text>
              <Text style={styles.challengeText}>{currentChallenge.challenge}</Text>
              <Text style={styles.challengeDescription}>{currentChallenge.description}</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.rerollButton} onPress={showRandomChallenge}>
                <Text style={styles.rerollText}>🎲 REROLL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton} onPress={() => setShowModal(false)}>
                <Text style={styles.acceptText}>✅ ACCEPT</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  title3d: {
    color: '#fff200',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 70,
    marginBottom: 24,
    letterSpacing: 2,
    textShadowColor: '#3A2563',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 8,
    fontFamily: 'LuckiestGuy-Regular',
    elevation: 10,
  },
  subtitle3d: {
    color: '#ff006e',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 2,
    textShadowColor: '#fff200',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    fontFamily: 'LuckiestGuy-Regular',
    elevation: 8,
  },
  button3d: {
    backgroundColor: '#F47A1F',
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#fff200',
    marginBottom: 4,
  },
  buttonText3d: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 3,
    textShadowColor: '#3A2563',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    fontFamily: 'LuckiestGuy-Regular',
    elevation: 10,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 25,
    width: '100%',
    maxWidth: 400,
    borderWidth: 4,
    borderColor: '#ff006e',
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: '#ff006e',
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  challengeContainer: {
    padding: 30,
    alignItems: 'center',
  },
  challengeEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  challengeText: {
    color: '#fff200',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 32,
  },
  challengeDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  rerollButton: {
    flex: 1,
    backgroundColor: '#6C3FA7',
    paddingVertical: 16,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff200',
  },
  rerollText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    paddingVertical: 16,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  acceptText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

