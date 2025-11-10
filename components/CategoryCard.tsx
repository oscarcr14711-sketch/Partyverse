import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface CategoryCardProps {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ title, subtitle, icon, color, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '45%',
    aspectRatio: 1,
    borderRadius: 20,
    padding: 15,
    justifyContent: 'space-between',
    margin: 5,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 12,
    color: 'white',
  },
});
