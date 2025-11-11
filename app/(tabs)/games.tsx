import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const gameModes = [
  {
    id: '1',
    title: '🎉 Party Mode',
    subtitle: 'Offline games for 2+ people',
    route: '/party-mode-games',
    gradient: ['#FFD700', '#FFA500'],
    darkGradient: ['#B8860B', '#CD853F'],
  },
  {
    id: '2',
    title: '🌐 Online Mode (Coming Soon)',
    subtitle: 'Play with friends online',
    route: null,
    disabled: true,
    gradient: ['#4CAF50', '#388E3C'],
    darkGradient: ['#1B5E20', '#2E7D32'],
  },
  {
    id: '3',
    title: '🏋️ Practice Mode',
    subtitle: 'Practice your skills',
    route: '/practice-mode-games',
    gradient: ['#2196F3', '#1976D2'],
    darkGradient: ['#0D47A1', '#1565C0'],
  },
  {
    id: '4',
    title: '🌶️ Spicy',
    subtitle: '',
    route: '/spicy-games',
    gradient: ['#D95B27', '#C34310'],
    darkGradient: ['#8B360F', '#B33A0D'],
  },
];

const GameModeItem = ({ title, subtitle, gradient, darkGradient, onPress, disabled }) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const runPressAnimation = (next) => {
    // Press animation: quick scale down, then scale up and fade effect
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 90, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      if (typeof next === 'function') next();
    });
  };

  return (
    <Pressable onPress={() => runPressAnimation(onPress)} disabled={disabled}>
      <Animated.View style={[{ transform: [{ scale }], opacity: disabled ? 0.6 : 1 }] }>
        <LinearGradient
          colors={gradient} // Light-to-dark for the border
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[styles.gameButtonOuter, { shadowColor: gradient[0] }]}
        >
          <LinearGradient
            colors={darkGradient.slice().reverse()} // Dark-to-light for the button face
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.gameButtonInner}
          >
            <View style={styles.gameTextContainer}>
              <Text style={styles.gameTitle}>{title}</Text>
              {subtitle ? <Text style={styles.gameDescription}>{subtitle}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
          </LinearGradient>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

export default function MainScreen() {
  const router = useRouter();

  const renderGameMode = ({ item }: { item: any }) => {
    const navigate = () => { if (item.route) router.push(item.route); };
    const onPress = () => {
      if (!item.disabled) {
        navigate();
      }
    };

    return <GameModeItem {...item} onPress={onPress} />;
  };

  return (
    <SafeAreaView style={styles.background}>
        <Text style={styles.title}>Let the Games Begin</Text>
      <FlatList
        data={gameModes}
        renderItem={renderGameMode}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  gameButtonOuter: {
    borderRadius: 18,
    padding: 3,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 12,
  },
  gameButtonInner: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },
  gameTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  gameTitle: {
    color: '#CCCCCC',
    fontSize: 22,
    fontWeight: 'bold',
  },
  gameDescription: {
    color: '#CCCCCC',
    fontSize: 16,
    marginTop: 5,
  },
});
