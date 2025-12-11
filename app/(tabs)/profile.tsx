import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Dimensions, Image, Modal, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ACHIEVEMENTS } from '../../data/achievements';

const { width } = Dimensions.get('window');

const AVATAR_IMAGES = [
  require('../../assets/images/avatars/avatar1.png'),
  require('../../assets/images/avatars/avatar2.png'),
  require('../../assets/images/avatars/avatar3.png'),
  require('../../assets/images/avatars/avatar4.png'),
  require('../../assets/images/avatars/avatar5.png'),
  require('../../assets/images/avatars/avatar6.png'),
];


const RECENT_GAMES = [
  { id: 1, name: 'Memory Rush', result: 'Won', date: '2 hours ago', icon: '🧠' },
  { id: 2, name: 'Color Clash', result: 'Lost', date: 'Yesterday', icon: '🎨' },
  { id: 3, name: 'Brain Buzzer', result: 'Won', date: '2 days ago', icon: '⚡' },
];

// Stats start at 0 - will be tracked with real data in future update
const INITIAL_STATS = {
  gamesPlayed: 0,
  wins: 0,
  playTime: '0h',
};

export default function ProfileScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('Party King');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  // Haptics state (default true for now as we removed the setting from here)
  const hapticsEnabled = true;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header with Back Button */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.settingsIcon}>
                <Ionicons name="arrow-back" size={24} color="white" />
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
                <Text style={styles.statValue}>{INITIAL_STATS.gamesPlayed}</Text>
                <Text style={styles.statLabel}>Games</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{INITIAL_STATS.wins}</Text>
                <Text style={styles.statLabel}>Wins</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{INITIAL_STATS.playTime}</Text>
                <Text style={styles.statLabel}>Play Time</Text>
              </View>
            </View>

            {/* Achievements - Compact View */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.achievementHeader}
                onPress={() => setShowAchievements(!showAchievements)}
              >
                <Text style={styles.sectionTitle}>🏆 Achievements ({ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length})</Text>
                <Ionicons
                  name={showAchievements ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>

              {showAchievements && (
                <View style={styles.achievementsGrid}>
                  {ACHIEVEMENTS.slice(0, 12).map((achievement) => (
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
                  {ACHIEVEMENTS.length > 12 && (
                    <Text style={styles.achievementNote}>
                      +{ACHIEVEMENTS.length - 12} more achievements to unlock!
                    </Text>
                  )}
                </View>
              )}
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
              <TouchableOpacity
                style={styles.actionButton}
                onPress={async () => {
                  try {
                    await Share.share({
                      message: `Check out my Partyverse profile! 🎉\n\n🎮 Games Played: ${INITIAL_STATS.gamesPlayed}\n🏆 Wins: ${INITIAL_STATS.wins}\n⏱️ Play Time: ${INITIAL_STATS.playTime}\n\nJoin me on Partyverse - the ultimate party game app!`,
                      title: 'My Partyverse Profile',
                    });
                    if (hapticsEnabled) {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }
                  } catch (error) {
                    console.error('Share failed:', error);
                  }
                }}
              >
                <Ionicons name="share-social" size={24} color="white" />
                <Text style={styles.actionText}>Share Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setShowLeaderboard(true);
                  if (hapticsEnabled) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
              >
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

      {/* Leaderboard Modal */}
      <Modal visible={showLeaderboard} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🏆 Leaderboard</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.leaderboardList}>
                {[
                  { rank: 1, name: 'Party Legend', score: 2847, icon: '👑' },
                  { rank: 2, name: 'Game Master', score: 2156, icon: '🎯' },
                  { rank: 3, name: 'Fun Seeker', score: 1923, icon: '🎊' },
                  { rank: 4, name: 'Night Owl', score: 1654, icon: '🦉' },
                  { rank: 5, name: 'Champion', score: 1432, icon: '🏅' },
                ].map((player) => (
                  <View key={player.rank} style={styles.leaderboardItem}>
                    <View style={styles.leaderboardRank}>
                      <Text style={styles.leaderboardRankText}>{player.rank}</Text>
                    </View>
                    <Text style={styles.leaderboardIcon}>{player.icon}</Text>
                    <View style={styles.leaderboardInfo}>
                      <Text style={styles.leaderboardName}>{player.name}</Text>
                      <Text style={styles.leaderboardScore}>{player.score} pts</Text>
                    </View>
                  </View>
                ))}

                {/* Current User Position */}
                <View style={[styles.leaderboardItem, styles.currentUserItem]}>
                  <View style={styles.leaderboardRank}>
                    <Text style={styles.leaderboardRankText}>-</Text>
                  </View>
                  <Text style={styles.leaderboardIcon}>🎮</Text>
                  <View style={styles.leaderboardInfo}>
                    <Text style={styles.leaderboardName}>{userName} (You)</Text>
                    <Text style={styles.leaderboardScore}>Start playing to rank!</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.leaderboardNote}>
                💡 Earn points by playing games and unlocking achievements!
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowLeaderboard(false)}
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
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 0,
  },
  settingsIcon: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
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
    backgroundColor: '#667eea',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  levelText: {
    color: 'white',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievementCard: {
    width: (width - 60) / 3,
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  achievementLocked: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    opacity: 0.7,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  achievementName: {
    fontSize: 10,
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
  },
  achievementNameLocked: {
    color: 'rgba(255,255,255,0.8)',
  },
  achievementNote: {
    width: '100%',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 10,
    fontStyle: 'italic',
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  gameIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  gameDate: {
    fontSize: 12,
    color: '#666',
  },
  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  resultWon: {
    backgroundColor: '#d4edda',
  },
  resultLost: {
    backgroundColor: '#f8d7da',
  },
  resultText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    minHeight: '40%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  avatarOption: {
    padding: 5,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: '#667eea',
    backgroundColor: '#eef2ff',
  },
  avatarOptionImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  leaderboardList: {
    paddingVertical: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  leaderboardRank: {
    width: 30,
    alignItems: 'center',
  },
  leaderboardRankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  leaderboardIcon: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  leaderboardScore: {
    fontSize: 14,
    color: '#666',
  },
  currentUserItem: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#667eea',
    marginTop: 20,
  },
  leaderboardNote: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    marginBottom: 10,
    fontSize: 12,
    fontStyle: 'italic',
  },
});
