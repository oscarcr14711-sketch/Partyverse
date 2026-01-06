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
  id?: string;
  variant?: 'grid' | 'list';
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, subtitle, icon, color, onPress, locked = false, id, variant = 'grid' }) => {
  const renderIcon = () => {
    // If locked, show lock icon
    if (locked) {
      return <Ionicons name="lock-closed" size={32} color="#fff" />;
    }

    // Use id for matching to support translations
    switch (id) {
      case 'action-adrenaline':
        return <ThunderIcon />;
      case 'humor-creativity':
        return <JoyLaughIcon />;
      case 'word-mental':
        return <BulbIcon />;
      case 'quick-competition':
        return <FinishFlagsIcon />;
      case 'social-truth':
        return <ChatIcon />;
      case 'spicy':
        return <FireIcon />;
      case 'specials':
        return <GiftIcon />;
      default:
        return <Text style={styles.icon}>{icon}</Text>;
    }
  };

  const isList = variant === 'list';

  return (
    <PulsingButton
      onPress={onPress}
      style={[
        styles.cardWrapper,
        isList && styles.cardWrapperList,
        locked && styles.cardWrapperLocked
      ]}
    >
      <View style={[
        styles.cardInner,
        isList && styles.cardInnerList,
        { backgroundColor: color }
      ]}>
        {locked && <View style={styles.grayOverlay} />}
        <View style={[
          styles.iconCircle,
          isList && styles.iconCircleList,
          locked && styles.iconCircleLocked
        ]}>
          {renderIcon()}
        </View>
        <View style={[styles.textContainer, isList && styles.textContainerList]}>
          <Text style={[styles.title, isList && styles.titleList, locked && styles.titleLocked]}>{title}</Text>
          <Text style={[styles.subtitle, isList && styles.subtitleList, locked && styles.subtitleLocked]}>{subtitle}</Text>
        </View>
        {isList && !locked && (
          <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.7)" style={{ marginLeft: 'auto' }} />
        )}
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
  subtitleList: {
    textAlign: 'left',
    fontSize: 13,
    opacity: 0.9,
  },
  subtitleLocked: {
    opacity: 0.6,
  },
  // List Variant Styles
  cardWrapperList: {
    width: '100%',
    aspectRatio: undefined,
    height: 100, // Fixed height for list items
    marginBottom: 12,
    margin: 0,
  },
  cardInnerList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    gap: 16,
    borderRadius: 24,
  },
  iconCircleList: {
    marginBottom: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  textContainerList: {
    alignItems: 'flex-start',
    flex: 1,
  },
  titleList: {
    textAlign: 'left',
    fontSize: 19,
    marginBottom: 4,
  },
});
