import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

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
