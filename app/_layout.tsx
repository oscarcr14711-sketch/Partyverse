import { Asset } from 'expo-asset';
import { Stack, usePathname } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { InteractionManager, View } from 'react-native';
import { CardBackProvider } from '../utils/CardBackContext';
import {
  initializeAppServices,
  logGameEnd,
  logGamePhase,
  logGameStart,
  logScreenDuration,
  logScreenView,
  showGameInterstitial,
} from '../utils/appServices';
import { initializeSounds } from '../utils/SoundManager';
import { ThemeProvider } from '../utils/ThemeContext';
import AdBanner from '../components/AdBanner';

// Centralized asset list for eager preloading (Hot Bomb + commonly used)
const PRELOAD_ASSETS = [
  require('../assets/images/Hotbombtitle.png'),
  require('../assets/images/Boom.png'),
  require('../assets/images/bomb1.png'),
  require('../assets/images/citydestroyed.jpeg'),
  require('../assets/images/avatars/avatar1.png'),
  require('../assets/images/avatars/avatar2.png'),
  require('../assets/images/avatars/avatar3.png'),
  require('../assets/images/avatars/avatar4.png'),
  require('../assets/images/avatars/avatar5.png'),
  require('../assets/images/avatars/avatar6.png'),
];

export default function RootLayout() {
  const pathname = usePathname();
  const sessionRef = useRef<{
    screen: string;
    startedAt: number;
    isGame: boolean;
    gameId?: string;
    gamePhase?: 'pregame' | 'gameplay' | 'results';
  } | null>(null);

  useEffect(() => {
    // Start preloading immediately (non-blocking)
    Asset.loadAsync(PRELOAD_ASSETS).catch(() => { });
    // Idle-time preload of large JSON animation so navigation feels snappier
    InteractionManager.runAfterInteractions(() => {
      import('../assets/animations/Cartoon explosion.json').catch(() => { });
    });

    // Initialize sound system
    console.log('🎯 _layout.tsx: Initializing sounds...');
    initializeSounds()
      .then(() => console.log('🎯 _layout.tsx: Sounds initialized!'))
      .catch((err) => console.error('🎯 _layout.tsx: Sound init failed:', err));

    initializeAppServices().catch((err) => {
      console.error('🎯 _layout.tsx: initializeAppServices() falló:', err);
    });
  }, []);

  useEffect(() => {
    if (!pathname) return;
    const now = Date.now();
    const previous = sessionRef.current;

    // Log previous screen duration / game end
    if (previous) {
      const durationMs = now - previous.startedAt;
      logScreenDuration({
        screenName: previous.screen,
        durationMs,
        isGame: previous.isGame,
        gamePhase: previous.gamePhase,
      });

      if (previous.isGame && previous.gameId && previous.gamePhase === 'gameplay') {
        logGameEnd(previous.gameId, { durationMs, exitReason: 'navigate' });
        showGameInterstitial('game_end', previous.gameId);
      }
    }

    // Classify current screen
    const screen = pathname.replace(/^\//, '') || 'root';
    const { isGame, gameId, gamePhase } = classifyGameScreen(screen);

    // Log view + phase starts
    logScreenView(screen);
    if (gamePhase === 'pregame' && gameId) {
      logGamePhase(gameId, 'pregame', { sourceScreen: previous?.screen });
    } else if (gamePhase === 'results' && gameId) {
      logGamePhase(gameId, 'results', { sourceScreen: previous?.screen });
    } else if (gamePhase === 'gameplay' && gameId) {
      logGameStart(gameId, { sourceScreen: previous?.screen });
      if (previous?.isGame) {
        showGameInterstitial('game_restart', gameId);
      }
    }

    sessionRef.current = {
      screen,
      startedAt: now,
      isGame,
      gameId,
      gamePhase,
    };
  }, [pathname]);

  useEffect(() => {
    return () => {
      const current = sessionRef.current;
      if (!current) return;
      const durationMs = Date.now() - current.startedAt;
      logScreenDuration({
        screenName: current.screen,
        durationMs,
        isGame: current.isGame,
        gamePhase: current.gamePhase,
      });
      if (current.isGame && current.gameId && current.gamePhase === 'gameplay') {
        logGameEnd(current.gameId, { durationMs, exitReason: 'unmount' });
        showGameInterstitial('game_end', current.gameId);
      }
    };
  }, []);

  return (
    <ThemeProvider>
      <CardBackProvider>
        <View style={{ flex: 1 }}>
          <AdBanner />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="party-mode-games" />
            <Stack.Screen name="start" />
            <Stack.Screen name="mic-madness-card-reveal" />
          </Stack>
        </View>
      </CardBackProvider>
    </ThemeProvider>
  );
}

function classifyGameScreen(screen: string): {
  isGame: boolean;
  gameId?: string;
  gamePhase?: 'pregame' | 'gameplay' | 'results';
} {
  if (!screen) return { isGame: false };

  const nonGamePatterns = [
    /^\(tabs\)/,
    /^index$/,
    /^start/,
    /^party-mode-games$/,
    /^practice-mode-games$/,
    /^spicy-games$/,
    /^word-mental-games$/,
    /^action-adrenaline-games$/,
    /^humor-creativity-games$/,
    /^quick-competition-games$/,
    /^social-truth-games$/,
    /^party-mode$/,
    /^party-board$/,
    /^party-poll$/,
    /^modal$/,
  ];

  if (nonGamePatterns.some((rgx) => rgx.test(screen))) {
    return { isGame: false };
  }

  if (/pre-game$/.test(screen)) {
    return { isGame: true, gameId: normalizeGameId(screen, 'pre-game'), gamePhase: 'pregame' };
  }

  if (/(game-over|gameover)$/.test(screen)) {
    return { isGame: true, gameId: normalizeGameId(screen, 'game-over'), gamePhase: 'results' };
  }

  if (/(^|-)game($|-)/.test(screen) && !/-games/.test(screen)) {
    return { isGame: true, gameId: normalizeGameId(screen, 'game'), gamePhase: 'gameplay' };
  }

  return { isGame: false };
}

function normalizeGameId(screen: string, phase: 'game' | 'pre-game' | 'game-over') {
  let id = screen;

  if (phase === 'pre-game') {
    id = id.replace(/-pre-game$/, '');
  } else if (phase === 'game-over') {
    id = id.replace(/-(game-over|gameover)$/, '');
  } else {
    id = id.replace(/-game(-start)?$/, '');
  }

  return id || 'unknown_game';
}
