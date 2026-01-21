import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { storageService } from './StorageService';

// Theme definitions
export interface Theme {
    id: string;
    name: string;
    // Tab bar colors
    tabBar: {
        background: string;
        activeColor: string;
        inactiveColor: string;
    };
    // Button colors
    buttons: {
        primary: [string, string]; // gradient
        secondary: [string, string];
    };
    // Category backgrounds (paths to images)
    categoryBackgrounds: {
        wordMental: any;
        actionAdrenaline: any;
        humorCreativity: any;
        spicy: any;
        gamesMenu: any;
    } | null;
    // Home screen
    home: {
        gradient: string[];
    };
    // Overlay animation (snow, confetti, etc.)
    overlayAnimation: any | null;
}

// Default theme (current app theme)
export const DEFAULT_THEME: Theme = {
    id: 'default',
    name: 'Default',
    tabBar: {
        background: '#1A1A1A', // Original dark grey
        activeColor: '#00E5FF', // Original neon cyan
        inactiveColor: '#666666',
    },
    buttons: {
        primary: ['#22c55e', '#16a34a'],
        secondary: ['#fb7185', '#ef4444'],
    },
    categoryBackgrounds: null, // Uses default backgrounds
    home: {
        gradient: ['#2196F3', '#F44336'], // Blue to Red
    },
    overlayAnimation: null, // Uses default confetti
};

// Christmas theme
export const CHRISTMAS_THEME: Theme = {
    id: 'christmas',
    name: 'Christmas',
    tabBar: {
        background: '#1a3c34', // Dark green
        activeColor: '#ff4757', // Christmas red
        inactiveColor: '#2ed573', // Christmas green
    },
    buttons: {
        primary: ['#ff4757', '#c0392b'], // Christmas red gradient
        secondary: ['#2ed573', '#27ae60'], // Christmas green gradient
    },
    categoryBackgrounds: {
        wordMental: require('../assets/images/christmas_word_mental_bg.png'),
        actionAdrenaline: require('../assets/images/christmas_action_bg.png'),
        humorCreativity: require('../assets/images/christmasrink.png'),
        spicy: require('../assets/images/christmasspicy.png'),
        gamesMenu: require('../assets/images/christmasparty.png'),
    },
    home: {
        gradient: ['#c0392b', '#27ae60'], // Red to green
    },
    overlayAnimation: require('../assets/animations/Snow Off white.json'), // Snow animation
};

// Valentine's Day theme
export const VALENTINE_THEME: Theme = {
    id: 'valentine',
    name: 'Valentine\'s Day',
    tabBar: {
        background: '#4a1a2c', // Deep romantic burgundy
        activeColor: '#ff6b9d', // Hot pink
        inactiveColor: '#ffb3d9', // Light pink
    },
    buttons: {
        primary: ['#ff6b9d', '#c9184a'], // Pink to rose gradient
        secondary: ['#ff758f', '#ff4d6d'], // Warm pink gradient
    },
    categoryBackgrounds: {
        wordMental: require('../assets/images/Background/hcandy.jpeg'),
        actionAdrenaline: require('../assets/images/Background/picnic.png'),
        humorCreativity: require('../assets/images/Background/paris.png'),
        spicy: require('../assets/images/Background/cupid.png'),
        gamesMenu: require('../assets/images/Background/dinner.png'),
    },
    home: {
        gradient: ['#ff6b9d', '#c9184a'], // Pink to rose
    },
    overlayAnimation: require('../assets/animations/Heart Lottie Animation.json'), // Heart animation
};

// All available themes
export const THEMES: { [key: string]: Theme } = {
    default: DEFAULT_THEME,
    christmas: CHRISTMAS_THEME,
    valentine: VALENTINE_THEME,
};

// Theme context type
interface ThemeContextType {
    theme: Theme;
    themeId: string;
    setTheme: (themeId: string) => void;
    ownedThemes: string[];
    addOwnedTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeId, setThemeId] = useState<string>('default');
    const [ownedThemes, setOwnedThemes] = useState<string[]>(['default', 'christmas', 'valentine']); // Default, Christmas, and Valentine are always available
    const [isLoading, setIsLoading] = useState(true);

    // Load saved theme on startup
    useEffect(() => {
        const loadSavedTheme = async () => {
            try {
                const savedTheme = await storageService.loadTheme();
                // Only apply saved theme if it exists in THEMES and is owned
                if (savedTheme && THEMES[savedTheme] && ownedThemes.includes(savedTheme)) {
                    setThemeId(savedTheme);
                }
            } catch (error) {
                console.error('Failed to load saved theme:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSavedTheme();
    }, []);

    const theme = THEMES[themeId] || DEFAULT_THEME;

    const setTheme = (newThemeId: string) => {
        if (ownedThemes.includes(newThemeId) && THEMES[newThemeId]) {
            setThemeId(newThemeId);
            // Save the theme when user explicitly changes it
            storageService.saveTheme(newThemeId);
        }
    };

    const addOwnedTheme = (themeId: string) => {
        if (!ownedThemes.includes(themeId)) {
            setOwnedThemes([...ownedThemes, themeId]);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, themeId, setTheme, ownedThemes, addOwnedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Hook to use theme
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
