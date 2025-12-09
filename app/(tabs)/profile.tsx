import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, Linking, Modal, Platform, ScrollView, Share, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  // Settings states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [masterVolume, setMasterVolume] = useState(75);
  const [soundEffectsVolume, setSoundEffectsVolume] = useState(100);
  const [musicVolume, setMusicVolume] = useState(75);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { theme, themeId, setTheme, ownedThemes } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showSoundSettings, setShowSoundSettings] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Volume change handlers that update SoundManager
  const handleMasterVolumeChange = (value: number) => {
    setMasterVolume(value);
    soundManager.setMasterVolume(value / 100); // Convert 0-100 to 0-1
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
              <TouchableOpacity style={styles.settingItem} onPress={() => { setShowSettings(false); setTimeout(() => setShowSoundSettings(true), 300); }}>
                <Ionicons name="volume-high" size={24} color="#667eea" />
                <Text style={styles.settingText}>Sound & Music</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>

              <View style={styles.settingItem}>
                <Ionicons name="notifications" size={24} color="#667eea" />
                <Text style={styles.settingText}>Notifications</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#ccc', true: '#667eea' }}
                  thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
                />
              </View>

              <TouchableOpacity style={styles.settingItem} onPress={() => { setShowSettings(false); setTimeout(() => setShowThemeSettings(true), 300); }}>
                <Ionicons name="color-palette" size={24} color="#667eea" />
                <Text style={styles.settingText}>Theme</Text>
                <Text style={styles.settingValue}>{THEMES[themeId]?.name || 'Default'}</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} onPress={() => { setShowSettings(false); setTimeout(() => setShowLanguageSettings(true), 300); }}>
                <Ionicons name="language" size={24} color="#667eea" />
                <Text style={styles.settingText}>Language</Text>
                <Text style={styles.settingValue}>{selectedLanguage}</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} onPress={() => { setShowSettings(false); setTimeout(() => setShowPrivacy(true), 300); }}>
                <Ionicons name="shield-checkmark" size={24} color="#667eea" />
                <Text style={styles.settingText}>Privacy</Text>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} onPress={() => { setShowSettings(false); setTimeout(() => setShowAbout(true), 300); }}>
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
              Only owned themes are shown. Get more themes from the Store!
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
            <Text style={styles.modalTitle}>Choose Language</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {['English', 'Español', 'Français', 'Deutsch', 'Italiano', 'Português'].map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.optionItem, selectedLanguage === lang && styles.optionSelected]}
                  onPress={() => {
                    setSelectedLanguage(lang);
                    setShowLanguageSettings(false);
                  }}
                >
                  <Text style={styles.optionText}>{lang}</Text>
                  {selectedLanguage === lang && <Ionicons name="checkmark" size={24} color="#667eea" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowLanguageSettings(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
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
                      Linking.openURL('https://instagram.com/partyverseapp').catch(() => {
                        Alert.alert('Follow Us!', 'Find us on Instagram @partyverseapp');
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
  settingValue: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  settingHint: {
    fontSize: 12,
    color: '#999',
    marginLeft: 37,
    marginTop: -8,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionSelected: {
    backgroundColor: '#f8f9ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  privacyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  privacyHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  aboutContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  aboutEmoji: {
    fontSize: 64,
    marginBottom: 15,
  },
  aboutVersion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  aboutLinks: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 10,
  },
  aboutLink: {
    alignItems: 'center',
    gap: 5,
  },
  aboutLinkText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  aboutLinkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667eea',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  aboutLinkButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  creditsSection: {
    marginTop: 15,
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(102, 126, 234, 0.2)',
    alignItems: 'center',
  },
  creditsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  creditsText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  aboutCopyright: {
    fontSize: 12,
    color: '#999',
  },
});
