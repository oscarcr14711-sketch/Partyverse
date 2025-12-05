import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BulbIcon, ChatIcon, FinishFlagsIcon, FireIcon, GiftIcon, JoyLaughIcon, ThunderIcon } from './CategoryIcons';
import { PulsingButton } from './PulsingButton';

interface CategoryCardProps {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, subtitle, icon, color, onPress }) => {
  const renderIcon = () => {
    switch (title) {
      case 'Action / Adrenaline':
        return <ThunderIcon />;
      case 'Humor / Creativity':
        return <JoyLaughIcon />;
      case 'Word / Mental':
        return <BulbIcon />;
      case 'Quick Competition':
        return <FinishFlagsIcon />;
      case 'Social / Truth':
        return <ChatIcon />;
      case 'Spicy / 18+ / Alcohol':
        return <FireIcon />;
      case 'Specials (Weekly / Festive)':
        return <GiftIcon />;
      default:
        return <Text style={styles.icon}>{icon}</Text>;
    }
  };

  return (
    <PulsingButton onPress={onPress} style={styles.cardWrapper}>
      <View style={[styles.cardInner, { backgroundColor: color }]}>
        <View style={styles.iconCircle}>
          {renderIcon()}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
    </PulsingButton>
  );
};

export { CategoryCard };

const styles = StyleSheet.create({
  cardWrapper: {
    width: '45%',
    aspectRatio: 1.1,
    margin: 8,
  },
  cardInner: {
    borderRadius: 36,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.35)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.25)',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 14,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  icon: {
    fontSize: 32,
    color: '#fff',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
  },
});
