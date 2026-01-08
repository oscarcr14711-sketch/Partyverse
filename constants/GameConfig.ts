import { ImageSourcePropType } from 'react-native';

export interface GameConfig {
    id: string;
    name: string; // Used for analytics or fallback title
    backgroundColor: string; // Main background color
    accentColor: string; // Button/Accent color
    backgroundImage?: ImageSourcePropType;
    logoImage?: ImageSourcePropType;
    gameImage?: ImageSourcePropType;
    gameImageResizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center'; // How to resize the game image
    gameImageSize?: { width: number; height: number }; // Custom size for game image
    gameImageMarginTop?: number; // Top margin for game image
    gameImageMarginLeft?: number; // Left margin for game image
    logoMarginTop?: number; // Top margin for logo (default is 30)
    logoMarginLeft?: number; // Left margin for logo
    minPlayers: number;
    maxPlayers: number;
    defaultPlayers: number; // Initial player count
    gameRoute: string; // Route to push when game starts
    startButtonText?: string; // Defaults to 'Start Game'
    hidePlayerSelection?: boolean;
    generatePlayers?: boolean;
    defaultParams?: Record<string, any>;
    startAlert?: {
        title: string;
        message: string;
        cancelText: string;
        confirmText: string;
    };
    rules: {
        title: string;
        sections: {
            title: string;
            content: string;
        }[];
    };
}

export const GAMES_CONFIG: Record<string, GameConfig> = {
    'hot-bomb': {
        id: 'hot-bomb',
        name: 'Hot Bomb',
        backgroundColor: '#D84315',
        accentColor: '#FFB300',
        backgroundImage: require('../assets/images/Newhotbomb.png'),
        logoImage: require('../assets/images/gameLogos/Hotbomblogo.png'),
        minPlayers: 2,
        maxPlayers: 10,
        defaultPlayers: 3,
        gameRoute: '/hot-bomb-game',
        startButtonText: 'START',
        rules: {
            title: 'How to Play',
            sections: [
                { title: '🎯 Objective', content: 'Pass the bomb before it explodes!' },
                { title: '🎮 How It Works', content: '• The bomb has a random timer\n• Pass the phone to another player\n• Whoever is holding it when it explodes loses!\n• Stay calm under pressure!' },
                { title: '💣 Tips', content: 'Watch the intensity - the bomb shakes as time runs out!' },
            ],
        },
    },
    'blown-away': {
        id: 'blown-away',
        name: 'Blown Away',
        backgroundColor: '#5DADE2',
        accentColor: '#E74C3C',
        gameImage: require('../assets/images/gameLogos/BlownLogo.png'),
        gameImageResizeMode: 'contain',
        minPlayers: 2,
        maxPlayers: 6,
        defaultPlayers: 3,
        gameRoute: '/blown-away',
        startButtonText: 'START',
        rules: {
            title: 'How to Play',
            sections: [
                { title: '🎯 Objective', content: 'Blow up balloons as much as you can without popping!' },
                { title: '🎈 How It Works', content: '• Blow into the microphone\n• Bigger balloon = more points\n• Press "Stop Blowing" to lock in points\n• If it pops, you lose those points!' },
                { title: '🏆 Tips', content: 'Risk vs reward - know when to stop!' },
            ],
        },
    },
    'truth-or-bluff': {
        id: 'truth-or-bluff',
        name: 'Truth or Bluff',
        backgroundColor: '#e6d8f7',
        accentColor: '#6c5ce7',
        logoImage: require('../assets/images/gameLogos/truthlogo.png'),
        gameImage: require('../assets/images/Truthorbluff.png'),
        gameImageResizeMode: 'contain',
        minPlayers: 2,
        maxPlayers: 6,
        defaultPlayers: 2,
        gameRoute: '/truth-or-bluff-game',
        startButtonText: 'START',
        rules: {
            title: 'How to Play',
            sections: [
                { title: '🎯 Objective', content: "Read statements and guess if they're TRUTH or BLUFF!" },
                { title: '🎮 How It Works', content: '• One player reads a statement\n• Others vote Truth or Bluff\n• Reveal the answer\n• Points for correct guesses!' },
                { title: '🏆 Strategy', content: "Keep a poker face when it's your turn to fool others!" },
            ],
        },
    },
    'if-you-laugh-you-lose': {
        id: 'if-you-laugh-you-lose',
        name: 'If You Laugh You Lose',
        backgroundColor: '#18304A',
        accentColor: '#8B4C1B',
        backgroundImage: require('../assets/images/laughbg.png'),
        logoImage: require('../assets/images/gameLogos/ifyoulaughlogo.png'),
        gameImage: require('../assets/images/laugh.png'),
        gameImageResizeMode: 'contain',
        minPlayers: 2,
        maxPlayers: 6,
        defaultPlayers: 2,
        gameRoute: '/if-you-laugh-game',
        startButtonText: 'START',
        rules: {
            title: 'How to Play',
            sections: [
                { title: '🎯 Objective', content: "Don't laugh! The first to crack loses." },
                { title: '🎮 How It Works', content: '• Round 1: Read jokes and try not to laugh\n• Round 2: Face-off challenges - make faces and do impressions\n• Keep a straight face to win!' },
                { title: '🏆 Scoring', content: 'Lose a point when you laugh. Last player standing wins!' },
            ],
        },
    },
    'mic-madness': {
        id: 'mic-madness',
        name: 'Mic Madness',
        backgroundColor: '#114D2D',
        accentColor: '#263238',
        logoImage: require('../assets/images/gameLogos/micmadnesslogo.png'),
        gameImage: require('../assets/images/micmadness.png'),
        gameImageResizeMode: 'contain',
        minPlayers: 2,
        maxPlayers: 6,
        defaultPlayers: 3,
        gameRoute: '/mic-madness-game',
        startButtonText: 'Next',
        rules: {
            title: 'How to Play',
            sections: [
                { title: '🎯 Objective', content: 'Race to grab the mic first and sing the word!' },
                { title: '🎤 How It Works', content: "• A word appears on screen\n• Compete to grab the mic first\n• Sing or say the word into the mic\n• First to sing it wins the round!" },
                { title: '🏆 Tips', content: 'Be fast, be loud, and be the first to sing!' },
            ],
        },
    },
    'stack-tower': {
        id: 'stack-tower',
        name: 'Stack Tower',
        backgroundColor: '#87CEEB',
        accentColor: '#8B4513',
        logoImage: require('../assets/images/gameLogos/stacktowerlogo.png'),
        gameImage: require('../assets/images/stack2.png'),
        minPlayers: 1,
        maxPlayers: 6,
        defaultPlayers: 2,
        gameRoute: '/stack-tower-setup',
        startButtonText: 'START GAME',
        rules: {
            title: 'How to Play',
            sections: [
                { title: '🎯 Objective', content: 'Remove blocks from the tower and stack them on top without making the tower collapse!' },
                { title: '🎮 How to Play', content: "1. Swipe to rotate the camera view\n2. Tap any block to grab it\n3. Drag the block around\n4. Release to place it on top\n5. Take turns with other players" },
                { title: '⚠ Be Careful!', content: "• Removing bottom blocks is risky!\n• Tower collapses when unstable\n• Don't remove too many from one level" },
            ],
        },
    },
    'lightning-rounds': {
        id: 'lightning-rounds',
        name: 'Lightning Rounds',
        backgroundColor: '#b99e66',
        accentColor: '#f8961e',
        logoImage: require('../assets/images/gameLogos/lightingroundslogo.png'),
        gameImage: require('../assets/images/NewLightrounds.png'),
        gameImageResizeMode: 'contain',
        gameImageSize: { width: 420, height: 420 },
        gameImageMarginTop: 20,
        gameImageMarginLeft: 10,
        logoMarginTop: 0,
        minPlayers: 2,
        maxPlayers: 8,
        defaultPlayers: 4,
        gameRoute: '/lightning-rounds-game',
        startButtonText: 'START GAME',
        generatePlayers: true,
        rules: {
            title: 'How to Play',
            sections: [
                { title: '⚡ Objective', content: 'Complete physical challenges faster than everyone else! Last person to finish gets a STRIKE.' },
                { title: '🎮 How It Works', content: "• A challenge appears on screen\n• Everyone races to complete it\n• Phone holder taps when someone is last\n• That player gets a STRIKE" },
                { title: '🏆 Winning', content: "• 3 strikes and you're eliminated\n• Last player standing wins!" },
            ],
        },
    },
    'pic-you': {
        id: 'pic-you',
        name: "Don't Let It Pic You",
        backgroundColor: '#1a3a5c',
        accentColor: '#1a3a5c',
        logoImage: require('../assets/images/gameLogos/dontletitpiclogo.png'),
        gameImage: require('../assets/images/picyou.png'),
        gameImageResizeMode: 'contain',
        minPlayers: 2,
        maxPlayers: 8,
        defaultPlayers: 2,
        gameRoute: '/dont-let-it-pic-you-game',
        startButtonText: 'START GAME',
        hidePlayerSelection: true,
        rules: {
            title: 'How to Play',
            sections: [
                { title: '🎯 Objective', content: 'Avoid being caught in photos! One player is the photographer, others must hide.' },
                { title: '📱 Game Flow', content: "1. One player becomes the photographer\n2. Other players must hide or cover their faces\n3. Photographer counts down and takes a photo\n4. Anyone caught in the photo gets a point" },
                { title: '⚡ Tips', content: 'Move quickly when the countdown starts!' },
            ],
        },
    },
    'color-clash': {
        id: 'color-clash',
        name: 'Color Clash',
        backgroundColor: '#000000',
        accentColor: '#E74C3C',
        logoImage: require('../assets/images/gameLogos/Colorclashlogo.png'),
        gameImage: require('../assets/images/clash.png'),
        gameImageResizeMode: 'contain',
        gameImageSize: { width: 310, height: 310 },
        gameImageMarginTop: 120,
        gameImageMarginLeft: 80,
        minPlayers: 2,
        maxPlayers: 8,
        defaultPlayers: 2,
        gameRoute: '/color-clash',
        startButtonText: 'START',
        rules: {
            title: 'HOW TO PLAY',
            sections: [
                { title: '1. Pick RED ♥️ or BLACK ♠️', content: 'Guess the color of the next card' },
                { title: '2. Tap a Card to Reveal', content: 'Flip all cards to complete the round' },
                { title: '3. Correct? Choose Who Drinks!', content: 'Wrong? You drink!' },
                { title: '⚡ ROUND MULTIPLIERS', content: 'Round 1: ×1 • Round 2: ×2 • Round 3: ×3' },
            ],
        },
    },
    'memory-rush': {
        id: 'memory-rush',
        name: 'Memory Rush',
        backgroundColor: '#FFCBA4',
        accentColor: '#1E3A5F',
        logoImage: require('../assets/images/gameLogos/memory_rush_logo.png'),
        gameImage: require('../assets/images/memory.png'),
        gameImageResizeMode: 'contain',
        gameImageSize: { width: 280, height: 280 },
        gameImageMarginTop: 140,
        gameImageMarginLeft: 70,
        minPlayers: 2,
        maxPlayers: 8,
        defaultPlayers: 2,
        gameRoute: '/memory-rush-game',
        startButtonText: 'START',
        generatePlayers: true,
        defaultParams: { difficulty: 'medium', numRounds: 5 },
        rules: {
            title: 'How to Play',
            sections: [
                { title: '🎯 Objective', content: 'Memorize a sequence, then find what changed!' },
                { title: '🎮 How It Works', content: '• View the original sequence\n• Spot the difference\n• Tap the changed item\n• Be fast for bonus points!' },
                { title: '🏆 Scoring', content: 'Combo multipliers for streaks. Speed bonus for fast answers. 3 lives per game' },
            ],
        },
    },
    'brain-vs-brain': {
        id: 'brain-vs-brain',
        name: 'Brain vs Brain',
        backgroundColor: '#8B0000', // Dark red
        accentColor: '#8B0000',
        logoImage: require('../assets/images/gameLogos/brainvsbrain_logo.png'),
        gameImage: require('../assets/images/NewBrainvBrain.png'),
        gameImageResizeMode: 'cover',
        minPlayers: 2,
        maxPlayers: 2, // Head to head
        defaultPlayers: 2,
        gameRoute: '/brain-vs-brain-game',
        startButtonText: 'START GAME',
        hidePlayerSelection: true,
        rules: {
            title: 'How to Play',
            sections: [
                { title: 'Objective', content: 'Two players compete head-to-head in a battle of wits! Answer trivia questions correctly and faster than your opponent to win.' },
                { title: 'Game Flow', content: "1. Both players see the same question\n2. First to answer correctly gets the point\n3. Wrong answer? Your opponent gets a chance!" },
            ],
        },
    },
    'ride-the-bus': {
        id: 'ride-the-bus',
        name: 'Ride the Bus',
        backgroundColor: '#263238',
        accentColor: '#FFC107',
        backgroundImage: require('../assets/images/Actionbg.png'),
        logoImage: require('../assets/images/rtb.png'),
        gameImage: require('../assets/images/rtb.png'),
        minPlayers: 2,
        maxPlayers: 10, // Not restricted?
        defaultPlayers: 2,
        gameRoute: '/ride-the-bus-player-setup',
        startButtonText: 'START GAME',
        hidePlayerSelection: true,
        rules: {
            title: 'How to Play',
            sections: [
                { title: 'The Goal', content: "Don't get stuck on the bus! The loser of each round keeps riding until they win or the deck runs out." },
                { title: 'Phases', content: "1. Red or Black?\n2. Higher or Lower?\n3. In Between or Outside?\n4. Guess the Suit" },
                { title: 'The Pyramid', content: 'Players build a pyramid of face-down cards and flip them to match their hand.' },
            ],
        },
    },
    'brain-buzzer': {
        id: 'brain-buzzer',
        name: 'Brain Buzzer',
        backgroundColor: '#0A1E3D',
        accentColor: '#FFC107',
        logoImage: require('../assets/images/gameLogos/brain_buzzer_logo.png'),
        gameImage: require('../assets/images/NewBrainbuzzer.png'),
        minPlayers: 2,
        maxPlayers: 6,
        defaultPlayers: 2,
        gameRoute: '/brain-buzzer-difficulty',
        startButtonText: 'START',
        rules: {
            title: 'How to Play',
            sections: [
                { title: '🎯 Objective', content: 'Answer trivia questions correctly before time runs out!' },
                { title: '🎮 How It Works', content: "• Choose your difficulty level\n• Each player takes turns\n• Tap the correct answer\n• Faster answers = more points" },
            ],
        },
    },
    'lip-sync': {
        id: 'lip-sync',
        name: 'Lip Sync Chaos',
        backgroundColor: '#1ABC9C',
        accentColor: '#16a085',
        backgroundImage: require('../assets/images/telon1.png'),
        logoImage: require('../assets/images/gameLogos/lipsynclogo.png'),
        gameImage: require('../assets/images/lip.png'),
        minPlayers: 2,
        maxPlayers: 6,
        defaultPlayers: 3,
        gameRoute: '/lip-sync-game',
        startButtonText: 'START',
        startAlert: {
            title: '🎧 Headphones Required!',
            message: "Make sure the guesser is wearing headphones with LOUD music so they can't hear! Ready to play?",
            cancelText: 'Not Ready',
            confirmText: "Let's Play!",
        },
        rules: {
            title: 'How to Play',
            sections: [
                { title: '🎯 Objective', content: 'Read lips to guess the phrase while wearing headphones with loud music!' },
                { title: '🎧 Setup', content: "• One player puts on headphones\n• Loud music plays so they can't hear\n• The other player holds the phone" },
                { title: '🎮 How It Works', content: "• A phrase appears on screen\n• Player without headphones reads it aloud\n• Player with headphones tries to guess by reading lips\n• Points for correct guesses!" },
            ],
        },
    },
    'stop-game': {
        id: 'stop-game',
        name: 'Stop Game',
        backgroundColor: '#5DADE2', // Light blue
        accentColor: '#FF8C00', // Orange
        logoImage: require('../assets/images/gameLogos/stop_game_logo.png'),
        gameImage: require('../assets/images/NewStopgame.png'),
        logoMarginLeft: -80,
        minPlayers: 2,
        maxPlayers: 10,
        defaultPlayers: 3,
        gameRoute: '/stop-game-pre-game',
        startButtonText: 'Choose Players', // To match original button
        rules: {
            title: 'How to Play',
            sections: [
                { title: '🎯 Objective', content: 'Come up with words for each category that start with a random letter!' },
                { title: '🎮 How It Works', content: '• Random letter is chosen\n• Fill each category with a word\n• Shout "STOP!" when done\n• Unique answers = points!' },
                { title: '🏆 Scoring', content: 'Unique answers score! Duplicate answers with other players = no points.' },
            ],
        },
    },
    'extreme-challenge-roulette': {
        id: 'extreme-challenge-roulette',
        name: 'Extreme Challenge Roulette',
        backgroundColor: '#8B5CF6',
        accentColor: '#E74C3C',
        logoImage: require('../assets/images/gameLogos/extremechallengeLogo.png'),
        gameImage: require('../assets/images/2roulette.png'),
        minPlayers: 2,
        maxPlayers: 12,
        defaultPlayers: 4,
        gameRoute: '/extreme-challenge-roulette-pre-game',
        startButtonText: 'SPIN',
        rules: {
            title: 'How to Play',
            sections: [
                { title: '🎯 Objective', content: 'Spin the wheel and complete the extreme challenge!' },
                { title: '🎮 How It Works', content: '• Add players to the wheel\n• Spin to pick a victim\n• They must do the challenge or pay the penalty!' },
                { title: '⚠ Warning', content: 'These challenges are not for the faint of heart!' },
            ],
        },
    },
};
