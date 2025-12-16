import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ACHIEVEMENTS, Achievement } from '../data/achievements';

const STORAGE_KEY = '@partyverse_achievements';

interface AchievementContextType {
    achievements: Achievement[];
    unlockAchievement: (achievementId: string) => Promise<void>;
    isUnlocked: (achievementId: string) => boolean;
    getUnlockedCount: () => number;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);

    // Load achievements from AsyncStorage on mount
    useEffect(() => {
        loadAchievements();
    }, []);

    const loadAchievements = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const unlockedIds: string[] = JSON.parse(stored);
                setAchievements(prevAchievements =>
                    prevAchievements.map(achievement => ({
                        ...achievement,
                        unlocked: unlockedIds.includes(achievement.id)
                    }))
                );
            }
        } catch (error) {
            console.error('Failed to load achievements:', error);
        }
    };

    const saveAchievements = async (unlockedIds: string[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedIds));
        } catch (error) {
            console.error('Failed to save achievements:', error);
        }
    };

    const unlockAchievement = async (achievementId: string) => {
        const achievement = achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlocked) {
            return; // Already unlocked or doesn't exist
        }

        const updatedAchievements = achievements.map(a =>
            a.id === achievementId ? { ...a, unlocked: true } : a
        );
        setAchievements(updatedAchievements);

        const unlockedIds = updatedAchievements.filter(a => a.unlocked).map(a => a.id);
        await saveAchievements(unlockedIds);
    };

    const isUnlocked = (achievementId: string): boolean => {
        return achievements.find(a => a.id === achievementId)?.unlocked || false;
    };

    const getUnlockedCount = (): number => {
        return achievements.filter(a => a.unlocked).length;
    };

    return (
        <AchievementContext.Provider value={{
            achievements,
            unlockAchievement,
            isUnlocked,
            getUnlockedCount
        }}>
            {children}
        </AchievementContext.Provider>
    );
};

export const useAchievements = () => {
    const context = useContext(AchievementContext);
    if (!context) {
        throw new Error('useAchievements must be used within AchievementProvider');
    }
    return context;
};
