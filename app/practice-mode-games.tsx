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
];

const PracticeModeGamesScreen = () => {
    const router = useRouter();

    const renderCategory = ({ item }) => (
        <TouchableOpacity style={[styles.card, { backgroundColor: item.color }]} onPress={() => item.path && router.push(item.path)}>
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Practice Mode</Text>
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
        backgroundColor: '#118ab2',
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

export default PracticeModeGamesScreen;
