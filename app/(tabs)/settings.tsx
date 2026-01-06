import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Linking, Modal, Platform, ScrollView, Share, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CARD_BACKS, getCardBackById } from '../../data/card-backs';
import { useCardBack } from '../../utils/CardBackContext';
import { soundManager } from '../../utils/SoundManager';
import { THEMES, useTheme } from '../../utils/ThemeContext';
import { useLanguage } from '../../utils/LanguageContext';

export default function SettingsScreen() {
    const router = useRouter();
    // Settings states
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [hapticsEnabled, setHapticsEnabled] = useState(true);
    const [masterVolume, setMasterVolume] = useState(75);
    const [soundEffectsVolume, setSoundEffectsVolume] = useState(100);
    const [musicVolume, setMusicVolume] = useState(75);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const { theme, themeId, setTheme, ownedThemes } = useTheme();
    const { t, language, setLanguage } = useLanguage();
    const { selectedCardBackId, setCardBack } = useCardBack();

    const [showSoundSettings, setShowSoundSettings] = useState(false);
    const [showThemeSettings, setShowThemeSettings] = useState(false);
    const [showLanguageSettings, setShowLanguageSettings] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const [showCardBackSettings, setShowCardBackSettings] = useState(false);

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
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
                        <View style={{ width: 40 }} />
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                        <TouchableOpacity style={styles.settingItem} onPress={() => setShowSoundSettings(true)}>
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

                        <TouchableOpacity style={styles.settingItem} onPress={() => setShowThemeSettings(true)}>
                            <Ionicons name="color-palette" size={24} color="#667eea" />
                            <Text style={styles.settingText}>{t('settings.theme')}</Text>
                            <Text style={styles.settingValue}>{THEMES[themeId]?.name || 'Default'}</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.settingItem} onPress={() => setShowLanguageSettings(true)}>
                            <Ionicons name="language" size={24} color="#667eea" />
                            <Text style={styles.settingText}>{t('settings.language')}</Text>
                            <Text style={styles.settingValue}>
                                {language === 'en' ? 'English' : language === 'es' ? 'Español' : 'Français'}
                            </Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.settingItem} onPress={() => setShowCardBackSettings(true)}>
                            <Ionicons name="albums" size={24} color="#667eea" />
                            <Text style={styles.settingText}>{t('settings.cardBackDesign')}</Text>
                            <Text style={styles.settingValue}>{getCardBackById(selectedCardBackId).name}</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.settingItem} onPress={() => setShowPrivacy(true)}>
                            <Ionicons name="shield-checkmark" size={24} color="#667eea" />
                            <Text style={styles.settingText}>{t('settings.privacy')}</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.settingItem} onPress={() => setShowAbout(true)}>
                            <Ionicons name="information-circle" size={24} color="#667eea" />
                            <Text style={styles.settingText}>{t('settings.about')}</Text>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>

            {/* Sound & Music Settings Modal */}
            <Modal visible={showSoundSettings} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: '80%' }]}>
                        <Text style={styles.modalTitle}>🔊 {t('settings.soundMusic')}</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Master Volume */}
                            <View style={styles.settingItem}>
                                <Ionicons name="volume-high" size={22} color="#667eea" />
                                <Text style={styles.settingText}>{t('settings.masterVolume')}</Text>
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
                                <Text style={styles.settingText}>{t('settings.soundEffects')}</Text>
                                <Switch
                                    value={soundEnabled}
                                    onValueChange={handleSoundToggle}
                                    trackColor={{ false: '#ccc', true: '#f39c12' }}
                                    thumbColor={soundEnabled ? '#fff' : '#f4f3f4'}
                                />
                            </View>
                            {soundEnabled && (
                                <View style={[styles.settingItem, { paddingLeft: 37 }]}>
                                    <Text style={styles.settingText}>{t('settings.effectsVolume')}</Text>
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
                                <Text style={styles.settingText}>{t('settings.backgroundMusic')}</Text>
                                <Switch
                                    value={musicEnabled}
                                    onValueChange={handleMusicToggle}
                                    trackColor={{ false: '#ccc', true: '#e74c3c' }}
                                    thumbColor={musicEnabled ? '#fff' : '#f4f3f4'}
                                />
                            </View>
                            {musicEnabled && (
                                <View style={[styles.settingItem, { paddingLeft: 37 }]}>
                                    <Text style={styles.settingText}>{t('settings.musicVolume')}</Text>
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
                                <Text style={styles.settingText}>{t('settings.hapticFeedback')}</Text>
                                <Switch
                                    value={hapticsEnabled}
                                    onValueChange={handleHapticsToggle}
                                    trackColor={{ false: '#ccc', true: '#9b59b6' }}
                                    thumbColor={hapticsEnabled ? '#fff' : '#f4f3f4'}
                                />
                            </View>
                            <Text style={styles.settingHint}>
                                {t('settings.hapticHint')}
                            </Text>
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowSoundSettings(false)}
                        >
                            <Text style={styles.closeButtonText}>{t('common.done')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Theme Settings Modal */}
            <Modal visible={showThemeSettings} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('settings.chooseTheme')}</Text>
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
                            <Text style={styles.closeButtonText}>{t('common.cancel')}</Text>
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
                            {['en', 'es', 'fr'].map((lang) => (
                                <TouchableOpacity
                                    key={lang}
                                    style={[styles.optionItem, language === lang && styles.optionSelected]}
                                    onPress={() => {
                                        setLanguage(lang as any);
                                        setShowLanguageSettings(false);
                                        if (hapticsEnabled) {
                                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                        }
                                    }}
                                >
                                    <Text style={styles.optionText}>
                                        {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : 'Français'}
                                    </Text>
                                    {language === lang && <Ionicons name="checkmark" size={24} color="#667eea" />}
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
                        <Text style={styles.modalTitle}>🃏 {t('settings.cardBackDesign')}</Text>
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
                            <Text style={styles.closeButtonText}>{t('common.done')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Privacy Modal */}
            <Modal visible={showPrivacy} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: '80%' }]}>
                        <Text style={styles.modalTitle}>🔒 {t('privacy.title')}</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.privacyText}>
                                <Text style={styles.privacyHeading}>{t('privacy.yourPrivacyMatters')}{"\n"}</Text>
                                {t('privacy.intro')}{"\n\n"}

                                <Text style={styles.privacyHeading}>📊 {t('privacy.dataCollection')}{"\n"}</Text>
                                {t('privacy.dataCollectionText')}{"\n\n"}

                                <Text style={styles.privacyHeading}>📷 {t('privacy.cameraUsage')}{"\n"}</Text>
                                {t('privacy.cameraText')}{"\n\n"}

                                <Text style={styles.privacyHeading}>🎤 {t('privacy.microphoneUsage')}{"\n"}</Text>
                                {t('privacy.microphoneText')}{"\n\n"}

                                <Text style={styles.privacyHeading}>🔄 {t('privacy.dataSharing')}{"\n"}</Text>
                                {t('privacy.dataSharingText')}{"\n\n"}

                                <Text style={styles.privacyHeading}>🗑️ {t('privacy.yourRights')}{"\n"}</Text>
                                {t('privacy.yourRightsText')}{"\n\n"}

                                <Text style={styles.privacyHeading}>📧 {t('privacy.contactUs')}{"\n"}</Text>
                                {t('privacy.contactText')}
                            </Text>
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowPrivacy(false)}
                        >
                            <Text style={styles.closeButtonText}>{t('common.gotIt')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* About Modal */}
            <Modal visible={showAbout} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: '85%' }]}>
                        <Text style={styles.modalTitle}>ℹ️ {t('about.title')}</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.aboutContent}>
                                <Text style={styles.aboutEmoji}>🎉</Text>
                                <Text style={styles.aboutVersion}>{t('about.version')}</Text>
                                <Text style={styles.aboutDescription}>
                                    {t('about.description')}
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
                                        <Text style={styles.aboutLinkButtonText}>{t('about.shareApp')}</Text>
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
                                        <Text style={styles.aboutLinkButtonText}>{t('about.rateUs')}</Text>
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
                                        <Text style={styles.aboutLinkButtonText}>{t('about.contactSupport')}</Text>
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
                                        <Text style={styles.aboutLinkButtonText}>{t('about.followUs')}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.creditsSection}>
                                    <Text style={styles.creditsTitle}>{t('about.madeWithLove')}</Text>
                                    <Text style={styles.creditsText}>
                                        {t('about.tagline')}
                                    </Text>
                                </View>

                                <Text style={styles.aboutCopyright}>{t('about.copyright')}</Text>
                            </View>
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowAbout(false)}
                        >
                            <Text style={styles.closeButtonText}>{t('common.close')}</Text>
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
        paddingBottom: 20
    },
    safeArea: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 5,
        height: 50,
    },
    backButton: {
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    settingText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    settingValue: {
        fontSize: 14,
        color: '#666',
        marginRight: 10,
    },
    settingHint: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
        marginLeft: 5,
        fontStyle: 'italic',
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
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    optionSelected: {
        backgroundColor: '#f8f9fa',
    },
    optionText: {
        fontSize: 16,
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
    privacyText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#555',
    },
    privacyHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
        marginBottom: 5,
    },
    aboutContent: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    aboutEmoji: {
        fontSize: 60,
        marginBottom: 10,
    },
    aboutVersion: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    aboutDescription: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        marginBottom: 25,
        lineHeight: 20,
    },
    aboutLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        width: '100%',
        marginBottom: 15,
    },
    aboutLinkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        gap: 8,
        flex: 1,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    aboutLinkButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    creditsSection: {
        marginTop: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    creditsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    creditsText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    aboutCopyright: {
        fontSize: 12,
        color: '#aaa',
        marginTop: 10,
    },
});
