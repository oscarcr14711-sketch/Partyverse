import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const AVATAR_IMAGES = [
  require('../../assets/images/avatars/avatar1.png'),
  require('../../assets/images/avatars/avatar2.png'),
  require('../../assets/images/avatars/avatar3.png'),
  require('../../assets/images/avatars/avatar4.png'),
  require('../../assets/images/avatars/avatar5.png'),
  require('../../assets/images/avatars/avatar6.png'),
];

const ACHIEVEMENTS = [
  { id: 1, name: 'First Game', icon: '🎮', unlocked: true, description: 'Play your first game' },
  { id: 2, name: 'Party Starter', icon: '🎉', unlocked: true, description: 'Host 5 games' },
  { id: 3, name: 'Social Butterfly', icon: '🦋', unlocked: true, description: 'Play with 10 different people' },
  { id: 4, name: 'Night Owl', icon: '🦉', unlocked: false, description: 'Play past midnight' },
  { id: 5, name: 'Champion', icon: '🏆', unlocked: false, description: 'Win 20 games' },
  { id: 6, name: 'Dedicated', icon: '⭐', unlocked: false, description: 'Play 7 days in a row' },
];

const RECENT_GAMES = [
  { id: 1, name: 'Memory Rush', result: 'Won', date: '2 hours ago', icon: '🧠' },
  { id: 2, name: 'Color Clash', result: 'Lost', date: 'Yesterday', icon: '🎨' },
  { id: 3, name: 'Brain Buzzer', result: 'Won', date: '2 days ago', icon: '⚡' },
];

export default function ProfileScreen() {
  const [userName, setUserName] = useState('Party King');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.settingsIcon} onPress={() => setShowSettings(true)}>
                <Ionicons name="settings-outline" size={28} color="white" />
              </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
              <TouchableOpacity onPress={() => setShowAvatarPicker(true)} style={styles.avatarContainer}>
                <Image source={AVATAR_IMAGES[selectedAvatar]} style={styles.avatar} />
                <View style={styles.editBadge}>
                  <Ionicons name="camera" size={16} color="white" />
                </View>
              </TouchableOpacity>
              <Text style={styles.userName}>{userName}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>⭐ Level 12</Text>
              </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>47</Text>
                <Text style={styles.statLabel}>Games</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>28</Text>
                <Text style={styles.statLabel}>Wins</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>12h</Text>
                <Text style={styles.statLabel}>Play Time</Text>
              </View>
            </View>

            {/* Achievements */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏆 Achievements</Text>
              <View style={styles.achievementsGrid}>
                {ACHIEVEMENTS.map((achievement) => (
                  <TouchableOpacity key={achievement.id} style={[
                    styles.achievementCard,
                    !achievement.unlocked && styles.achievementLocked
                  ]}>
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <Text style={[
                      styles.achievementName,
                      !achievement.unlocked && styles.achievementNameLocked
                    ]}>{achievement.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recent Games */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Recent Games</Text>
              {RECENT_GAMES.map((game) => (
                <View key={game.id} style={styles.gameCard}>
                  <Text style={styles.gameIcon}>{game.icon}</Text>
                  <View style={styles.gameInfo}>
                    <Text style={styles.gameName}>{game.name}</Text>
                    <Text style={styles.gameDate}>{game.date}</Text>
                  </View>
                  <View style={[
                    styles.resultBadge,
                    game.result === 'Won' ? styles.resultWon : styles.resultLost
                  ]}>
                    <Text style={styles.resultText}>{game.result}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-social" size={24} color="white" />
                <Text style={styles.actionText}>Share Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="trophy" size={24} color="white" />
                <Text style={styles.actionText}>View Leaderboard</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {/* Avatar Picker Modal */}
      <Modal visible={showAvatarPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Avatar</Text>
            <View style={styles.avatarGrid}>
              {AVATAR_IMAGES.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedAvatar(index);
                    setShowAvatarPicker(false);
                  }}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === index && styles.avatarSelected
                  ]}
                >
                  <Image source={avatar} style={styles.avatarOptionImage} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAvatarPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal visible={showSettings} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>Settings</Text>
            <ScrollView>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="volume-high" size={24} color="#667eea" />
                <Text style={styles.settingText}>Sound & Music</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="notifications" size={24} color="#667eea" />
                <Text style={styles.settingText}>Notifications</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="color-palette" size={24} color="#667eea" />
                <Text style={styles.settingText}>Theme</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="language" size={24} color="#667eea" />
                <Text style={styles.settingText}>Language</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="shield-checkmark" size={24} color="#667eea" />
                <Text style={styles.settingText}>Privacy</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="information-circle" size={24} color="#667eea" />
                <Text style={styles.settingText}>About</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 20, paddingTop: 20 }]}>
                <Ionicons name="log-out" size={24} color="#e74c3c" />
                <Text style={[styles.settingText, { color: '#e74c3c' }]}>Log Out</Text>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  settingsIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f093fb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' }, android: { fontFamily: 'sans-serif-medium' } }),
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievementCard: {
    width: (width - 60) / 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  achievementLocked: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  achievementNameLocked: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  gameIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  gameDate: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultWon: {
    backgroundColor: '#2ecc71',
  },
  resultLost: {
    backgroundColor: '#e74c3c',
  },
  resultText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  avatarOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: '#667eea',
  },
  avatarOptionImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  closeButton: {
    backgroundColor: '#667eea',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
