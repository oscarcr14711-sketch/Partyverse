import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { PulsingButton } from '../../components/PulsingButton';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#5DCEA9', '#B8D96E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <View style={styles.buttons}>
        <PulsingButton style={styles.btnWrapper} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/(tabs)/games'); }}>
          <LinearGradient colors={['#22c55e', '#16a34a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btn}>
            {/* <Ionicons name="play" size={20} color="#fff" style={styles.icon} /> */}
            <Text style={styles.btnText}>Play Now</Text>
          </LinearGradient>
        </PulsingButton>
        <PulsingButton style={styles.btnWrapper} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); router.push('/spicy-games'); }}>
          <LinearGradient colors={['#fb7185', '#ef4444']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btn}>
            {/* <Ionicons name="flame" size={20} color="#fff" style={styles.icon} /> */}
            <Text style={styles.btnText}>Spicy Mode 18+</Text>
          </LinearGradient>
        </PulsingButton>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  logo: { width: 200, height: 200, resizeMode: 'contain', marginBottom: 28 },
  buttons: { width: '100%', alignItems: 'center', gap: 18 },
  btnWrapper: { width: '85%' },
  btn: { width: '100%', borderRadius: 999, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  spicy: {},
  icon: { marginRight: 10 },
  btnText: { color: '#fff', fontSize: 20, fontWeight: '700', letterSpacing: 0.5 },
});
