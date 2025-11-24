import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function GameOverScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#6C3FA7', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
      <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 40, marginBottom: 24, letterSpacing: 1 }}>
        DID YOU COMPLETE ALL CHALLENGES OR WERE YOU
        TOO SCARED FOR SOME OF THEM?
      </Text>
      <Image source={require('../assets/images/ecgo.png')} style={{ width: 320, height: 180, marginBottom: 24 }} resizeMode="contain" />
      <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 32, letterSpacing: 1 }}>
        WHOEVER DID THE LEAST CHALLENGES HAS TO TAKE ON
        THE REAL CHALLENGE...
      </Text>
      <TouchableOpacity style={{ backgroundColor: '#F47A1F', borderRadius: 16, paddingVertical: 18, paddingHorizontal: 32, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 6 }}>
        <Text style={{ color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center', letterSpacing: 2 }}>HARDCORE CHALLENGE</Text>
      </TouchableOpacity>
    </View>
  );
}

