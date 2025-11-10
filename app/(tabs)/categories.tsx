import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const categories = [
    {
        id: '1',
        title: 'Action / Adrenaline',
        subtitle: 'Move fast or lose!',
        icon: '⚡️',
        color: '#F44336',
        path: '/action-adrenaline-games'
    },
    {
        id: '2',
        title: 'Humor / Creativity',
        subtitle: 'Laugh, draw, and act!',
        icon: '😂',
        color: '#FF9800',
        path: '/humor-creativity-games'
    },
    {
        id: '3',
        title: 'Word / Mental',
        subtitle: 'Quick wits win!',
        icon: '💡',
        color: '#FFC107',
        path: '/word-mental-games'
    },
    {
        id: '4',
        title: 'Quick Competition',
        subtitle: 'Fast duels, instant fun.',
        icon: '🏁',
        color: '#4CAF50',
        path: '/quick-competition-games'
    },
    {
        id: '5',
        title: 'Social / Truth',
        subtitle: 'Talk, reveal, and connect.',
        icon: '💬',
        color: '#2196F3',
        path: '/social-truth-games'
    },
    {
        id: '6',
        title: 'Spicy / 18+ / Alcohol',
        subtitle: 'Play wild (adults only)!',
        icon: '🔥',
        color: '#9C27B0',
        path: '/spicy-games',
        disabled: false
    },
    {
        id: '7',
        title: 'Specials (Weekly / Festive) (Coming Soon)',
        subtitle: 'Limited-time party themes.',
        icon: '🎁',
        color: '#FF9800',
        path: null,
        disabled: true
    },
];

const Categories = () => {
    const router = useRouter();

    const renderCategory = ({ item }) => (
        <TouchableOpacity 
            style={[styles.card, { backgroundColor: item.color, opacity: item.disabled ? 0.5 : 1 }]} 
            onPress={() => !item.disabled && item.path && router.push(item.path)}
            disabled={item.disabled}
        >
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>What kind of fun are you in the mood for?</Text>
            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00AEEF',
        paddingTop: 50,
        paddingHorizontal: 10,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    list: {
        justifyContent: 'center',
    },
    card: {
        flex: 1,
        margin: 10,
        padding: 15,
        borderRadius: 20,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        minHeight: 150,
    },
    cardIcon: {
        fontSize: 24,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#fff',
    }
});

export default Categories;