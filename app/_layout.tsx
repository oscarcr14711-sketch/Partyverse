import { Asset } from 'expo-asset';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { InteractionManager } from 'react-native';

// Centralized asset list for eager preloading (Hot Bomb + commonly used)
const PRELOAD_ASSETS = [
  require('../assets/images/Hotbombtitle.png'),
  require('../assets/images/Boom.png'),
  require('../assets/images/bomb1.png'),
  require('../assets/images/citydestroyed.jpeg'),
  require('../assets/images/avatars/avatar1.png'),
  require('../assets/images/avatars/avatar2.png'),
  require('../assets/images/avatars/avatar3.png'),
  require('../assets/images/avatars/avatar4.png'),
  require('../assets/images/avatars/avatar5.png'),
  require('../assets/images/avatars/avatar6.png'),
];

export default function RootLayout() {
  useEffect(() => {
    // Start preloading immediately (non-blocking)
    Asset.loadAsync(PRELOAD_ASSETS).catch(() => {});
    // Idle-time preload of large JSON animation so navigation feels snappier
    InteractionManager.runAfterInteractions(() => {
      import('../assets/animations/Cartoon explosion.json').catch(() => {});
    });
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="party-mode-games" />
    </Stack>
  );
}
