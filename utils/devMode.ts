// Dev mode check - returns true if in development mode
export const isDevMode = (): boolean => {
    // Temporarily disabled to show locked UI for testing
    // Change back to: return __DEV__; when ready
    return false;
};

// Game lock status
export const isGameLocked = (gameId: string): boolean => {
    // If in dev mode, nothing is locked for you
    if (isDevMode()) return false;

    const lockedGames = [
        // Quick Competition - all games locked
        'quick-competition',

        // Social/Truth - all games locked
        'social-truth',

        // Specific locked games
        'drink-domino',
        'party-board',
        'hot-cup-spin',
    ];

    return lockedGames.includes(gameId);
};

// Category lock status
export const isCategoryLocked = (categoryId: string): boolean => {
    if (isDevMode()) return false;

    const lockedCategories = [
        'quick-competition',
        'social-truth',
        'specials',
    ];

    return lockedCategories.includes(categoryId);
};
