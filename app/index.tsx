import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LottieView from 'lottie-react-native';

export default function Index() {
  const router = useRouter();

  const goPlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/games');
  };
  const goSpicy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push('/spicy-games');
  };

  // Animated values for press/hover
  const playScale = useRef(new Animated.Value(1)).current;
  const spicyScale = useRef(new Animated.Value(1)).current;
  const playGlow = useRef(new Animated.Value(0)).current;
  const spicyGlow = useRef(new Animated.Value(0)).current;

  const animateIn = (scaleVal: Animated.Value, glowVal: Animated.Value) => {
    Animated.parallel([
      Animated.spring(scaleVal, { toValue: 1.06, useNativeDriver: true, speed: 14, bounciness: 6 }),
      Animated.timing(glowVal, { toValue: 1, duration: 180, useNativeDriver: false })
    ]).start();
  };
  const animateOut = (scaleVal: Animated.Value, glowVal: Animated.Value) => {
    Animated.parallel([
      Animated.spring(scaleVal, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 5 }),
      Animated.timing(glowVal, { toValue: 0, duration: 180, useNativeDriver: false })
    ]).start();
  };

  // Instead of mutating shadowColor (which may be on a frozen style object internally), use an animated glow layer behind buttons.
  const renderGlow = (color: string, anim: Animated.Value) => (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: 999,
          backgroundColor: color,
          opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.55] }),
          transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.15] }) }],
          filter: Platform.OS === 'web' ? 'blur(28px)' : undefined,
        },
      ]}
    />
  );

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
          <Animated.View
            style={{ transform: [{ scale: playScale }], width: '80%' }}
            onTouchStart={() => animateIn(playScale, playGlow)}
            onTouchEnd={() => animateOut(playScale, playGlow)}
            {...(Platform.OS === 'web' ? { onMouseEnter: () => animateIn(playScale, playGlow), onMouseLeave: () => animateOut(playScale, playGlow) } : {})}
          >
            <View style={{ position: 'relative' }}>
              {renderGlow('#22c55e', playGlow)}
              <TouchableOpacity activeOpacity={0.9} onPress={goPlay}>
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
              </TouchableOpacity>
            </View>
          </Animated.View>
          
          <Animated.View
            style={{ transform: [{ scale: spicyScale }], width: '80%' }}
            onTouchStart={() => animateIn(spicyScale, spicyGlow)}
            onTouchEnd={() => animateOut(spicyScale, spicyGlow)}
            {...(Platform.OS === 'web' ? { onMouseEnter: () => animateIn(spicyScale, spicyGlow), onMouseLeave: () => animateOut(spicyScale, spicyGlow) } : {})}
          >
            <View style={{ position: 'relative', marginTop: 10 }}>
              {renderGlow('#ef4444', spicyGlow)}
              <TouchableOpacity activeOpacity={0.9} onPress={goSpicy}>
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
              </TouchableOpacity>
            </View>
          </Animated.View>
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
  buttonOuter: { width: '92%', padding: 3, borderRadius: 999, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 0 } },
  buttonInner: { borderRadius: 999, paddingVertical: 18, paddingHorizontal: 32, minHeight: 64, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  icon: { marginRight: 8 },
  playText: { textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 4 },
  spicyText: { textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
  iconSlot: { width: 28, alignItems: 'center', justifyContent: 'center' },
  textSlot: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
});
