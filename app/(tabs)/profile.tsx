
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const userName = '' // Replace with actual user name

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }} // Replace with actual profile image
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{userName} 🎉</Text>
            <Text style={styles.partyLevel}>Party Level 12</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Games Played</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>8/20</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>

          <View style={styles.premiumContainer}>
            <View style={styles.premiumHeader}>
              {/* <Ionicons name="diamond" size={24} color="white" /> */}
              <Text style={styles.premiumTitle}>Premium</Text>
            </View>
            <Text style={styles.premiumSubtitle}>Active until Dec 30, 2025</Text>
            <TouchableOpacity style={styles.manageButton}>
              <Text style={styles.manageButtonText}>Manage Subscription</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingsContainer}>
            <Text style={styles.settingsTitle}>SETTINGS</Text>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              <Text style={styles.settingText}>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="color-palette-outline" size={24} color="white" />
              <Text style={styles.settingText}>Change Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="link-outline" size={24} color="white" />
              <Text style={styles.settingText}>Link Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="log-out-outline" size={24} color="white" />
              <Text style={styles.settingText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#6c5ce7',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  partyLevel: {
    fontSize: 18,
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    width: '45%',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 16,
    color: 'white',
  },
  premiumContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 15,
  },
  manageButton: {
    backgroundColor: '#ff7f50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  manageButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  settingsContainer: {
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  settingText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 15,
  },
});
