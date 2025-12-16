import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function MicMadnessScreen() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to pre-game screen
    router.replace('/mic-madness-pre-game');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#114D2D', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#FFE0B2" />
    </View>
  );
}
