import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <View style={styles.buttons}> 
        <TouchableOpacity activeOpacity={0.9} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/(tabs)/games'); }}>
          <LinearGradient colors={['#22c55e','#16a34a']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.btn}> 
            <Ionicons name="play" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.btnText}>Play Now</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); router.push('/spicy-games'); }}>
          <LinearGradient colors={['#fb7185','#ef4444']} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.btn, styles.spicy]}> 
            <Ionicons name="flame" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.btnText}>Spicy Mode 18+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#000', alignItems:'center', justifyContent:'center', paddingHorizontal:24 },
  logo: { width:200, height:200, resizeMode:'contain', marginBottom:28 },
  buttons: { width:'100%', alignItems:'center', gap:18 },
  btn: { width:'85%', borderRadius:999, paddingVertical:18, flexDirection:'row', alignItems:'center', justifyContent:'center' },
  spicy: { },
  icon: { marginRight:10 },
  btnText: { color:'#fff', fontSize:20, fontWeight:'700', letterSpacing:0.5 },
});
