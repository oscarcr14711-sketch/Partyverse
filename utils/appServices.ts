import analytics, { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics';
import mobileAds, {
  AdEventType,
  MaxAdContentRating,
  RequestConfiguration,
  InterstitialAd,
} from 'react-native-google-mobile-ads';
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const GOOGLE_TEST_APP_IDS = {
  android: 'ca-app-pub-3940256099942544~3347511713',
  ios: 'ca-app-pub-3940256099942544~1458002511',
};

const GOOGLE_TEST_AD_UNITS = {
  android: {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
  },
  ios: {
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313',
  },
};

const analyticsState = { ready: false };
const interstitialState: {
  ad: InterstitialAd | null;
  loaded: boolean;
  loading: boolean;
  lastShownAt: number | null;
  unsubscribes: Array<() => void>;
} = {
  ad: null,
  loaded: false,
  loading: false,
  lastShownAt: null,
  unsubscribes: [],
};

const INTERSTITIAL_MIN_INTERVAL_MS = 45_000;

export const AdUnitIds = {
  banner:
    Platform.OS === 'ios'
      ? process.env.ADMOB_IOS_BANNER_ID ?? GOOGLE_TEST_AD_UNITS.ios.banner
      : process.env.ADMOB_ANDROID_BANNER_ID ?? GOOGLE_TEST_AD_UNITS.android.banner,
  interstitial:
    Platform.OS === 'ios'
      ? process.env.ADMOB_IOS_INTERSTITIAL_ID ?? GOOGLE_TEST_AD_UNITS.ios.interstitial
      : process.env.ADMOB_ANDROID_INTERSTITIAL_ID ?? GOOGLE_TEST_AD_UNITS.android.interstitial,
  rewarded:
    Platform.OS === 'ios'
      ? process.env.ADMOB_IOS_REWARDED_ID ?? GOOGLE_TEST_AD_UNITS.ios.rewarded
      : process.env.ADMOB_ANDROID_REWARDED_ID ?? GOOGLE_TEST_AD_UNITS.android.rewarded,
};

export async function initializeAppServices() {
  await Promise.allSettled([initializeAnalytics(), initializeAds(), initializeRevenueCat(), preloadInterstitial()]);
}

async function initializeAnalytics() {
  try {
    await analytics().setAnalyticsCollectionEnabled(true);
    analyticsState.ready = true;
    await analytics().logAppOpen();
  } catch (error) {
    console.warn('[analytics] no se pudo iniciar:', error);
  }
}

async function initializeAds() {
  try {
    const requestConfig: RequestConfiguration = {
      maxAdContentRating: MaxAdContentRating.T,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
      testDeviceIdentifiers: [],
    };

    await mobileAds().setRequestConfiguration(requestConfig);
    await mobileAds().initialize();
  } catch (error) {
    console.warn('[admob] no se pudo iniciar:', error);
  }
}

async function initializeRevenueCat() {
  const apiKey =
    Platform.OS === 'ios'
      ? process.env.REVENUECAT_APPLE_API_KEY
      : process.env.REVENUECAT_GOOGLE_API_KEY;

  if (!apiKey) {
    console.warn('[revenuecat] Falta la API key; define las variables REVENUECAT_*');
    return;
  }

  try {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.WARN);
    await Purchases.configure({ apiKey });
  } catch (error) {
    console.warn('[revenuecat] no se pudo iniciar:', error);
  }
}

export async function logEvent(
  name: string,
  params?: FirebaseAnalyticsTypes.Parameters,
) {
  if (!analyticsState.ready) return;

  try {
    await analytics().logEvent(name, params);
  } catch (error) {
    console.warn(`[analytics] logEvent ${name} falló:`, error);
  }
}

export async function logScreenView(screenName: string) {
  if (!analyticsState.ready) return;

  try {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    });
  } catch (error) {
    console.warn(`[analytics] logScreenView ${screenName} falló:`, error);
  }
}

export async function logScreenDuration(params: {
  screenName: string;
  durationMs: number;
  isGame?: boolean;
  gamePhase?: 'pregame' | 'gameplay' | 'results';
}) {
  if (!analyticsState.ready) return;
  const { screenName, durationMs, isGame = false, gamePhase } = params;
  try {
    await logEvent('screen_time', {
      screen_name: screenName,
      duration_ms: Math.max(0, Math.round(durationMs)),
      is_game: isGame,
      game_phase: gamePhase,
      platform: Platform.OS,
    });
  } catch (error) {
    console.warn(`[analytics] logScreenDuration ${screenName} falló:`, error);
  }
}

export async function logGameStart(gameId: string, meta?: { sourceScreen?: string }) {
  if (!analyticsState.ready) return;
  try {
    await logEvent('game_start', {
      game_id: gameId,
      source_screen: meta?.sourceScreen,
      platform: Platform.OS,
    });
  } catch (error) {
    console.warn(`[analytics] logGameStart ${gameId} falló:`, error);
  }
}

export async function logGameEnd(gameId: string, meta: { durationMs: number; exitReason?: 'navigate' | 'quit' | 'error' | 'unmount' }) {
  if (!analyticsState.ready) return;
  try {
    await logEvent('game_end', {
      game_id: gameId,
      duration_ms: Math.max(0, Math.round(meta.durationMs)),
      exit_reason: meta.exitReason,
      platform: Platform.OS,
    });
  } catch (error) {
    console.warn(`[analytics] logGameEnd ${gameId} falló:`, error);
  }
}

export async function logGamePhase(gameId: string, phase: 'pregame' | 'results', meta?: { sourceScreen?: string }) {
  if (!analyticsState.ready) return;
  try {
    await logEvent('game_phase', {
      game_id: gameId,
      phase,
      source_screen: meta?.sourceScreen,
      platform: Platform.OS,
    });
  } catch (error) {
    console.warn(`[analytics] logGamePhase ${gameId} falló:`, error);
  }
}

export function getAdAppId() {
  return Platform.OS === 'ios'
    ? process.env.ADMOB_IOS_APP_ID ?? GOOGLE_TEST_APP_IDS.ios
    : process.env.ADMOB_ANDROID_APP_ID ?? GOOGLE_TEST_APP_IDS.android;
}

export async function preloadInterstitial() {
  const adUnit = AdUnitIds.interstitial;
  if (!adUnit) return;
  if (interstitialState.loading || interstitialState.loaded) return;

  interstitialState.loading = true;
  interstitialState.loaded = false;
  // reset listeners if any remain
  interstitialState.unsubscribes = [];

  interstitialState.ad = InterstitialAd.createForAdRequest(adUnit, {
    requestNonPersonalizedAdsOnly: false,
  });

  interstitialState.unsubscribes.push(
    interstitialState.ad.addAdEventListener(AdEventType.LOADED, () => {
      interstitialState.loaded = true;
      interstitialState.loading = false;
    }),
  );
  interstitialState.unsubscribes.push(
    interstitialState.ad.addAdEventListener(AdEventType.ERROR, () => {
      interstitialState.loaded = false;
      interstitialState.loading = false;
      clearInterstitialListeners();
      setTimeout(preloadInterstitial, 5000);
    }),
  );
  interstitialState.ad.load();
}

function clearInterstitialListeners() {
  interstitialState.unsubscribes.forEach((u) => {
    try {
      u();
    } catch {
      // ignore
    }
  });
  interstitialState.unsubscribes = [];
}

export async function showGameInterstitial(reason: 'game_end' | 'game_restart', gameId?: string) {
  const now = Date.now();
  if (interstitialState.lastShownAt && now - interstitialState.lastShownAt < INTERSTITIAL_MIN_INTERVAL_MS) {
    return;
  }

  if (!interstitialState.loaded || !interstitialState.ad) {
    await preloadInterstitial();
    return;
  }

  return new Promise<void>((resolve) => {
    const onClosed = () => {
      clearInterstitialListeners();
      interstitialState.ad = null;
      interstitialState.loaded = false;
      interstitialState.lastShownAt = Date.now();
      preloadInterstitial();
      resolve();
    };

    interstitialState.unsubscribes.push(interstitialState.ad.addAdEventListener(AdEventType.CLOSED, onClosed));
    interstitialState.unsubscribes.push(interstitialState.ad.addAdEventListener(AdEventType.ERROR, onClosed));

    try {
      interstitialState.ad.show();
      logEvent('ad_interstitial_show', { reason, game_id: gameId, platform: Platform.OS });
    } catch (error) {
      onClosed();
    }
  });
}
