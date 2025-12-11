import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { PulsingButton } from '../components/PulsingButton';
import { playSound } from '../utils/SoundManager';
import { useTheme } from '../utils/ThemeContext';

const gameModes = [
  {
    id: '1',
    title: 'Party Mode',
    subtitle: 'Offline games for 2+ people',
    route: '/party-mode-games',
    gradient: ['#f94144', '#f3722c', '#f8961e'],
    emoji: '🎉',
  },
  {
    id: '2',
    title: 'Online Mode',
    subtitle: 'Play with friends online',
    route: null,
    disabled: true,
    gradient: ['#90be6d', '#43aa8b', '#4d908e'],
    emoji: '🌐',
  },
  {
    id: '3',
    title: 'Practice Mode',
    subtitle: 'Practice your skills',
    route: '/practice-mode-games',
    gradient: ['#577590', '#277da1', '#4895ef'],
    emoji: '🏋️',
  },
  {
    id: '4',
    title: 'Spicy',
    subtitle: 'For the bold ones',
    route: '/spicy-games',
    gradient: ['#f72585', '#b5179e', '#7209b7'],
    emoji: '🌶️',
  },
];

type GradientColors = readonly [string, string, ...string[]];
interface GameModeItemProps {
  title: string;
  subtitle: string;
  gradient: GradientColors;
  emoji: string;
  onPress: () => void;
  disabled?: boolean;
}

const GameModeItem: React.FC<GameModeItemProps> = ({
  title,
  subtitle,
  gradient,
  emoji,
  onPress,
  disabled
}) => {
  return (
    <PulsingButton onPress={onPress} disabled={disabled} style={{ opacity: disabled ? 0.6 : 1 }}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gameButton}
      >
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        <View style={styles.gameTextContainer}>
          <Text style={styles.gameTitle}>{title}</Text>
          <Text style={styles.gameDescription}>{subtitle}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </LinearGradient>
    </PulsingButton>
  );
};

interface GameModeData extends Omit<GameModeItemProps, 'onPress'> {
  id: string;
  route: string | null;
}

export default function MainScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const renderGameMode = ({ item }: { item: GameModeData }) => {
    const navigate = () => { if (item.route) router.push(item.route as any); };
    const onPress = () => {
      if (!item.disabled) {
        playSound('ui.buttonClick');
        navigate();
      }
    };

    return <GameModeItem {...item} onPress={onPress} />;
  };

  // Use Christmas background if theme has one
  const hasChristmasBackground = theme.categoryBackgrounds?.gamesMenu;

  const content = (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Let the Games</Text>
        <Text style={[styles.title, styles.titleBegin]}>Begin! 🎮</Text>
        <Text style={styles.subtitle}>Choose your adventure</Text>
      </View>

      <FlatList<GameModeData>
        data={gameModes as unknown as GameModeData[]}
        renderItem={renderGameMode}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );

  if (hasChristmasBackground) {
    return (
      <ImageBackground source={theme.categoryBackgrounds.gamesMenu} style={styles.background} resizeMode="cover">
        {content}
      </ImageBackground>
    );
  }

  return (
    <View style={styles.background}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#121212',
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleBegin: {
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    paddingTop: 10,
    gap: 18,
  },
  gameButton: {
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
    minHeight: 95,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 4,
  },
  emojiContainer: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 30,
  },
  gameTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  gameTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  gameDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 32,
  },
});
