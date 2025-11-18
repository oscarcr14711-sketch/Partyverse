import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default function JoyLaughTransition({ onFinish }: { onFinish: () => void }) {
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    // Listen for animation finish
    const timer = setTimeout(() => {
      onFinish();
    }, 2000); // Increased duration for visibility
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <LottieView
        ref={lottieRef}
        source={require('../assets/animations/Joy Laugh Emoji.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(167,139,250,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  lottie: {
    width: Math.min(width, height) * 0.7,
    height: Math.min(width, height) * 0.7,
  },
});
