import { Stack } from 'expo-router';
import React from 'react';
import { useTheme } from '../../utils/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="store" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="party-mode" />
    </Stack>
  );
}

