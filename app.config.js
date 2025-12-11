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
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'partyverse',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      googleServicesFile: googleServiceInfoPlist,
      supportsTablet: true,
      bundleIdentifier: 'com.oscarcr.partyverse',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      googleServicesFile: googleServicesJson,
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
      router: {},
      "eas": {
        "projectId": "e56652de-c86a-4e57-91d9-aa3903358376"
      }
    },
  },
};
