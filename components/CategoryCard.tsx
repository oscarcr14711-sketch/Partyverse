import { Ionicons } from '@expo/vector-icons';
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
  locked?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, subtitle, icon, color, onPress, locked = false }) => {
  const renderIcon = () => {
    // If locked, show lock icon
    if (locked) {
      return <Ionicons name="lock-closed" size={32} color="#fff" />;
    }

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
    <PulsingButton onPress={onPress} style={[styles.cardWrapper, locked && styles.cardWrapperLocked]}>
      <View style={[styles.cardInner, { backgroundColor: color }]}>
        {locked && <View style={styles.grayOverlay} />}
        {locked && (
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>COMING SOON</Text>
          </View>
        )}
        <View style={[styles.iconCircle, locked && styles.iconCircleLocked]}>
          {renderIcon()}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, locked && styles.titleLocked]}>{title}</Text>
          <Text style={[styles.subtitle, locked && styles.subtitleLocked]}>{subtitle}</Text>
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
  cardWrapperLocked: {
    opacity: 0.65,
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
  grayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(80, 80, 80, 0.75)',
    borderRadius: 36,
    zIndex: 1,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  comingSoonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
  iconCircleLocked: {
    backgroundColor: 'rgba(255,255,255,0.08)',
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
  titleLocked: {
    opacity: 0.7,
  },
  subtitle: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
  },
  subtitleLocked: {
    opacity: 0.6,
  },
});
