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

    // Volume controls (0-1 scale)
    private masterVolume: number = 0.75;
    private effectsVolume: number = 1.0;
    private musicVolume: number = 0.75;

    // Mute states
    private isEffectsMuted: boolean = false;
    private isMusicMuted: boolean = false;

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
                await sound.setVolumeAsync(this.getEffectiveVolume());
                this.sounds[key] = sound;
                console.log(`  ✅ ${key} loaded`);
            } catch (error) {
                console.error(`  ❌ Failed to load ${key}:`, error);
            }
        }
    }

    // Calculate effective volume for sound effects (master × effects)
    private getEffectiveVolume(): number {
        return this.masterVolume * this.effectsVolume;
    }

    async play(soundKey: string) {
        if (this.isEffectsMuted) {
            console.log(`🔇 Sound ${soundKey} not played (muted)`);
            return;
        }

        try {
            const sound = this.sounds[soundKey];
            if (sound) {
                console.log(`🎵 Playing sound: ${soundKey} at volume ${this.getEffectiveVolume()}`);
                await sound.setVolumeAsync(this.getEffectiveVolume());
                await sound.setPositionAsync(0); // Reset to start
                await sound.playAsync();
            } else {
                console.warn(`⚠️ Sound ${soundKey} not found in loaded sounds`);
            }
        } catch (error) {
            console.error(`❌ Failed to play sound ${soundKey}:`, error);
        }
    }

    // Master volume affects all sounds
    async setMasterVolume(volume: number) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        console.log(`🔊 Master volume set to ${Math.round(this.masterVolume * 100)}%`);
        await this.updateAllSoundVolumes();
    }

    // Effects volume (for UI and game sounds)
    async setEffectsVolume(volume: number) {
        this.effectsVolume = Math.max(0, Math.min(1, volume));
        console.log(`🎮 Effects volume set to ${Math.round(this.effectsVolume * 100)}%`);
        await this.updateAllSoundVolumes();
    }

    // Music volume (for background music - future use)
    setMusicVolume(volume: number) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        console.log(`🎵 Music volume set to ${Math.round(this.musicVolume * 100)}%`);
        // Will be used when background music is implemented
    }

    private async updateAllSoundVolumes() {
        const effectiveVolume = this.getEffectiveVolume();
        for (const sound of Object.values(this.sounds)) {
            try {
                await sound.setVolumeAsync(effectiveVolume);
            } catch (error) {
                console.error('Failed to set volume:', error);
            }
        }
    }

    // Mute/unmute sound effects
    setMuted(muted: boolean) {
        this.isEffectsMuted = muted;
        console.log(`🔊 Sound effects ${muted ? 'muted' : 'unmuted'}`);
    }

    // Mute/unmute music (for future use)
    setMusicMuted(muted: boolean) {
        this.isMusicMuted = muted;
        console.log(`🎵 Music ${muted ? 'muted' : 'unmuted'}`);
    }

    // Legacy method for backward compatibility
    async setVolume(volume: number) {
        await this.setMasterVolume(volume);
    }

    toggleMute() {
        this.isEffectsMuted = !this.isEffectsMuted;
        return this.isEffectsMuted;
    }

    // Getters for current values
    getMasterVolume(): number { return this.masterVolume; }
    getEffectsVolume(): number { return this.effectsVolume; }
    getMusicVolume(): number { return this.musicVolume; }
    isMuted(): boolean { return this.isEffectsMuted; }

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
export const setMasterVolume = (volume: number) => soundManager.setMasterVolume(volume);
export const setEffectsVolume = (volume: number) => soundManager.setEffectsVolume(volume);
export const setMusicVolume = (volume: number) => soundManager.setMusicVolume(volume);
export const toggleMute = () => soundManager.toggleMute();
export const setMuted = (muted: boolean) => soundManager.setMuted(muted);
export const setMusicMuted = (muted: boolean) => soundManager.setMusicMuted(muted);

