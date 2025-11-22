import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StoreScreen() {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    Alert.alert("Sign in with Google", "This feature is not yet implemented.");
  };

  const handleAppleSignIn = () => {
    Alert.alert("Sign in with Apple", "This feature is not yet implemented.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>✨ Store Verse ✨</Text>
        <Text style={styles.subtitle}>Upgrade your party experience!</Text>

        <TouchableOpacity style={styles.mainButton}>
          {/* <Ionicons name="game-controller-outline" size={24} color="#000" style={styles.mainButtonIcon} /> */}
          <Text style={styles.mainButtonText}>Unlock Themes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.mainButton, styles.premiumButton]} onPress={() => router.push('/spicy-games')}>
            {/* <Ionicons name="lock-closed-outline" size={24} color="#000" style={styles.mainButtonIcon} /> */}
            <View>
                <Text style={styles.mainButtonText}>Premium</Text>
                <Text style={styles.premiumSubtitle}>Extra playlists + Spicy Mode</Text>
            </View>
        </TouchableOpacity>

        <View style={styles.featuresContainer}>
          <Text style={styles.featureText}>🔥 Spicy Mode 18+</Text>
          <Text style={styles.featureText}>✨ More party games</Text>
          <Text style={styles.featureText}>💎 Exclusive categories</Text>
        </View>

        <TouchableOpacity style={styles.unlockButton}>
          <Text style={styles.unlockButtonText}>UNLOCK FESTIVE PLAYLIST</Text>
        </TouchableOpacity>
        <Text style={styles.priceText}>$3,99 / month・Try 3 days for free</Text>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
            <Ionicons name="logo-google" size={24} color="#000" />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignIn}>
            <Ionicons name="logo-apple" size={24} color="#000" />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.morePacksTitle}>More fun packs</Text>
        <View style={styles.packsContainer}>
          <TouchableOpacity style={[styles.packButton, {backgroundColor: '#cce4fA'}]}>
            <Text style={styles.packText}>Festive Pack</Text>
            <Text style={styles.packEmoji}>🎄</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.packButton, {backgroundColor: '#d8c9eA'}]}>
            <Text style={styles.packText}>Halloween Pack</Text>
            <Text style={styles.packEmoji}>🎃</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.packButton, {backgroundColor: '#fAcce4'}]}>
            <Text style={styles.packText}>Valentine Pack</Text>
            <Text style={styles.packEmoji}>❤️</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#a9c1eA',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 30,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginBottom: 15,
  },
  premiumButton: {
    justifyContent: 'flex-start',
  },
  mainButtonIcon: {
    marginRight: 15,
  },
  mainButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  premiumSubtitle: {
      fontSize: 14,
      color: 'gray',
  },
  featuresContainer: {
    width: '100%',
    paddingLeft: 20,
    marginBottom: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  unlockButton: {
    backgroundColor: '#ff6347',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '48%',
    justifyContent: 'center'
  },
  socialButtonText: {
    marginLeft: 10,
    fontWeight: 'bold'
  },
  morePacksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  packsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  packButton: {
    borderRadius: 20,
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  packText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  packEmoji: {
    fontSize: 30,
  },
});
