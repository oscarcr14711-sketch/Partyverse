import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AdUnitIds } from '../utils/appServices';

export default function AdBanner() {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <BannerAd unitId={AdUnitIds.banner} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
});
