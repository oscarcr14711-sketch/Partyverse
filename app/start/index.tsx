import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Platform } from "react-native";
// LottieView import fixed below
import LottieView from 'lottie-react-native';

export default function StartScreen() {
  const lottieRef = useRef<LottieView>(null);
  const [countdownActive, setCountdownActive] = useState(false);

  const handleSingPress = () => {
    setCountdownActive(false);
    setTimeout(() => {
      setCountdownActive(true);
      if (lottieRef.current) {
        lottieRef.current.reset();
        lottieRef.current.play();
      }
    }, 50);
  };

    return (
      <View style={styles.background}>
        <View style={styles.overlay}>
          <LottieView
            ref={lottieRef}
            source={require("../../assets/animations/Countdown.json")}
            autoPlay={countdownActive}
            loop={false}
            style={styles.countdown}
          />
          <Image
            source={require("../../assets/images/deck1.png")}
            style={styles.deckImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.singButton}
            onPress={handleSingPress}
          >
            <Text style={styles.singButtonText}>Sing</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
}


const styles = StyleSheet.create({
    singButton: {
      backgroundColor: '#263238',
      borderRadius: 30,
      paddingHorizontal: 80,
      paddingVertical: 16,
      marginTop: 60,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 10,
      borderBottomWidth: 4,
      borderBottomColor: '#000',
      alignSelf: 'center',
    },
    singButtonText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
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
  countdown: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 16,
  },
  deckImage: {
    width: 400,
    height: 400,
    alignSelf: 'center',
  },
});
