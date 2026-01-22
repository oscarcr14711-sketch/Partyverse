import 'dotenv/config';

const TEST_ADMOB_APP_IDS = {
  android: 'ca-app-pub-3940256099942544~3347511713',
  ios: 'ca-app-pub-3940256099942544~1458002511',
};

const androidAdMobAppId = process.env.ADMOB_ANDROID_APP_ID ?? TEST_ADMOB_APP_IDS.android;
const iosAdMobAppId = process.env.ADMOB_IOS_APP_ID ?? TEST_ADMOB_APP_IDS.ios;
const googleServicesJson = process.env.GOOGLE_SERVICES_JSON ?? './firebase/google-services.json';
const googleServiceInfoPlist = process.env.GOOGLE_SERVICE_INFO_PLIST ?? './firebase/GoogleService-Info.plist';

export default {
  expo: {
    name: 'partyverse',
    slug: 'partyverse',
    owner: 'oscarcr7',
    version: '1.0.2',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'partyverse',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      googleServicesFile: googleServiceInfoPlist,
      supportsTablet: true,
      bundleIdentifier: 'com.oscarcr7.partyverse',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSCameraUsageDescription: 'Partyverse uses the camera for the "Don\'t Let It PIC You" game to take fun photos during gameplay.',
        NSMicrophoneUsageDescription: 'Partyverse uses the microphone for games like "Blown Away" to detect blowing and "Lip Sync Chaos" for music playback.',
      },
    },
    android: {
      googleServicesFile: googleServicesJson,
      permissions: ['CAMERA', 'RECORD_AUDIO'],
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.oscarcr.partyverse',
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      "expo-asset",
      "expo-web-browser",
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
      '@react-native-firebase/app',
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: androidAdMobAppId,
          iosAppId: iosAdMobAppId,
        },
      ],
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            forceStaticLinking: ['RNFBApp', 'RNFBAnalytics']
          }
        }
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      adUnitIds: {
        android: {
          banner: process.env.ADMOB_ANDROID_BANNER_ID,
          interstitial: process.env.ADMOB_ANDROID_INTERSTITIAL_ID,
          rewarded: process.env.ADMOB_ANDROID_REWARDED_ID,
        },
        ios: {
          banner: process.env.ADMOB_IOS_BANNER_ID,
          interstitial: process.env.ADMOB_IOS_INTERSTITIAL_ID,
          rewarded: process.env.ADMOB_IOS_REWARDED_ID,
        },
      },
      router: {},
      "eas": {
        "projectId": "e56652de-c86a-4e57-91d9-aa3903358376"
      }
    },
  },
};
