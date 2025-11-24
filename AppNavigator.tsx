import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import GamesScreen from './(tabs)/games';
import HomeScreen from './(tabs)/home';
import ProfileScreen from './(tabs)/profile';
import StoreScreen from './(tabs)/store';
import PartyModeGamesScreen from './PartyModeGamesScreen';
import SpicyGamesScreen from './SpicyGamesScreen';
import PreGameScreen from './app/PreGameScreen';
import ActionAdrenalineGamesScreen from './app/action-adrenaline-games';
import ExtremeChallengeRouletteScreen from './app/extreme-challenge-roulette';
import HumorCreativityGamesScreen from './app/humor-creativity-games';
import MicMadnessScreen from './app/mic-madness';
import MicMadnessGameScreen from './app/mic-madness-game';
import MicMadnessPreGame from './app/mic-madness-pre-game';
import QuickCompetitionGamesScreen from './app/quick-competition-games';
import SocialTruthGamesScreen from './app/social-truth-games';
import WordMentalGamesScreen from './app/word-mental-games';
// Import other screens as needed

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Games" component={GamesScreen} />
        <Stack.Screen name="Store" component={StoreScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="SpicyGames" component={SpicyGamesScreen} />
        <Stack.Screen name="PartyModeGames" component={PartyModeGamesScreen} />
        <Stack.Screen name="ActionAdrenalineGamesScreen" component={ActionAdrenalineGamesScreen} />
        <Stack.Screen name="HumorCreativityGamesScreen" component={HumorCreativityGamesScreen} />
        <Stack.Screen name="WordMentalGamesScreen" component={WordMentalGamesScreen} />
        <Stack.Screen name="QuickCompetitionGamesScreen" component={QuickCompetitionGamesScreen} />
        <Stack.Screen name="SocialTruthGamesScreen" component={SocialTruthGamesScreen} />
          <Stack.Screen name="MicMadnessPreGame" component={MicMadnessPreGame} />
            <Stack.Screen name="MicMadnessGame" component={MicMadnessGameScreen} />
              <Stack.Screen name="MicMadness" component={MicMadnessScreen} />
        <Stack.Screen name="PreGameScreen" component={PreGameScreen} />
        <Stack.Screen name="ExtremeChallengeRouletteScreen" component={ExtremeChallengeRouletteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
