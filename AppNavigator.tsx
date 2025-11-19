import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import HomeScreen from './(tabs)/home';
import GamesScreen from './(tabs)/games';
import StoreScreen from './(tabs)/store';
import ProfileScreen from './(tabs)/profile';
import SpicyGamesScreen from './SpicyGamesScreen';
import PartyModeGamesScreen from './PartyModeGamesScreen';
import ActionAdrenalineGamesScreen from './app/action-adrenaline-games';
import HumorCreativityGamesScreen from './app/humor-creativity-games';
import WordMentalGamesScreen from './app/word-mental-games';
import QuickCompetitionGamesScreen from './app/quick-competition-games';
import SocialTruthGamesScreen from './app/social-truth-games';
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
