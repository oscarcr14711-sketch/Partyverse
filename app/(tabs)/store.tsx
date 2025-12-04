import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const STORE_ITEMS = {
  themes: [
    { id: 1, name: 'Ocean Breeze', emoji: '🌊', price: '$1.99', colors: ['#667eea', '#764ba2'], owned: false },
    { id: 2, name: 'Sunset Vibes', emoji: '🌅', price: '$1.99', colors: ['#f093fb', '#f5576c'], owned: false },
    { id: 3, name: 'Forest Dream', emoji: '🌲', price: '$1.99', colors: ['#2ecc71', '#27ae60'], owned: false },
    { id: 4, name: 'Midnight Sky', emoji: '🌙', price: '$1.99', colors: ['#1a1a2e', '#16213e'], owned: true },
  ],
  avatars: [
    { id: 1, name: 'Party Pack', emoji: '🎉', price: '$2.99', count: '12 avatars', owned: false },
    { id: 2, name: 'Animal Pack', emoji: '🐶', price: '$2.99', count: '15 avatars', owned: false },
    { id: 3, name: 'Fantasy Pack', emoji: '🧙', price: '$2.99', count: '10 avatars', owned: true },
  ],
  games: [
    { id: 1, name: 'Trivia Expansion', emoji: '🧠', price: '$3.99', count: '500+ questions', owned: false },
    { id: 2, name: 'Dare Pack', emoji: '🎭', price: '$2.99', count: '200+ dares', owned: false },
    { id: 3, name: 'Classic Games', emoji: '🎲', price: '$4.99', count: '10 games', owned: false },
  ],
  music: [
    { id: 1, name: 'EDM Party', emoji: '🎧', price: '$1.99', count: '25 tracks', owned: false },
    { id: 2, name: 'Chill Vibes', emoji: '🎵', price: '$1.99', count: '30 tracks', owned: true },
    { id: 3, name: 'Throwback Hits', emoji: '📻', price: '$1.99', count: '40 tracks', owned: false },
  ],
};

export default function StoreScreen() {
  const [selectedCategory, setSelectedCategory] = useState('themes');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const categories = [
    { id: 'themes', name: 'Themes', icon: 'color-palette' },
    { id: 'avatars', name: 'Avatars', icon: 'person' },
    { id: 'games', name: 'Games', icon: 'game-controller' },
    { id: 'music', name: 'Music', icon: 'musical-notes' },
  ];

  const renderItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.itemCard}
      onPress={() => setSelectedItem(item)}
    >
      {item.owned && (
        <View style={styles.ownedBadge}>
          <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
        </View>
      )}
      <Text style={styles.itemEmoji}>{item.emoji}</Text>
      <Text style={styles.itemName}>{item.name}</Text>
      {item.count && <Text style={styles.itemCount}>{item.count}</Text>}
      {item.colors && (
        <View style={styles.colorPreview}>
          <View style={[styles.colorDot, { backgroundColor: item.colors[0] }]} />
          <View style={[styles.colorDot, { backgroundColor: item.colors[1] }]} />
        </View>
      )}
      <Text style={styles.itemPrice}>{item.owned ? 'Owned' : item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>✨ Store</Text>
            <Text style={styles.subtitle}>Upgrade your experience</Text>
          </View>

          {/* Premium Banner */}
          <TouchableOpacity
            style={styles.premiumBanner}
            onPress={() => setShowPremiumModal(true)}
          >
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.premiumGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.premiumContent}>
                <View>
                  <Text style={styles.premiumTitle}>🔥 Premium</Text>
                  <Text style={styles.premiumSubtitle}>Unlock everything</Text>
                </View>
                <View style={styles.premiumPrice}>
                  <Text style={styles.premiumPriceText}>$3.99/mo</Text>
                  <Text style={styles.premiumTrial}>3 days free</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Category Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryTab,
                  selectedCategory === category.id && styles.categoryTabActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons
                  name={category.icon as any}
                  size={20}
                  color={selectedCategory === category.id ? 'white' : 'rgba(255,255,255,0.7)'}
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Items Grid */}
          <ScrollView style={styles.itemsScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.itemsGrid}>
              {STORE_ITEMS[selectedCategory as keyof typeof STORE_ITEMS].map(renderItem)}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {/* Item Detail Modal */}
      {selectedItem && (
        <Modal visible={!!selectedItem} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalEmoji}>{selectedItem.emoji}</Text>
              <Text style={styles.modalTitle}>{selectedItem.name}</Text>
              {selectedItem.count && (
                <Text style={styles.modalCount}>{selectedItem.count}</Text>
              )}
              {selectedItem.colors && (
                <View style={styles.modalColorPreview}>
                  <LinearGradient
                    colors={selectedItem.colors}
                    style={styles.modalGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                </View>
              )}
              <Text style={styles.modalPrice}>{selectedItem.price}</Text>

              {selectedItem.owned ? (
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonOwned]}>
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                  <Text style={styles.modalButtonText}>Owned</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Purchase</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setSelectedItem(null)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Premium Modal */}
      <Modal visible={showPremiumModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={styles.modalEmoji}>👑</Text>
            <Text style={styles.modalTitle}>Premium Membership</Text>
            <Text style={styles.premiumDescription}>
              Get unlimited access to all content
            </Text>

            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
                <Text style={styles.benefitText}>All themes unlocked</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
                <Text style={styles.benefitText}>Exclusive avatar packs</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
                <Text style={styles.benefitText}>Premium game modes</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
                <Text style={styles.benefitText}>All music playlists</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
                <Text style={styles.benefitText}>Ad-free experience</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
                <Text style={styles.benefitText}>Early access to new features</Text>
              </View>
            </View>

            <View style={styles.pricingCard}>
              <Text style={styles.pricingAmount}>$3.99/month</Text>
              <Text style={styles.pricingTrial}>First 3 days free</Text>
            </View>

            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Start Free Trial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowPremiumModal(false)}
            >
              <Text style={styles.modalCloseText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  premiumBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  premiumGradient: {
    padding: 20,
  },
  premiumContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  premiumPrice: {
    alignItems: 'flex-end',
  },
  premiumPriceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  premiumTrial: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  categoriesScroll: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    gap: 8,
  },
  categoryTabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: 'white',
  },
  itemsScroll: {
    flex: 1,
    marginTop: 20,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    gap: 10,
    paddingBottom: 20,
  },
  itemCard: {
    width: (width - 50) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
  },
  ownedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  itemEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  itemCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 10,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalEmoji: {
    fontSize: 64,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  modalColorPreview: {
    width: '100%',
    height: 80,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  modalGradient: {
    flex: 1,
  },
  modalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#667eea',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  },
  modalButtonOwned: {
    backgroundColor: '#2ecc71',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalClose: {
    paddingVertical: 10,
  },
  modalCloseText: {
    color: '#999',
    fontSize: 16,
  },
  premiumDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  benefitsList: {
    width: '100%',
    marginBottom: 25,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 15,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  pricingCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  pricingAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  pricingTrial: {
    fontSize: 14,
    color: '#2ecc71',
    fontWeight: '600',
  },
});
