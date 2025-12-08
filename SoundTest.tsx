import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function SoundTest() {
    const [status, setStatus] = useState('Not tested');

    const testSound = async () => {
        try {
            setStatus('Loading sound...');
            const { sound } = await Audio.Sound.createAsync(
                require('./assets/sounds/ui/click.wav')
            );
            setStatus('Sound loaded! Playing...');
            await sound.playAsync();
            setStatus('Sound played!');
        } catch (error) {
            setStatus(`Error: ${error.message}`);
            console.error('Sound test error:', error);
        }
    };

    useEffect(() => {
        // Auto-test on mount
        testSound();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sound Test</Text>
            <Text style={styles.status}>{status}</Text>
            <Button title="Test Click Sound" onPress={testSound} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    status: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
});
