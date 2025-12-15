/**
 * PlayerStatsContext - Manages and persists player statistics
 * Tracks games played, wins, play time, and recent games
 */

import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import {
    DEFAULT_PLAYER_STATS,
    PlayerStats,
    RecentGame,
    storageService,
} from './StorageService';

// Generate unique ID for recent games
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Context type
interface PlayerStatsContextType {
    stats: PlayerStats;
    isLoading: boolean;
    recordGamePlayed: (gameName: string, result: 'won' | 'lost' | 'completed', icon: string) => void;
    addPlayTime: (minutes: number) => void;
    getFormattedPlayTime: () => string;
    resetStats: () => Promise<void>;
}

const PlayerStatsContext = createContext<PlayerStatsContextType | undefined>(undefined);

// Provider component
export function PlayerStatsProvider({ children }: { children: ReactNode }) {
    const [stats, setStats] = useState<PlayerStats>(DEFAULT_PLAYER_STATS);
    const [isLoading, setIsLoading] = useState(true);

    // Load stats on startup
    useEffect(() => {
        const loadStats = async () => {
            try {
                const savedStats = await storageService.loadPlayerStats();
                setStats(savedStats);
            } catch (error) {
                console.error('Failed to load player stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    // Save stats whenever they change (after initial load)
    useEffect(() => {
        if (!isLoading) {
            storageService.savePlayerStats(stats);
        }
    }, [stats, isLoading]);

    // Record a game being played
    const recordGamePlayed = useCallback((
        gameName: string,
        result: 'won' | 'lost' | 'completed',
        icon: string
    ) => {
        setStats(prevStats => {
            // Create recent game entry
            const recentGame: RecentGame = {
                id: generateId(),
                name: gameName,
                result,
                date: new Date().toISOString(),
                icon,
            };

            // Update game-specific stats
            const gameStats = prevStats.gameStats[gameName] || {
                timesPlayed: 0,
                wins: 0,
                losses: 0,
            };

            const updatedGameStats = {
                ...gameStats,
                timesPlayed: gameStats.timesPlayed + 1,
                wins: result === 'won' ? gameStats.wins + 1 : gameStats.wins,
                losses: result === 'lost' ? gameStats.losses + 1 : gameStats.losses,
            };

            // Keep only last 20 recent games
            const updatedRecentGames = [recentGame, ...prevStats.recentGames].slice(0, 20);

            return {
                ...prevStats,
                gamesPlayed: prevStats.gamesPlayed + 1,
                wins: result === 'won' ? prevStats.wins + 1 : prevStats.wins,
                lastPlayedAt: new Date().toISOString(),
                recentGames: updatedRecentGames,
                gameStats: {
                    ...prevStats.gameStats,
                    [gameName]: updatedGameStats,
                },
            };
        });
    }, []);

    // Add play time in minutes
    const addPlayTime = useCallback((minutes: number) => {
        setStats(prevStats => ({
            ...prevStats,
            playTimeMinutes: prevStats.playTimeMinutes + minutes,
        }));
    }, []);

    // Format play time as readable string
    const getFormattedPlayTime = useCallback(() => {
        const hours = Math.floor(stats.playTimeMinutes / 60);
        const minutes = stats.playTimeMinutes % 60;

        if (hours === 0) {
            return `${minutes}m`;
        } else if (minutes === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${minutes}m`;
        }
    }, [stats.playTimeMinutes]);

    // Reset all stats
    const resetStats = useCallback(async () => {
        setStats(DEFAULT_PLAYER_STATS);
        await storageService.savePlayerStats(DEFAULT_PLAYER_STATS);
    }, []);

    return (
        <PlayerStatsContext.Provider
            value={{
                stats,
                isLoading,
                recordGamePlayed,
                addPlayTime,
                getFormattedPlayTime,
                resetStats,
            }}
        >
            {children}
        </PlayerStatsContext.Provider>
    );
}

// Hook to use player stats
export function usePlayerStats() {
    const context = useContext(PlayerStatsContext);
    if (context === undefined) {
        throw new Error('usePlayerStats must be used within a PlayerStatsProvider');
    }
    return context;
}
