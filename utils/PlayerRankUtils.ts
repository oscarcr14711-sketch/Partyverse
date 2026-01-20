/**
 * PlayerRankUtils - Dynamic player ranking system
 * Calculates player rank and level based on achievements unlocked and games played
 */

export interface RankInfo {
    rankName: string;
    level: number;
    nextRankName: string | null;
    progressToNextRank: number; // 0-100
}

export interface RankTier {
    name: string;
    minLevel: number;
    maxLevel: number;
    minAchievements: number;
    minGamesPlayed: number;
}

export const RANK_TIERS: RankTier[] = [
    {
        name: 'Party Beginner',
        minLevel: 1,
        maxLevel: 5,
        minAchievements: 0,
        minGamesPlayed: 0,
    },
    {
        name: 'Party Starter',
        minLevel: 6,
        maxLevel: 10,
        minAchievements: 5,
        minGamesPlayed: 10,
    },
    {
        name: 'Party Enthusiast',
        minLevel: 11,
        maxLevel: 15,
        minAchievements: 10,
        minGamesPlayed: 25,
    },
    {
        name: 'Party Expert',
        minLevel: 16,
        maxLevel: 20,
        minAchievements: 15,
        minGamesPlayed: 50,
    },
    {
        name: 'Party Master',
        minLevel: 21,
        maxLevel: 25,
        minAchievements: 20,
        minGamesPlayed: 100,
    },
    {
        name: 'Party Legend',
        minLevel: 26,
        maxLevel: 30,
        minAchievements: 25,
        minGamesPlayed: 200,
    },
    {
        name: 'Party King',
        minLevel: 31,
        maxLevel: 999,
        minAchievements: 30,
        minGamesPlayed: 500,
    },
];

/**
 * Calculate player level based on achievements and games played
 * Formula: Level = 1 + (achievements unlocked * 1) + (games played / 10)
 */
export function calculatePlayerLevel(
    achievementsUnlocked: number,
    gamesPlayed: number
): number {
    const baseLevel = 1;
    const achievementBonus = achievementsUnlocked * 1;
    const gameBonus = Math.floor(gamesPlayed / 10);

    return Math.max(1, baseLevel + achievementBonus + gameBonus);
}

/**
 * Get the rank tier for a given level, achievements, and games played
 */
export function getRankTier(
    level: number,
    achievementsUnlocked: number,
    gamesPlayed: number
): RankTier {
    // Start from the highest tier and work down
    for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
        const tier = RANK_TIERS[i];

        // Check if player meets the requirements for this tier
        if (
            level >= tier.minLevel &&
            (achievementsUnlocked >= tier.minAchievements || gamesPlayed >= tier.minGamesPlayed)
        ) {
            return tier;
        }
    }

    // Default to first tier (Party Beginner)
    return RANK_TIERS[0];
}

/**
 * Get comprehensive rank information for display
 */
export function getPlayerRankInfo(
    achievementsUnlocked: number,
    gamesPlayed: number
): RankInfo {
    const level = calculatePlayerLevel(achievementsUnlocked, gamesPlayed);
    const currentTier = getRankTier(level, achievementsUnlocked, gamesPlayed);

    // Find next tier
    const currentTierIndex = RANK_TIERS.findIndex(t => t.name === currentTier.name);
    const nextTier = currentTierIndex < RANK_TIERS.length - 1
        ? RANK_TIERS[currentTierIndex + 1]
        : null;

    // Calculate progress to next rank (based on level)
    let progressToNextRank = 100;
    if (nextTier) {
        const levelsInCurrentTier = currentTier.maxLevel - currentTier.minLevel + 1;
        const currentLevelInTier = level - currentTier.minLevel;
        progressToNextRank = Math.min(100, (currentLevelInTier / levelsInCurrentTier) * 100);
    }

    return {
        rankName: currentTier.name,
        level,
        nextRankName: nextTier?.name || null,
        progressToNextRank: Math.round(progressToNextRank),
    };
}
