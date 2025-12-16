import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PulsingButton } from '../../components/PulsingButton';
import { playSound } from '../../utils/SoundManager';
import { useTheme } from '../../utils/ThemeContext';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, themeId } = useTheme();

  const goPlay = () => {
    playSound('ui.buttonClick');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/game-menu');
  };
  const goSpicy = () => {
    playSound('ui.buttonClick');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push('/spicy-games');
  };
  const goProfile = () => {
    playSound('ui.buttonClick');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile');
  };
  const goSettings = () => {
    playSound('ui.buttonClick');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/settings');
  };

  // Get the appropriate overlay animation
  const overlayAnimation = theme.overlayAnimation || require('../../assets/animations/Confetti - Full Screen.json');

  return (
    <LinearGradient
      colors={theme.home.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, flexDirection: 'column' }} pointerEvents="none">
        <LottieView
          source={overlayAnimation}
          autoPlay
          loop
          style={{ flex: 1, width: '100%' }}
        />
        <LottieView
          source={overlayAnimation}
          autoPlay
          loop
          style={{ flex: 1, width: '100%' }}
        />
        <LottieView
          source={overlayAnimation}
          autoPlay
          loop
          style={{ flex: 1, width: '100%' }}
        />
      </View>

      {/* Header Buttons */}
      <SafeAreaView style={styles.headerContainer} edges={['left', 'right']}>
        <TouchableOpacity style={styles.iconButton} onPress={goSettings}>
          <Ionicons name="settings-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={goProfile}>
          <Ionicons name="person-circle-outline" size={32} color="white" />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={[styles.center, { zIndex: 2, flex: 1 }]}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <View style={styles.actions}>
          {/* ... existing buttons ... */}
          <PulsingButton style={{ width: '92%' }} onPress={goPlay}>
            <LinearGradient
              colors={theme.buttons.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.buttonOuter]}
            >
              <LinearGradient
                colors={themeId === 'christmas' ? ['#7f1d1d', '#dc2626'] : ["#065f46", "#10b981"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.buttonInner]}
              >
                <View style={styles.row}>
                  <View style={styles.iconSlot}><Ionicons name="play" size={20} color="#ffffff" /></View>
                  <View style={styles.textSlot}><Text style={styles.playText}>Play Now</Text></View>
                  <View style={styles.iconSlot} />
                </View>
              </LinearGradient>
            </LinearGradient>
          </PulsingButton>

          <PulsingButton style={{ width: '92%', marginTop: 10 }} onPress={goSpicy}>
            <LinearGradient
              colors={theme.buttons.secondary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.buttonOuter]}
            >
              <LinearGradient
                colors={themeId === 'christmas' ? ['#065f46', '#10b981'] : ["#7f1d1d", "#dc2626"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.buttonInner]}
              >
                <View style={styles.row}>
                  <View style={styles.iconSlot}><Ionicons name="flame" size={20} color="#ffffff" /></View>
                  <View style={styles.textSlot}><Text style={styles.spicyText}>Spicy Mode 18+</Text></View>
                  <View style={styles.iconSlot} />
                </View>
              </LinearGradient>
            </LinearGradient>
          </PulsingButton>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    backdropFilter: 'blur(10px)', // For web support mostly, ignored on native usually
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  // ... existing styles ...

  logo: { width: 200, height: 200, resizeMode: 'contain' },
  actions: { width: '100%', alignItems: 'center', gap: 16, marginTop: 20 },
  buttonOuter: { width: '100%', padding: 3, borderRadius: 999, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 0 } },
  buttonInner: { borderRadius: 999, paddingVertical: 18, paddingHorizontal: 32, minHeight: 64, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  playText: { textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 4 },
  spicyText: { textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
  iconSlot: { width: 28, alignItems: 'center', justifyContent: 'center' },
  textSlot: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
});

