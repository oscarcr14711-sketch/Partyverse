import { useEffect, useRef } from 'react';
import { useAchievements } from './AchievementContext';
import { usePlayerStats } from './PlayerStatsContext';

/**
 * Achievement checker hook that monitors stats and unlocks achievements
 * Call this at the app root level to enable automatic achievement unlocking
 */
export const useAchievementChecker = () => {
    const { stats } = usePlayerStats();
    const { unlockAchievement, isUnlocked } = useAchievements();
    const lastCheckRef = useRef<string>('');

    useEffect(() => {
        // Create a signature of current stats to avoid redundant checks
        const statsSignature = JSON.stringify(stats);
        if (statsSignature === lastCheckRef.current) {
            return;
        }
        lastCheckRef.current = statsSignature;

        checkAchievements();
    }, [stats]);

    const checkAchievements = async () => {
        // FIRST PLAY ACHIEVEMENTS - Check each game
        const gameAchievementMap: Record<string, string> = {
            'Hot Bomb': 'first_hot_bomb',
            'Stack Tower': 'first_stack_tower',
            'Lightning Rounds': 'first_lightning',
            "Don't Let It PIC You": 'first_pic_you',
            'Blown Away': 'first_blown_away',
            'Brain Buzzer': 'first_brain_buzzer',
            'Brain vs Brain': 'first_brain_vs_brain',
            'Memory Rush': 'first_memory_rush',
            'Phrase Master': 'first_phrase_master',
            'Stop Game': 'first_stop_game',
            'Color Clash': 'first_color_clash',
            'Ride the Bus': 'first_ride_bus',
            'Mic Madness': 'first_mic_madness',
            'Lip Sync': 'first_lip_sync',
            'If You Laugh': 'first_laugh',
            'Truth or Bluff': 'first_truth_bluff',
            'Extreme Roulette': 'first_extreme',
        };

        Object.entries(gameAchievementMap).forEach(([gameName, achievementId]) => {
            if (stats.gameStats[gameName]?.timesPlayed >= 1) {
                unlockAchievement(achievementId);
            }
        });

        // MASTERY ACHIEVEMENTS - Win counters
        const brainBuzzerWins = stats.gameStats['Brain Buzzer']?.wins || 0;
        if (brainBuzzerWins >= 5) {
            unlockAchievement('master_trivia');
        }

        // Card games (Color Clash + Ride the Bus)
        const cardWins = (stats.gameStats['Color Clash']?.wins || 0) +
            (stats.gameStats['Ride the Bus']?.wins || 0);
        if (cardWins >= 5) {
            unlockAchievement('master_cards');
        }

        // Creativity games (Mic Madness + Lip Sync + If You Laugh)
        const creativityWins = (stats.gameStats['Mic Madness']?.wins || 0) +
            (stats.gameStats['Lip Sync']?.wins || 0) +
            (stats.gameStats['If You Laugh']?.wins || 0);
        if (creativityWins >= 5) {
            unlockAchievement('master_creativity');
        }

        // Action games (Hot Bomb + Stack Tower + Blown Away + Lightning Rounds + PIC You)
        const actionWins = (stats.gameStats['Hot Bomb']?.wins || 0) +
            (stats.gameStats['Stack Tower']?.wins || 0) +
            (stats.gameStats['Blown Away']?.wins || 0) +
            (stats.gameStats['Lightning Rounds']?.wins || 0) +
            (stats.gameStats["Don't Let It PIC You"]?.wins || 0);
        if (actionWins >= 5) {
            unlockAchievement('master_action');
        }

        // Memory Rush specific
        const memoryWins = stats.gameStats['Memory Rush']?.wins || 0;
        if (memoryWins >= 5) {
            unlockAchievement('master_memory');
        }

        // SOCIAL ACHIEVEMENTS
        if (stats.gamesPlayed >= 10) {
            unlockAchievement('party_starter');
        }

        // Count unique games played
        const uniqueGames = Object.keys(stats.gameStats).length;
        if (uniqueGames >= 10) {
            unlockAchievement('explorer');
        }

        // SPECIAL ACHIEVEMENTS
        if (stats.wins >= 20) {
            unlockAchievement('champion');
        }

        // Play time based
        if (stats.playTimeMinutes >= 60) {
            unlockAchievement('marathon');
        }

        // Check time-based achievements
        const now = new Date();
        const hour = now.getHours();

        // Night Owl - playing past midnight (12 AM - 5 AM)
        if (hour >= 0 && hour < 5) {
            unlockAchievement('night_owl');
        }

        // Weekend Warrior - playing on Saturday
        if (now.getDay() === 6) {
            unlockAchievement('weekend_warrior');
        }

        // Check recent games for streak detection
        if (stats.recentGames.length >= 3) {
            const lastThree = stats.recentGames.slice(0, 3);
            const allWins = lastThree.every(game => game.result === 'won');
            if (allWins) {
                unlockAchievement('lucky_streak');
            }

            // Comeback kid - win after 2+ losses
            if (lastThree[0].result === 'won' &&
                lastThree[1].result === 'lost' &&
                lastThree[2].result === 'lost') {
                unlockAchievement('comeback_kid');
            }
        }

        // Multi-player and social achievements would need game-specific tracking
        // For now, unlock social_butterfly and crowd_pleaser based on total games
        if (stats.gamesPlayed >= 5) {
            unlockAchievement('social_butterfly');
        }

        if (stats.gamesPlayed >= 3) {
            const truthBluffPlays = stats.gameStats['Truth or Bluff']?.timesPlayed || 0;
            if (truthBluffPlays >= 3) {
                unlockAchievement('ice_breaker');
            }
        }
    };

    return null; // This is a passive hook
};
