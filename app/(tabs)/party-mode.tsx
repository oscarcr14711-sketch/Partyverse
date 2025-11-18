import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { CategoryCard } from '../../components/CategoryCard';

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
    },
    {
        id: '7',
        title: 'Specials (Weekly / Festive)',
        subtitle: 'Limited-time party themes.',
        icon: '🎁',
        color: '#FF9800',
    },
];

type Category = {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    path?: string;
};

const PartyMode = () => {
    const router = useRouter();

    const renderCategory = ({ item }: { item: Category }) => (
        <CategoryCard
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            color={item.color}
            onPress={() => item.path && router.push(item.path as any)}
        />
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
    },
    list: {
        justifyContent: 'center',
    },
    // Removed old card button styles, now using CategoryCard component
});

export default PartyMode;