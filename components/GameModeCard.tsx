import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GameModeCardProps {
  title: string;
  subtitle?: string;
  icon: string;
  colors: string[];
  onPress: () => void;
  isPremium?: boolean;
}

export const GameModeCard: React.FC<GameModeCardProps> = ({ title, subtitle, icon, colors, onPress, isPremium }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient colors={colors} style={styles.gradient}>
        <View style={styles.content}>
          <Text style={styles.icon}>{icon}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {isPremium && (
            <View style={styles.premiumContainer}>
              <Text style={styles.premiumText}>PREMIUM</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  gradient: {
    borderRadius: 50,
    paddingHorizontal: 25,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    fontSize: 40,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  premiumContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  premiumText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
