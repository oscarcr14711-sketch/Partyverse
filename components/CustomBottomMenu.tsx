import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MENU_ITEMS = [
  { label: '🏠', name: 'Home', route: '/(tabs)/home' },
  { label: '🎮', name: 'Games', route: '/(tabs)/games' },
  { label: '🛒', name: 'Store', route: '/(tabs)/store' },
  { label: '👤', name: 'Profile', route: '/(tabs)/profile' },
];

export default function CustomBottomMenu() {
  // Menu removed for debugging asset error. Returns nothing.
  return null;
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#230E4B',
    borderTopWidth: 1,
    borderTopColor: '#3A2563',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 2,
    color: '#fff',
  },
  text: {
    fontSize: 12,
    color: '#fff',
  },
});
