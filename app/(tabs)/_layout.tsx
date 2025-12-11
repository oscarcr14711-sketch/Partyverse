import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { useTheme } from '../../utils/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBar.background,
          borderTopWidth: 0,
          elevation: 0, // Remove shadow on Android
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          position: 'absolute', // Floating effect
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: theme.tabBar.activeColor,
        tabBarInactiveTintColor: theme.tabBar.inactiveColor,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: theme.tabBar.background }} />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="game-controller" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          href: null, // Hidden for MVP - will be enabled in future update
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="party-mode"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

