// Card back designs for Color Clash, Ride the Bus, and Mic Madness games
// deck1.png is the default (free), deck2-7 are premium (in Card Backs Pack)

export interface CardBack {
    id: string;
    name: string;
    image: any;
    isPremium: boolean;
}

export const CARD_BACKS: CardBack[] = [
    {
        id: 'default',
        name: 'Partyverse Classic',
        image: require('../assets/images/deck1.png'),
        isPremium: false,
    },
    {
        id: 'neon',
        name: 'Neon Party',
        image: require('../assets/images/deck2.png'),
        isPremium: false, // Free for testing
    },
    {
        id: 'galaxy',
        name: 'Galaxy',
        image: require('../assets/images/deck3.png'),
        isPremium: false, // Free for testing
    },
    {
        id: 'casino',
        name: 'Casino Gold',
        image: require('../assets/images/deck4.png'),
        isPremium: false, // Free for testing
    },
    {
        id: 'flames',
        name: 'Flames',
        image: require('../assets/images/deck5.png'),
        isPremium: false, // Free for testing
    },
    {
        id: 'holographic',
        name: 'Holographic',
        image: require('../assets/images/deck6.png'),
        isPremium: false, // Free for testing
    },
    {
        id: 'mystery',
        name: 'Mystery',
        image: require('../assets/images/deck7.png'),
        isPremium: false, // Free for testing
    },
];

// FOR TESTING: Change this number (0-6) to test different card backs
// 0 = Partyverse Classic (deck1)
// 1 = Neon Party (deck2)
// 2 = Galaxy (deck3)
// 3 = Casino Gold (deck4)
// 4 = Flames (deck5)
// 5 = Holographic (deck6)
// 6 = Mystery (deck7)
export const SELECTED_CARD_BACK_INDEX = 1;

// Helper to get card back by ID
export const getCardBackById = (id: string): CardBack => {
    return CARD_BACKS.find(cb => cb.id === id) || CARD_BACKS[0];
};

// Get the currently selected card back for games
export const getSelectedCardBack = (): CardBack => {
    return CARD_BACKS[SELECTED_CARD_BACK_INDEX] || CARD_BACKS[0];
};
