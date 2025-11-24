import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

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

export default function MicMadnessCardRevealScreen() {
  const router = useRouter();
  const { cardIdx } = useLocalSearchParams();
  let idx = 0;
  if (typeof cardIdx === 'string') {
    idx = parseInt(cardIdx, 10);
  } else if (Array.isArray(cardIdx) && cardIdx.length > 0) {
    idx = parseInt(cardIdx[0], 10);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      router.back(); // Or navigate to next step
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image source={micMadnessCards[idx]} style={styles.cardImage} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: 260,
    height: 260,
  },
});
