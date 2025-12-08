import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { PulsingButton } from '../components/PulsingButton';
import { playSound } from '../utils/SoundManager';

export default function Index() {
  const router = useRouter();

  const goPlay = () => {
    playSound('ui.buttonClick');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/games');
  };
  const goSpicy = () => {
    playSound('ui.buttonClick');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push('/spicy-games');
  };

  return (
    <LinearGradient
      colors={['#5DCEA9', '#B8D96E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }} pointerEvents="none">
        <LottieView
          source={require('../assets/animations/Confetti - Full Screen.json')}
          autoPlay
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <View style={[styles.center, { zIndex: 2 }]}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <View style={styles.actions}>
          <PulsingButton style={{ width: '92%' }} onPress={goPlay}>
            <LinearGradient
              colors={["#22c55e", "#16a34a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.buttonOuter]}
            >
              <LinearGradient
                colors={["#065f46", "#10b981"]}
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
              colors={["#fb7185", "#ef4444"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.buttonOuter]}
            >
              <LinearGradient
                colors={["#7f1d1d", "#dc2626"]}
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
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  center: { alignItems: 'center', justifyContent: 'center' },
  logo: { width: 200, height: 200, resizeMode: 'contain' },
  actions: { width: '100%', alignItems: 'center', gap: 16, marginTop: 20 },
  buttonOuter: { width: '100%', padding: 3, borderRadius: 999, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 0 } },
  buttonInner: { borderRadius: 999, paddingVertical: 18, paddingHorizontal: 32, minHeight: 64, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  icon: { marginRight: 8 },
  playText: { textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 4 },
  spicyText: { textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
  iconSlot: { width: 28, alignItems: 'center', justifyContent: 'center' },
  textSlot: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
});
