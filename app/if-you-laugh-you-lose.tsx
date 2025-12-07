import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React from "react";
import { Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function IfYouLaughYouLoseScreen() {
  const router = useRouter();
  const [numPlayers, setNumPlayers] = React.useState(2);
  const [showRules, setShowRules] = React.useState(false);
  const avatarImages = [
    require('../assets/images/avatars/avatar1.png'),
    require('../assets/images/avatars/avatar2.png'),
    require('../assets/images/avatars/avatar3.png'),
    require('../assets/images/avatars/avatar4.png'),
    require('../assets/images/avatars/avatar5.png'),
    require('../assets/images/avatars/avatar6.png'),
  ];
  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/lol.png")}
        style={styles.titleImage}
        resizeMode="contain"
      />
      <Image source={require("../assets/images/laugh.png")}
        style={styles.characters}
        resizeMode="contain"
      />
      <View style={styles.playerAvatarsContainer}>
        {Array.from({ length: Math.min(numPlayers, 6) }, (_, i) => (
          <View key={i} style={styles.playerAvatar}>
            <Image
              source={avatarImages[i]}
              style={styles.playerAvatarImage}
              resizeMode="contain"
            />
          </View>
        ))}
      </View>
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
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push({
            pathname: '/if-you-laugh-game',
            params: { numPlayers: numPlayers.toString() }
          } as any)}
        >
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>
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
                <Ionicons name="close" size={24} color="#FFE0B2" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.sectionTitle}>🎯 Objective</Text>
              <Text style={styles.ruleText}>Don't laugh! The first to crack loses.</Text>
              <Text style={styles.sectionTitle}>🎮 How It Works</Text>
              <Text style={styles.ruleText}>• Players take turns trying to make others laugh{'\n'}• Use sounds, faces, challenges{'\n'}• Round 3: Camera watches for smiles!{'\n'}• Keep a straight face to win!</Text>
              <Text style={styles.sectionTitle}>🏆 Scoring</Text>
              <Text style={styles.ruleText}>Lose a point when you laugh. Last player standing wins!</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18304A',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  titleImage: {
    width: 300,
    height: 120,
    marginBottom: 20,
  },
  characters: {
    width: 340,
    height: 260,
    marginBottom: 60,
  },
  playerAvatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
    width: '100%',
  },
  playerAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#8B4C1B',
    marginHorizontal: 4,
  },
  playerAvatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  playerCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B4C1B',
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
    backgroundColor: '#FFE0B2',
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
    color: '#8B4C1B',
    textAlign: 'center',
    lineHeight: 56,
    width: '100%',
    includeFontPadding: false,
  },
  playerCountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFE0B2',
    textAlign: 'center',
    minWidth: 120,
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  startButton: {
    backgroundColor: '#FFE0B2',
    borderRadius: 30,
    paddingHorizontal: 60,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#FFE0B2',
  },
  startButtonText: {
    color: '#18304A',
    fontWeight: 'bold',
    fontSize: 24,
    letterSpacing: 1,
    fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
  },
  buttonContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 20 },
  infoButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#8B4C1B', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  infoButtonText: { fontSize: 26, fontWeight: 'bold', color: '#FFE0B2' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#18304A', borderRadius: 20, maxHeight: '65%', borderWidth: 2, borderColor: '#8B4C1B' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(139,76,27,0.3)' },
  modalTitle: { color: '#FFE0B2', fontSize: 22, fontWeight: 'bold' },
  modalScroll: { padding: 20 },
  sectionTitle: { color: '#FFE0B2', fontSize: 18, fontWeight: 'bold', marginTop: 8, marginBottom: 5 },
  ruleText: { color: '#fff', fontSize: 15, lineHeight: 21, marginBottom: 6 },
});
