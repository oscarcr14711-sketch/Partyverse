/**
 * StorageService - Centralized AsyncStorage wrapper for persistent data
 * Handles saving and loading app data across sessions
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
    THEME_ID: '@partyverse/theme_id',
    PLAYER_STATS: '@partyverse/player_stats',
    ACHIEVEMENTS: '@partyverse/achievements',
    SETTINGS: '@partyverse/settings',
    CARD_BACK_ID: '@partyverse/card_back_id',
} as const;

// Type definitions
export interface RecentGame {
    id: string;
    name: string;
    result: 'won' | 'lost' | 'completed';
    date: string;
    icon: string;
}

export interface GameStats {
    timesPlayed: number;
    wins: number;
    losses: number;
}

export interface PlayerStats {
    gamesPlayed: number;
    wins: number;
    playTimeMinutes: number;
    lastPlayedAt: string | null;
    recentGames: RecentGame[];
    gameStats: { [gameName: string]: GameStats };
}

export interface AppSettings {
    soundEnabled: boolean;
    musicEnabled: boolean;
    hapticsEnabled: boolean;
    masterVolume: number;
    soundEffectsVolume: number;
    musicVolume: number;
    notificationsEnabled: boolean;
    selectedLanguage: string;
}

// Default values
export const DEFAULT_PLAYER_STATS: PlayerStats = {
    gamesPlayed: 0,
    wins: 0,
    playTimeMinutes: 0,
    lastPlayedAt: null,
    recentGames: [],
    gameStats: {},
};

export const DEFAULT_SETTINGS: AppSettings = {
    soundEnabled: true,
    musicEnabled: true,
    hapticsEnabled: true,
    masterVolume: 75,
    soundEffectsVolume: 100,
    musicVolume: 75,
    notificationsEnabled: true,
    selectedLanguage: 'English',
};

/**
 * StorageService class - provides methods for persistent storage
 */
class StorageService {
    /**
     * Save data to AsyncStorage
     */
    async saveData<T>(key: string, data: T): Promise<boolean> {
        try {
            const jsonValue = JSON.stringify(data);
            await AsyncStorage.setItem(key, jsonValue);
            return true;
        } catch (error) {
            console.error(`StorageService: Error saving data for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Load data from AsyncStorage
     */
    async loadData<T>(key: string, defaultValue: T): Promise<T> {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            if (jsonValue === null) {
                return defaultValue;
            }
            return JSON.parse(jsonValue) as T;
        } catch (error) {
            console.error(`StorageService: Error loading data for key ${key}:`, error);
            return defaultValue;
        }
    }

    /**
     * Remove data from AsyncStorage
     */
    async removeData(key: string): Promise<boolean> {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`StorageService: Error removing data for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Clear all app data
     */
    async clearAllData(): Promise<boolean> {
        try {
            const keys = Object.values(STORAGE_KEYS);
            await AsyncStorage.multiRemove(keys);
            return true;
        } catch (error) {
            console.error('StorageService: Error clearing all data:', error);
            return false;
        }
    }

    // ============ Theme Methods ============

    async saveTheme(themeId: string): Promise<boolean> {
        return this.saveData(STORAGE_KEYS.THEME_ID, themeId);
    }

    async loadTheme(): Promise<string> {
        return this.loadData(STORAGE_KEYS.THEME_ID, 'default');
    }

    // ============ Player Stats Methods ============

    async savePlayerStats(stats: PlayerStats): Promise<boolean> {
        return this.saveData(STORAGE_KEYS.PLAYER_STATS, stats);
    }

    async loadPlayerStats(): Promise<PlayerStats> {
        return this.loadData(STORAGE_KEYS.PLAYER_STATS, DEFAULT_PLAYER_STATS);
    }

    // ============ Achievements Methods ============

    async saveAchievements(unlockedIds: string[]): Promise<boolean> {
        return this.saveData(STORAGE_KEYS.ACHIEVEMENTS, unlockedIds);
    }

    async loadAchievements(): Promise<string[]> {
        return this.loadData(STORAGE_KEYS.ACHIEVEMENTS, []);
    }

    // ============ Settings Methods ============

    async saveSettings(settings: AppSettings): Promise<boolean> {
        return this.saveData(STORAGE_KEYS.SETTINGS, settings);
    }

    async loadSettings(): Promise<AppSettings> {
        return this.loadData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }

    // ============ Card Back Methods ============

    async saveCardBack(cardBackId: string): Promise<boolean> {
        return this.saveData(STORAGE_KEYS.CARD_BACK_ID, cardBackId);
    }

    async loadCardBack(): Promise<string> {
        return this.loadData(STORAGE_KEYS.CARD_BACK_ID, 'default');
    }
}

// Export singleton instance
export const storageService = new StorageService();
