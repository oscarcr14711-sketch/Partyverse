import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, Linking, Modal, Platform, ScrollView, Share, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CARD_BACKS, getCardBackById } from '../../data/card-backs';
import { useAchievements } from '../../utils/AchievementContext';
import { useCardBack } from '../../utils/CardBackContext';
import { useLanguage } from '../../utils/LanguageContext';
import { usePlayerStats } from '../../utils/PlayerStatsContext';
import { soundManager } from '../../utils/SoundManager';
import { THEMES, useTheme } from '../../utils/ThemeContext';

const { width } = Dimensions.get('window');

const AVATAR_IMAGES = [
  require('../../assets/images/avatars/avatar1.png'),
  require('../../assets/images/avatars/avatar2.png'),
  require('../../assets/images/avatars/avatar3.png'),
  require('../../assets/images/avatars/avatar4.png'),
  require('../../assets/images/avatars/avatar5.png'),
  require('../../assets/images/avatars/avatar6.png'),
];


// Helper function to format relative time
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

export default function ProfileScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('Party King');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Settings states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [masterVolume, setMasterVolume] = useState(75);
  const [soundEffectsVolume, setSoundEffectsVolume] = useState(100);
  const [musicVolume, setMusicVolume] = useState(75);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { theme, themeId, setTheme, ownedThemes } = useTheme();
  const [showSoundSettings, setShowSoundSettings] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showCardBackSettings, setShowCardBackSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const { selectedCardBackId, setCardBack } = useCardBack();
  const { stats, getFormattedPlayTime } = usePlayerStats();
  const { language, setLanguage, t } = useLanguage();
  const { achievements, getUnlockedCount } = useAchievements();

  // Volume change handlers that update SoundManager
  const handleMasterVolumeChange = (value: number) => {
    setMasterVolume(value);
    soundManager.setMasterVolume(value / 100);
  };

  const handleEffectsVolumeChange = (value: number) => {
    setSoundEffectsVolume(value);
    soundManager.setEffectsVolume(value / 100);
  };

  const handleMusicVolumeChange = (value: number) => {
    setMusicVolume(value);
    soundManager.setMusicVolume(value / 100);
  };

  const handleSoundToggle = (value: boolean) => {
    setSoundEnabled(value);
    soundManager.setMuted(!value);
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleMusicToggle = (value: boolean) => {
    setMusicEnabled(value);
    soundManager.setMusicMuted(!value);
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleHapticsToggle = (value: boolean) => {
    setHapticsEnabled(value);
    if (value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

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
                <Text style={styles.statValue}>{stats.gamesPlayed}</Text>
                <Text style={styles.statLabel}>Games</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.wins}</Text>
                <Text style={styles.statLabel}>Wins</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{getFormattedPlayTime()}</Text>
                <Text style={styles.statLabel}>Play Time</Text>
              </View>
            </View>

            {/* Achievements - Compact View */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.achievementHeader}
                onPress={() => setShowAchievements(!showAchievements)}
              >
                <Text style={styles.sectionTitle}>🏆 Achievements ({getUnlockedCount()}/{achievements.length})</Text>
                <Ionicons
                  name={showAchievements ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>

              {showAchievements && (
                <View style={styles.achievementsGrid}>
                  {achievements.map((achievement) => (
                    <TouchableOpacity
                      key={achievement.id}
                      style={[
                        styles.achievementCard,
                        !achievement.unlocked && styles.achievementLocked
                      ]}
                      onPress={() => {
                        Alert.alert(
                          `${achievement.icon} ${achievement.name}`,
                          achievement.description + (achievement.unlocked ? '\n\n✅ UNLOCKED!' : '\n\n🔒 Not yet unlocked'),
                          [{ text: 'OK' }]
                        );
                        if (hapticsEnabled) {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                      <Text style={[
                        styles.achievementName,
                        !achievement.unlocked && styles.achievementNameLocked
                      ]}>{achievement.name}</Text>
                      {achievement.unlocked && (
                        <View style={styles.achievementUnlockedBadge}>
                          <Text style={styles.achievementStar}>⭐</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Recent Games */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Recent Games</Text>
              {stats.recentGames.length > 0 ? (
                stats.recentGames.slice(0, 5).map((game) => (
                  <View key={game.id} style={styles.gameCard}>
                    <Text style={styles.gameIcon}>{game.icon}</Text>
                    <View style={styles.gameInfo}>
                      <Text style={styles.gameName}>{game.name}</Text>
                      <Text style={styles.gameDate}>{getRelativeTime(game.date)}</Text>
                    </View>
                    <View style={[
                      styles.resultBadge,
                      game.result === 'won' ? styles.resultWon : game.result === 'lost' ? styles.resultLost : styles.resultCompleted
                    ]}>
                      <Text style={styles.resultText}>
                        {game.result === 'won' ? 'Won' : game.result === 'lost' ? 'Lost' : 'Played'}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyGames}>
                  <Text style={styles.emptyGamesText}>🎮 No games played yet!</Text>
                  <Text style={styles.emptyGamesSubtext}>Start playing to see your history here</Text>
                </View>
              )}
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={async () => {
                  try {
                    await Share.share({
                      message: `Check out my Partyverse profile! 🎉\n\n🎮 Games Played: ${stats.gamesPlayed}\n🏆 Wins: ${stats.wins}\n⏱️ Play Time: ${getFormattedPlayTime()}\n\nJoin me on Partyverse - the ultimate party game app!`,
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

      {/* Settings Modal */}
      <Modal visible={showSettings} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>{t('settings.title')}</Text>
            <ScrollView>
              <TouchableOpacity style={styles.settingItem} onPress={() => { setShowSettings(false); setTimeout(() => setShowSoundSettings(true), 300); }}>
                <Ionicons name="volume-high" size={24} color="#667eea" />
                <Text style={styles.settingText}>{t('settings.soundMusic')}</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>

              <View style={styles.settingItem}>
                <Ionicons name="notifications" size={24} color="#667eea" />
                <Text style={styles.settingText}>{t('settings.notifications')}</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#ccc', true: '#667eea' }}
                  thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
                />
              </View>

              <TouchableOpacity style={styles.settingItem} onPress={() => { setShowSettings(false); setTimeout(() => setShowThemeSettings(true), 300); }}>
                <Ionicons name="color-palette" size={24} color="#667eea" />
                <Text style={styles.settingText}>{t('settings.theme')}</Text>
                <Text style={styles.settingValue}>{THEMES[themeId]?.name || 'Default'}</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} onPress={() => { setShowSettings(false); setTimeout(() => setShowCardBackSettings(true), 300); }}>
                <Ionicons name="albums" size={24} color="#667eea" />
                <Text style={styles.settingText}>{t('settings.cardBackDesign')}</Text>
                <Text style={styles.settingValue}>{getCardBackById(selectedCardBackId).name}</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} onPress={() => { setShowSettings(false); setTimeout(() => setShowPrivacy(true), 300); }}>
                <Ionicons name="shield-checkmark" size={24} color="#667eea" />
                <Text style={styles.settingText}>{t('settings.privacy')}</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} onPress={() => { setShowSettings(false); setTimeout(() => setShowAbout(true), 300); }}>
                <Ionicons name="information-circle" size={24} color="#667eea" />
                <Text style={styles.settingText}>{t('settings.about')}</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 20, paddingTop: 20 }]}>
                <Ionicons name="log-out" size={24} color="#e74c3c" />
                <Text style={[styles.settingText, { color: '#e74c3c' }]}>{t('settings.logOut')}</Text>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.closeButtonText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sound & Music Settings Modal */}
      <Modal visible={showSoundSettings} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>🔊 Sound & Music</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Master Volume */}
              <View style={styles.settingItem}>
                <Ionicons name="volume-high" size={22} color="#667eea" />
                <Text style={styles.settingText}>Master Volume</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => handleMasterVolumeChange(Math.max(0, masterVolume - 25))}
                    style={{ padding: 8, backgroundColor: '#f0f0f0', borderRadius: 8, marginRight: 8 }}
                  >
                    <Ionicons name="remove" size={16} color="#667eea" />
                  </TouchableOpacity>
                  <Text style={{ fontWeight: 'bold', color: '#667eea', minWidth: 40, textAlign: 'center' }}>{masterVolume}%</Text>
                  <TouchableOpacity
                    onPress={() => handleMasterVolumeChange(Math.min(100, masterVolume + 25))}
                    style={{ padding: 8, backgroundColor: '#f0f0f0', borderRadius: 8, marginLeft: 8 }}
                  >
                    <Ionicons name="add" size={16} color="#667eea" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sound Effects Toggle & Volume */}
              <View style={styles.settingItem}>
                <Ionicons name="volume-medium" size={22} color="#f39c12" />
                <Text style={styles.settingText}>Sound Effects</Text>
                <Switch
                  value={soundEnabled}
                  onValueChange={handleSoundToggle}
                  trackColor={{ false: '#ccc', true: '#f39c12' }}
                  thumbColor={soundEnabled ? '#fff' : '#f4f3f4'}
                />
              </View>
              {soundEnabled && (
                <View style={[styles.settingItem, { paddingLeft: 37 }]}>
                  <Text style={styles.settingText}>Effects Volume</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => handleEffectsVolumeChange(Math.max(0, soundEffectsVolume - 25))}
                      style={{ padding: 8, backgroundColor: '#f0f0f0', borderRadius: 8, marginRight: 8 }}
                    >
                      <Ionicons name="remove" size={16} color="#f39c12" />
                    </TouchableOpacity>
                    <Text style={{ fontWeight: 'bold', color: '#f39c12', minWidth: 40, textAlign: 'center' }}>{soundEffectsVolume}%</Text>
                    <TouchableOpacity
                      onPress={() => handleEffectsVolumeChange(Math.min(100, soundEffectsVolume + 25))}
                      style={{ padding: 8, backgroundColor: '#f0f0f0', borderRadius: 8, marginLeft: 8 }}
                    >
                      <Ionicons name="add" size={16} color="#f39c12" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Background Music Toggle & Volume */}
              <View style={styles.settingItem}>
                <Ionicons name="musical-notes" size={22} color="#e74c3c" />
                <Text style={styles.settingText}>Background Music</Text>
                <Switch
                  value={musicEnabled}
                  onValueChange={handleMusicToggle}
                  trackColor={{ false: '#ccc', true: '#e74c3c' }}
                  thumbColor={musicEnabled ? '#fff' : '#f4f3f4'}
                />
              </View>
              {musicEnabled && (
                <View style={[styles.settingItem, { paddingLeft: 37 }]}>
                  <Text style={styles.settingText}>Music Volume</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => handleMusicVolumeChange(Math.max(0, musicVolume - 25))}
                      style={{ padding: 8, backgroundColor: '#f0f0f0', borderRadius: 8, marginRight: 8 }}
                    >
                      <Ionicons name="remove" size={16} color="#e74c3c" />
                    </TouchableOpacity>
                    <Text style={{ fontWeight: 'bold', color: '#e74c3c', minWidth: 40, textAlign: 'center' }}>{musicVolume}%</Text>
                    <TouchableOpacity
                      onPress={() => handleMusicVolumeChange(Math.min(100, musicVolume + 25))}
                      style={{ padding: 8, backgroundColor: '#f0f0f0', borderRadius: 8, marginLeft: 8 }}
                    >
                      <Ionicons name="add" size={16} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Haptic Feedback Toggle */}
              <View style={[styles.settingItem, { marginTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 15 }]}>
                <Ionicons name="phone-portrait-outline" size={22} color="#9b59b6" />
                <Text style={styles.settingText}>Haptic Feedback</Text>
                <Switch
                  value={hapticsEnabled}
                  onValueChange={handleHapticsToggle}
                  trackColor={{ false: '#ccc', true: '#9b59b6' }}
                  thumbColor={hapticsEnabled ? '#fff' : '#f4f3f4'}
                />
              </View>
              <Text style={styles.settingHint}>
                Vibration feedback when pressing buttons
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSoundSettings(false)}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Theme Settings Modal */}
      <Modal visible={showThemeSettings} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Theme</Text>
            <Text style={{ color: '#666', textAlign: 'center', marginBottom: 15, fontSize: 14 }}>
              Select your favorite theme!
            </Text>
            {ownedThemes.map((ownedThemeId) => {
              const themeData = THEMES[ownedThemeId];
              if (!themeData) return null;
              return (
                <TouchableOpacity
                  key={ownedThemeId}
                  style={[styles.optionItem, themeId === ownedThemeId && styles.optionSelected]}
                  onPress={() => {
                    setTheme(ownedThemeId);
                    setShowThemeSettings(false);
                    if (hapticsEnabled) {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }
                  }}
                >
                  <Text style={styles.optionText}>
                    {ownedThemeId === 'default' ? '🎨 ' : ownedThemeId === 'christmas' ? '🎄 ' : ''}
                    {themeData.name}
                  </Text>
                  {themeId === ownedThemeId && <Ionicons name="checkmark" size={24} color="#667eea" />}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowThemeSettings(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Settings Modal */}
      <Modal visible={showLanguageSettings} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('settings.chooseLanguage')}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {[{ code: 'en' as const, name: 'English' }, { code: 'es' as const, name: 'Español' }, { code: 'fr' as const, name: 'Français' }].map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.optionItem, language === lang.code && styles.optionSelected]}
                  onPress={() => {
                    setLanguage(lang.code);
                    setShowLanguageSettings(false);
                  }}
                >
                  <Text style={styles.optionText}>{lang.name}</Text>
                  {language === lang.code && <Ionicons name="checkmark" size={24} color="#667eea" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowLanguageSettings(false)}
            >
              <Text style={styles.closeButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Card Back Settings Modal */}
      <Modal visible={showCardBackSettings} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '85%' }]}>
            <Text style={styles.modalTitle}>🃏 Card Back Design</Text>
            <Text style={{ color: '#666', textAlign: 'center', marginBottom: 15, fontSize: 14 }}>
              Choose your card back for all card games
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.avatarGrid}>
                {CARD_BACKS.map((cardBack) => {
                  const isOwned = !cardBack.isPremium; // Default is free, others require purchase
                  const isSelected = selectedCardBackId === cardBack.id;
                  return (
                    <TouchableOpacity
                      key={cardBack.id}
                      onPress={() => {
                        if (isOwned) {
                          setCardBack(cardBack.id);
                          if (hapticsEnabled) {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                          }
                        } else {
                          Alert.alert(
                            '🔒 Premium Card Back',
                            'Purchase the Card Backs Pack from the Store to unlock this design!',
                            [{ text: 'OK' }]
                          );
                        }
                      }}
                      style={[
                        styles.avatarOption,
                        { width: 90, height: 130 },
                        isSelected && styles.avatarSelected,
                        !isOwned && { opacity: 0.5 }
                      ]}
                    >
                      <Image
                        source={cardBack.image}
                        style={{ width: 70, height: 100, borderRadius: 8 }}
                        resizeMode="cover"
                      />
                      <Text style={{ fontSize: 10, color: '#333', marginTop: 4, textAlign: 'center' }}>
                        {cardBack.name}
                      </Text>
                      {!isOwned && (
                        <View style={{ position: 'absolute', top: 5, right: 5 }}>
                          <Ionicons name="lock-closed" size={16} color="#999" />
                        </View>
                      )}
                      {isSelected && isOwned && (
                        <View style={{ position: 'absolute', top: 5, right: 5 }}>
                          <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCardBackSettings(false)}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Privacy Modal */}
      <Modal visible={showPrivacy} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>🔒 Privacy Policy</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.privacyText}>
                <Text style={styles.privacyHeading}>Your Privacy Matters{"\n"}</Text>
                At Partyverse, we believe in keeping your party moments private. Here's how we protect you.{"\n\n"}

                <Text style={styles.privacyHeading}>📊 Data Collection{"\n"}</Text>
                We collect minimal data to enhance your gaming experience:{"\n"}
                • Game scores and statistics (stored locally){"\n"}
                • Avatar and profile preferences{"\n"}
                • App settings and configurations{"\n"}
                All this data stays on YOUR device.{"\n\n"}

                <Text style={styles.privacyHeading}>📷 Camera Usage{"\n"}</Text>
                Some games like "Don't Let It Pic You" use your camera. Photos are:{"\n"}
                • Only taken during gameplay{"\n"}
                • Never uploaded or shared{"\n"}
                • Not stored after the game ends{"\n\n"}

                <Text style={styles.privacyHeading}>🎤 Microphone Usage{"\n"}</Text>
                Games like "Blown Away" use your microphone to detect blowing. We:{"\n"}
                • Never record audio{"\n"}
                • Only detect sound intensity{"\n"}
                • Don't store any audio data{"\n\n"}

                <Text style={styles.privacyHeading}>🔄 Data Sharing{"\n"}</Text>
                We do NOT share your personal data with third parties. Period.{"\n\n"}

                <Text style={styles.privacyHeading}>🗑️ Your Rights{"\n"}</Text>
                You can delete all your data anytime by:{"\n"}
                • Clearing app data in device settings{"\n"}
                • Uninstalling the app{"\n\n"}

                <Text style={styles.privacyHeading}>📧 Contact Us{"\n"}</Text>
                Questions about privacy? Email us at:{"\n"}
                support@partyverse.app
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPrivacy(false)}
            >
              <Text style={styles.closeButtonText}>Got It!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal visible={showAbout} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '85%' }]}>
            <Text style={styles.modalTitle}>ℹ️ About Partyverse</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.aboutContent}>
                <Text style={styles.aboutEmoji}>🎉</Text>
                <Text style={styles.aboutVersion}>Version 1.0.0</Text>
                <Text style={styles.aboutDescription}>
                  The ultimate party game collection! Bring friends together with exciting games, challenges, and endless fun.
                </Text>

                <View style={styles.aboutLinks}>
                  <TouchableOpacity
                    style={styles.aboutLinkButton}
                    onPress={() => {
                      Share.share({
                        message: '🎉 Check out Partyverse - the ultimate party game app! Make your parties unforgettable! Download now!',
                        title: 'Share Partyverse'
                      });
                    }}
                  >
                    <Ionicons name="share-social" size={24} color="#fff" />
                    <Text style={styles.aboutLinkButtonText}>Share App</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.aboutLinkButton, { backgroundColor: '#f39c12' }]}
                    onPress={() => {
                      const storeUrl = Platform.select({
                        ios: 'https://apps.apple.com/app/partyverse',
                        android: 'https://play.google.com/store/apps/details?id=com.oscarcr.partyverse',
                        default: 'https://oscarcr14711-sketch.github.io/Partyverse/'
                      });
                      Linking.openURL(storeUrl).catch(() => {
                        Alert.alert('Rate Us', 'Thanks for your support!');
                      });
                    }}
                  >
                    <Ionicons name="star" size={24} color="#fff" />
                    <Text style={styles.aboutLinkButtonText}>Rate Us ⭐</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.aboutLinks}>
                  <TouchableOpacity
                    style={[styles.aboutLinkButton, { backgroundColor: '#e74c3c' }]}
                    onPress={() => {
                      Linking.openURL('mailto:partyverseappp@gmail.com?subject=Partyverse%20Support');
                    }}
                  >
                    <Ionicons name="mail" size={24} color="#fff" />
                    <Text style={styles.aboutLinkButtonText}>Contact Support</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.aboutLinkButton, { backgroundColor: '#9b59b6' }]}
                    onPress={() => {
                      Linking.openURL('https://instagram.com/partyverseappp').catch(() => {
                        Alert.alert('Follow Us!', 'Find us on Instagram @partyverseappp');
                      });
                    }}
                  >
                    <Ionicons name="logo-instagram" size={24} color="#fff" />
                    <Text style={styles.aboutLinkButtonText}>Follow Us</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.creditsSection}>
                  <Text style={styles.creditsTitle}>Made with ❤️ for party lovers</Text>
                  <Text style={styles.creditsText}>
                    Designed to bring people together{'\n'}
                    and create unforgettable moments
                  </Text>
                </View>

                <Text style={styles.aboutCopyright}>© 2024 Partyverse. All rights reserved.</Text>
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAbout(false)}
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
    </View >
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
  resultCompleted: {
    backgroundColor: '#3498db',
  },
  resultText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyGames: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  emptyGamesText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyGamesSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
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
  achievementUnlockedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementStar: {
    fontSize: 12,
  },
});
