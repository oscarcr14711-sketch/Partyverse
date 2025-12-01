import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BrainBuzzerGame() {
    const router = useRouter();
    const { numPlayers } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Brain Buzzer Game</Text>
            <Text style={styles.subtitle}>Players: {numPlayers}</Text>
            <Text style={styles.text}>Game logic coming soon!</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.back()}
            >
                <Text style={styles.buttonText}>GO BACK</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#18304A',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFC107',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 20,
        color: 'white',
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        color: '#ccc',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#FFC107',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#18304A',
    },
});
