import React from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';

export default function LightningIcon() {
  return (
    <View style={styles.iconContainer}>
      <LottieView
        source={require('../assets/animations/Lightning.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 32,
    height: 32,
  },
});
