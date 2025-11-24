import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal } from "react-native";

export default function MicMadnessScreen() {
  const micMadnessCards = [
    require('../assets/images/mic madness/water.png'),
    require('../assets/images/mic madness/story.png'),
    require('../assets/images/mic madness/shoe.png'),
    require('../assets/images/mic madness/road.png'),
    require('../assets/images/mic madness/phone.png'),
    require('../assets/images/mic madness/party.png'),
    require('../assets/images/mic madness/night.png'),
    require('../assets/images/mic madness/love.png'),
    require('../assets/images/mic madness/life.png'),
    require('../assets/images/mic madness/heart.png'),
    require('../assets/images/mic madness/friend.png'),
    require('../assets/images/mic madness/fish.png'),
    require('../assets/images/mic madness/fire.png'),
    require('../assets/images/mic madness/feel.png'),
    require('../assets/images/mic madness/eyes.png'),
    require('../assets/images/mic madness/Drink.png'),
    require('../assets/images/mic madness/dog.png'),
    require('../assets/images/mic madness/dance.png'),
    require('../assets/images/mic madness/coffee.png'),
    require('../assets/images/mic madness/car.png'),
  ];
  const [showCountdown, setShowCountdown] = React.useState(false);
  const [countdown, setCountdown] = React.useState(5);
  const [showSingButton, setShowSingButton] = React.useState(true);
  const [showFaceDownCard, setShowFaceDownCard] = React.useState(true);
  const [showAnimation, setShowAnimation] = React.useState(true);
  const [showWordCard, setShowWordCard] = React.useState(false);
  const [wordCardIdx, setWordCardIdx] = React.useState(null);

  const { push } = require('expo-router').useRouter();
  const handleSingPress = () => {
    setShowCountdown(true);
    setShowSingButton(false);
    setShowFaceDownCard(true);
    setShowAnimation(true);
    setCountdown(5);
    let current = 5;
    const interval = setInterval(() => {
      current -= 1;
      setCountdown(current);
      if (current === 0) {
        clearInterval(interval);
        setShowCountdown(false);
        setShowFaceDownCard(false);
        setShowAnimation(false);
        // Navigate to card reveal screen
        const idx = Math.floor(Math.random() * micMadnessCards.length);
        push({ pathname: '/mic-madness-card-reveal', params: { cardIdx: idx } });
      }
    }, 1000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Countdown Modal for guaranteed visibility */}
      <Modal visible={showCountdown} transparent animationType="fade">
        <View style={[styles.countdownModalBackdrop, { borderWidth: 4, borderColor: 'red' }]}> 
          <View style={styles.countdownContainerSmall}>
            <Text style={styles.countdownTextSmall}>{countdown}</Text>
            <Text style={{ color: 'red', fontSize: 18, marginTop: 8 }}>DEBUG: Modal is rendering</Text>
          </View>
        </View>
      </Modal>
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
  singButton: {
    backgroundColor: '#C86A2A',
    borderRadius: 30,
    paddingHorizontal: 80,
    paddingVertical: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#C86A2A',
    width: 320,
  },
  singButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,
    letterSpacing: 1,
  },
  countdownModalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  countdownContainerSmall: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  countdownTextSmall: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#C86A2A',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderWidth: 4,
    borderColor: '#C86A2A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
    overflow: 'hidden',
  },
  faceDownCardContainer: {
    width: 120,
    height: 180,
    backgroundColor: '#C86A2A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  animationContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#3576A8',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
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
