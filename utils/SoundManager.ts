import { Audio } from 'expo-av';

// Sound file paths
const SOUNDS = {
    ui: {
        buttonClick: require('../assets/sounds/ui/click.mp3'),
        modalOpen: require('../assets/sounds/ui/modal-open.mp3'),
        modalClose: require('../assets/sounds/ui/modal-close.mp3'),
    },
    game: {
        correct: require('../assets/sounds/game/correct.mp3'),
        wrong: require('../assets/sounds/game/wrong.mp3'),
        victory: require('../assets/sounds/game/victory.mp3'),
        pop: require('../assets/sounds/game/pop.mp3'),
    },
};

class SoundManager {
    private sounds: { [key: string]: Audio.Sound } = {};
    private isMuted: boolean = false;
    private volume: number = 0.5; // Default 50%

    async initialize() {
        try {
            console.log('🔊 SoundManager: Starting initialization...');
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
            });
            console.log('✅ SoundManager: Audio mode set');

            // Preload all sounds
            await this.preloadSounds();
            console.log('✅ SoundManager: All sounds preloaded');
        } catch (error) {
            console.error('❌ SoundManager: Failed to initialize:', error);
        }
    }

    private async preloadSounds() {
        const soundEntries = [
            ['ui.buttonClick', SOUNDS.ui.buttonClick],
            ['ui.modalOpen', SOUNDS.ui.modalOpen],
            ['ui.modalClose', SOUNDS.ui.modalClose],
            ['game.correct', SOUNDS.game.correct],
            ['game.wrong', SOUNDS.game.wrong],
            ['game.victory', SOUNDS.game.victory],
            ['game.pop', SOUNDS.game.pop],
        ];

        console.log(`🔊 SoundManager: Loading ${soundEntries.length} sounds...`);

        for (const [key, source] of soundEntries) {
            try {
                console.log(`  Loading ${key}...`);
                const { sound } = await Audio.Sound.createAsync(source);
                await sound.setVolumeAsync(this.volume);
                this.sounds[key] = sound;
                console.log(`  ✅ ${key} loaded`);
            } catch (error) {
                console.error(`  ❌ Failed to load ${key}:`, error);
            }
        }
    }

    async play(soundKey: string) {
        if (this.isMuted) {
            console.log(`🔇 Sound ${soundKey} not played (muted)`);
            return;
        }

        try {
            const sound = this.sounds[soundKey];
            if (sound) {
                console.log(`🎵 Playing sound: ${soundKey}`);
                await sound.setPositionAsync(0); // Reset to start
                await sound.playAsync();
            } else {
                console.warn(`⚠️ Sound ${soundKey} not found in loaded sounds`);
            }
        } catch (error) {
            console.error(`❌ Failed to play sound ${soundKey}:`, error);
        }
    }

    async setVolume(volume: number) {
        this.volume = Math.max(0, Math.min(1, volume)); // Clamp 0-1

        // Update all loaded sounds
        for (const sound of Object.values(this.sounds)) {
            try {
                await sound.setVolumeAsync(this.volume);
            } catch (error) {
                console.error('Failed to set volume:', error);
            }
        }
    }

    setMuted(muted: boolean) {
        this.isMuted = muted;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    async cleanup() {
        for (const sound of Object.values(this.sounds)) {
            try {
                await sound.unloadAsync();
            } catch (error) {
                console.error('Failed to unload sound:', error);
            }
        }
        this.sounds = {};
    }
}

// Export singleton instance
export const soundManager = new SoundManager();

// Convenience functions
export const playSound = (soundKey: string) => soundManager.play(soundKey);
export const initializeSounds = () => soundManager.initialize();
export const setVolume = (volume: number) => soundManager.setVolume(volume);
export const toggleMute = () => soundManager.toggleMute();
export const setMuted = (muted: boolean) => soundManager.setMuted(muted);
