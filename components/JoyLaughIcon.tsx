import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

export default function JoyLaughIcon() {
  const anim = useRef(null);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.iconContainer, {
      transform: [{ scale: scaleAnim }],
      opacity: opacityAnim,
      zIndex: 10,
    }] }>
      <LottieView
        ref={anim}
        source={require('../assets/animations/Joy Laugh Emoji.json')}
        autoPlay
        loop={false}
        style={[styles.lottie, { width: 64, height: 64 }]}
      />
    </Animated.View>
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
