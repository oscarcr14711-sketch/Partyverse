import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, Dimensions, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Question {
    id: number;
    question: string;
    correctAnswer: string;
    wrongAnswers: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    backgroundImage?: any;
    gradientColors?: string[];
}

const ALL_QUESTIONS: Question[] = [
    // --- EASY QUESTIONS (Original 10) ---
    {
        id: 1,
        question: "Which month has 28 days?",
        correctAnswer: "All of them",
        wrongAnswers: ["February", "Only February", "None"],
        difficulty: 'easy',
        backgroundImage: require('../assets/images/brain-buzzer/q1.png'),
    },
    {
        id: 2,
        question: "What gets wetter the more it dries?",
        correctAnswer: "Towel",
        wrongAnswers: ["Sponge", "Mop", "Hair"],
        difficulty: 'easy',
        backgroundImage: require('../assets/images/brain-buzzer/q2.png'),
    },
    {
        id: 3,
        question: "What color is a mirror?",
        correctAnswer: "Whatever reflects",
        wrongAnswers: ["Silver", "Clear", "White"],
        difficulty: 'easy',
        backgroundImage: require('../assets/images/brain-buzzer/q3.png'),
    },
    {
        id: 4,
        question: "What has hands but can't clap?",
        correctAnswer: "Clock",
        wrongAnswers: ["Mannequin", "Statue", "Gloves"],
        difficulty: 'easy',
        backgroundImage: require('../assets/images/brain-buzzer/q4.png'),
    },
    {
        id: 5,
        question: "What has one eye but can't see?",
        correctAnswer: "Needle",
        wrongAnswers: ["Cyclops", "Camera", "Potato"],
        difficulty: 'easy',
        backgroundImage: require('../assets/images/brain-buzzer/q5.png'),
    },
    {
        id: 6,
        question: "Which weighs more: 1 pound of feathers or 1 pound of bricks?",
        correctAnswer: "Same weight",
        wrongAnswers: ["Bricks", "Feathers", "Depends on size"],
        difficulty: 'easy',
        backgroundImage: require('../assets/images/brain-buzzer/q6.png'),
    },
    {
        id: 7,
        question: "What runs but has no legs?",
        correctAnswer: "Water",
        wrongAnswers: ["Snake", "Car", "Time"],
        difficulty: 'easy',
        backgroundImage: require('../assets/images/brain-buzzer/q7.png'),
    },
    {
        id: 8,
        question: "What has a neck but no head?",
        correctAnswer: "Bottle",
        wrongAnswers: ["Giraffe", "Shirt", "Guitar"],
        difficulty: 'easy',
        gradientColors: ['#FF6B9D', '#C44569'],
    },
    {
        id: 9,
        question: "What can you catch but not throw?",
        correctAnswer: "A cold",
        wrongAnswers: ["A ball", "A fish", "A frisbee"],
        difficulty: 'easy',
        gradientColors: ['#4ECDC4', '#44A08D'],
    },
    {
        id: 10,
        question: "If you drop a blue stone in the Red Sea, what happens?",
        correctAnswer: "It sinks",
        wrongAnswers: ["It floats", "It turns red", "It dissolves"],
        difficulty: 'easy',
        gradientColors: ['#F093FB', '#F5576C'],
    },

    // --- NEW EASY QUESTIONS ---
    {
        id: 11,
        question: "What has a head but no brain?",
        correctAnswer: "Coin",
        wrongAnswers: ["Doll", "Statue", "Pin"],
        difficulty: 'easy',
        gradientColors: ['#FFD700', '#FFA500'],
    },
    {
        id: 12,
        question: "What has a face but no eyes?",
        correctAnswer: "Clock",
        wrongAnswers: ["Mask", "Mountain", "Building"],
        difficulty: 'easy',
        gradientColors: ['#4FACFE', '#00F2FE'],
    },
    {
        id: 13,
        question: "What gets bigger the more you take away?",
        correctAnswer: "A hole",
        wrongAnswers: ["A debt", "Hunger", "Balloon"],
        difficulty: 'easy',
        gradientColors: ['#43E97B', '#38F9D7'],
    },
    {
        id: 14,
        question: "What has ears but cannot hear?",
        correctAnswer: "Cornfield",
        wrongAnswers: ["Rabbit hat", "Cup", "Painting"],
        difficulty: 'easy',
        gradientColors: ['#FA709A', '#FEE140'],
    },
    {
        id: 15,
        question: "What can travel the world while staying in place?",
        correctAnswer: "Stamp",
        wrongAnswers: ["Globe", "Map", "Internet"],
        difficulty: 'easy',
        gradientColors: ['#30CFD0', '#330867'],
    },
    {
        id: 16,
        question: "What gets sharper the more you use it?",
        correctAnswer: "Brain",
        wrongAnswers: ["Knife", "Pencil", "Tongue"],
        difficulty: 'easy',
        gradientColors: ['#A18CD1', '#FBC2EB'],
    },
    {
        id: 17,
        question: "What has a ring but no finger?",
        correctAnswer: "Phone",
        wrongAnswers: ["Bell", "Saturn", "Circus"],
        difficulty: 'easy',
        gradientColors: ['#F6D365', '#FDA085'],
    },
    {
        id: 18,
        question: "What word becomes shorter when you add two letters?",
        correctAnswer: "Short",
        wrongAnswers: ["Small", "Tiny", "Brief"],
        difficulty: 'easy',
        gradientColors: ['#84FAB0', '#8FD3F4'],
    },
    {
        id: 19,
        question: "What has 88 keys but cannot open a door?",
        correctAnswer: "Piano",
        wrongAnswers: ["Computer", "Map", "Keychain"],
        difficulty: 'easy',
        gradientColors: ['#E0C3FC', '#8EC5FC'],
    },
    {
        id: 20,
        question: "What has words but never speaks?",
        correctAnswer: "Book",
        wrongAnswers: ["Sign", "Letter", "Song"],
        difficulty: 'easy',
        gradientColors: ['#43E97B', '#38F9D7'],
    },
    {
        id: 21,
        question: "What fruit has its seeds on the outside?",
        correctAnswer: "Strawberry",
        wrongAnswers: ["Apple", "Kiwi", "Banana"],
        difficulty: 'easy',
        gradientColors: ['#FF9A9E', '#FECFEF'],
    },
    {
        id: 22,
        question: "What is full of holes but holds water?",
        correctAnswer: "Sponge",
        wrongAnswers: ["Bucket", "Net", "Cheese"],
        difficulty: 'easy',
        gradientColors: ['#A1C4FD', '#C2E9FB'],
    },
    {
        id: 23,
        question: "What has legs but cannot walk?",
        correctAnswer: "Table",
        wrongAnswers: ["Pants", "Chair", "Tripod"],
        difficulty: 'easy',
        gradientColors: ['#667EEA', '#764BA2'],
    },
    {
        id: 24,
        question: "What belongs to you but is used by others?",
        correctAnswer: "Your name",
        wrongAnswers: ["Your car", "Your money", "Your phone"],
        difficulty: 'easy',
        gradientColors: ['#FDFBFB', '#EBEDEE'],
    },
    {
        id: 25,
        question: "What has an end but no beginning?",
        correctAnswer: "Stick",
        wrongAnswers: ["Circle", "Line", "Ray"],
        difficulty: 'easy',
        gradientColors: ['#D4FC79', '#96E6A1'],
    },
    {
        id: 26,
        question: "What goes up when rain comes down?",
        correctAnswer: "Umbrella",
        wrongAnswers: ["Clouds", "Birds", "Smoke"],
        difficulty: 'easy',
        gradientColors: ['#89F7FE', '#66A6FF'],
    },
    {
        id: 27,
        question: "What kind of room has no doors or windows?",
        correctAnswer: "Mushroom",
        wrongAnswers: ["Ballroom", "Chatroom", "Darkroom"],
        difficulty: 'easy',
        gradientColors: ['#CD93FF', '#86A8E7'],
    },
    {
        id: 28,
        question: "What can you hold without touching it?",
        correctAnswer: "A conversation",
        wrongAnswers: ["Breath", "Grudge", "Thought"],
        difficulty: 'easy',
        gradientColors: ['#FFECD2', '#FCB69F'],
    },
    {
        id: 29,
        question: "What kind of band never plays music?",
        correctAnswer: "Rubber band",
        wrongAnswers: ["Headband", "Wristband", "Waistband"],
        difficulty: 'easy',
        gradientColors: ['#FF9A9E', '#FECFEF'],
    },
    {
        id: 30,
        question: "What starts with T, ends with T, and has T inside?",
        correctAnswer: "Teapot",
        wrongAnswers: ["Tent", "Toast", "Test"],
        difficulty: 'easy',
        gradientColors: ['#A18CD1', '#FBC2EB'],
    },

    // --- MEDIUM QUESTIONS ---
    {
        id: 31,
        question: "If an electric train goes north, where does the smoke go?",
        correctAnswer: "No smoke",
        wrongAnswers: ["South", "North", "East"],
        difficulty: 'medium',
        gradientColors: ['#FF9966', '#FF5E62'],
    },
    {
        id: 32,
        question: "How many animals did Moses take on the Ark?",
        correctAnswer: "None",
        wrongAnswers: ["Two of each", "Ten", "One hundred"],
        difficulty: 'medium',
        gradientColors: ['#DA22FF', '#9733EE'],
    },
    {
        id: 33,
        question: "What has branches but no leaves or trunk?",
        correctAnswer: "Bank",
        wrongAnswers: ["Dead tree", "Coral", "Antlers"],
        difficulty: 'medium',
        gradientColors: ['#F09819', '#EDDE5D'],
    },
    {
        id: 34,
        question: "What gets broken but never falls apart?",
        correctAnswer: "A promise",
        wrongAnswers: ["Glass", "Heart", "Record"],
        difficulty: 'medium',
        gradientColors: ['#4568DC', '#B06AB3'],
    },
    {
        id: 35,
        question: "If a plane crashes on the border of the U.S. and Canada, where do you bury survivors?",
        correctAnswer: "You don’t",
        wrongAnswers: ["USA", "Canada", "No man's land"],
        difficulty: 'medium',
        gradientColors: ['#FF9966', '#FF5E62'],
    },
    {
        id: 36,
        question: "What goes through towns and hills but never moves?",
        correctAnswer: "Road",
        wrongAnswers: ["River", "Fence", "Power line"],
        difficulty: 'medium',
        gradientColors: ['#DA22FF', '#9733EE'],
    },
    {
        id: 37,
        question: "What has teeth but cannot bite?",
        correctAnswer: "Comb",
        wrongAnswers: ["Saw", "Gear", "Zipper"],
        difficulty: 'medium',
        gradientColors: ['#F09819', '#EDDE5D'],
    },
    {
        id: 38,
        question: "What is always in front of you but can't be seen?",
        correctAnswer: "Future",
        wrongAnswers: ["Air", "Nose", "Glasses"],
        difficulty: 'medium',
        gradientColors: ['#4568DC', '#B06AB3'],
    },
    {
        id: 39,
        question: "A cowboy rode into town on Friday and left on Friday. How?",
        correctAnswer: "Horse named Friday",
        wrongAnswers: ["He stayed a week", "Time travel", "Short trip"],
        difficulty: 'medium',
        gradientColors: ['#FF9966', '#FF5E62'],
    },
    {
        id: 40,
        question: "What five-letter word becomes shorter when you add two letters?",
        correctAnswer: "Short",
        wrongAnswers: ["Small", "Brief", "Tiny"],
        difficulty: 'medium',
        gradientColors: ['#DA22FF', '#9733EE'],
    },
    {
        id: 41,
        question: "What flies without wings?",
        correctAnswer: "Time",
        wrongAnswers: ["Cloud", "Kite", "Balloon"],
        difficulty: 'medium',
        gradientColors: ['#F09819', '#EDDE5D'],
    },
    {
        id: 42,
        question: "What can fill a room but takes up no space?",
        correctAnswer: "Light",
        wrongAnswers: ["Air", "Sound", "Smell"],
        difficulty: 'medium',
        gradientColors: ['#4568DC', '#B06AB3'],
    },
    {
        id: 43,
        question: "What kind of coat is best put on when wet?",
        correctAnswer: "Paint",
        wrongAnswers: ["Raincoat", "Fur", "Varnish"],
        difficulty: 'medium',
        gradientColors: ['#FF9966', '#FF5E62'],
    },
    {
        id: 44,
        question: "What kind of tree can you carry in your hand?",
        correctAnswer: "Palm",
        wrongAnswers: ["Bonsai", "Sapling", "Pine"],
        difficulty: 'medium',
        gradientColors: ['#DA22FF', '#9733EE'],
    },
    {
        id: 45,
        question: "Which letter is full of water?",
        correctAnswer: "C",
        wrongAnswers: ["S", "B", "W"],
        difficulty: 'medium',
        gradientColors: ['#F09819', '#EDDE5D'],
    },
    {
        id: 46,
        question: "What has a spine but no bones?",
        correctAnswer: "Book",
        wrongAnswers: ["Jellyfish", "Worm", "Slug"],
        difficulty: 'medium',
        gradientColors: ['#4568DC', '#B06AB3'],
    },
    {
        id: 47,
        question: "What starts with “P”, ends with “E”, and has thousands of letters?",
        correctAnswer: "Post office",
        wrongAnswers: ["Page", "Police", "Parade"],
        difficulty: 'medium',
        gradientColors: ['#FF9966', '#FF5E62'],
    },
    {
        id: 48,
        question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
        correctAnswer: "Letter M",
        wrongAnswers: ["Seconds", "Moments", "Milliseconds"],
        difficulty: 'medium',
        gradientColors: ['#DA22FF', '#9733EE'],
    },
    {
        id: 49,
        question: "What never asks a question but gets answered?",
        correctAnswer: "Doorbell",
        wrongAnswers: ["Phone", "Baby", "Echo"],
        difficulty: 'medium',
        gradientColors: ['#F09819', '#EDDE5D'],
    },
    {
        id: 50,
        question: "What starts with “E” but only has one letter?",
        correctAnswer: "Envelope",
        wrongAnswers: ["Eye", "Eagle", "Exit"],
        difficulty: 'medium',
        gradientColors: ['#4568DC', '#B06AB3'],
    },
    {
        id: 51,
        question: "The more you take, the more you leave behind.",
        correctAnswer: "Footsteps",
        wrongAnswers: ["Breath", "Time", "Money"],
        difficulty: 'medium',
        gradientColors: ['#FF9966', '#FF5E62'],
    },
    {
        id: 52,
        question: "What has many rings but no fingers?",
        correctAnswer: "Tree trunk",
        wrongAnswers: ["Bell", "Phone", "Saturn"],
        difficulty: 'medium',
        gradientColors: ['#DA22FF', '#9733EE'],
    },
    {
        id: 53,
        question: "What has four wheels and flies?",
        correctAnswer: "Garbage truck",
        wrongAnswers: ["Airplane", "Drone", "Kite"],
        difficulty: 'medium',
        gradientColors: ['#F09819', '#EDDE5D'],
    },
    {
        id: 54,
        question: "What has a bottom on the top?",
        correctAnswer: "Your legs",
        wrongAnswers: ["Upside down cake", "Hourglass", "Reflection"],
        difficulty: 'medium',
        gradientColors: ['#4568DC', '#B06AB3'],
    },
    {
        id: 55,
        question: "What can you break without touching it?",
        correctAnswer: "A promise",
        wrongAnswers: ["Heart", "Silence", "Record"],
        difficulty: 'medium',
        gradientColors: ['#FF9966', '#FF5E62'],
    },
    {
        id: 56,
        question: "What has 13 hearts but no organs?",
        correctAnswer: "Deck of cards",
        wrongAnswers: ["Valentine", "Love letter", "Octopus"],
        difficulty: 'medium',
        gradientColors: ['#DA22FF', '#9733EE'],
    },
    {
        id: 57,
        question: "What has a bed but never sleeps?",
        correctAnswer: "River",
        wrongAnswers: ["Truck", "Garden", "Oyster"],
        difficulty: 'medium',
        gradientColors: ['#F09819', '#EDDE5D'],
    },
    {
        id: 58,
        question: "What has a bank but no money?",
        correctAnswer: "River bank",
        wrongAnswers: ["Snow bank", "Blood bank", "Fog bank"],
        difficulty: 'medium',
        gradientColors: ['#4568DC', '#B06AB3'],
    },
    {
        id: 59,
        question: "What kind of room can you eat?",
        correctAnswer: "Mushroom",
        wrongAnswers: ["Dining room", "Lunchroom", "Pantry"],
        difficulty: 'medium',
        gradientColors: ['#FF9966', '#FF5E62'],
    },
    {
        id: 60,
        question: "What begins and ends with the letter “E”?",
        correctAnswer: "Envelope",
        wrongAnswers: ["Eagle", "Eye", "Ease"],
        difficulty: 'medium',
        gradientColors: ['#DA22FF', '#9733EE'],
    },

    // --- HARD QUESTIONS ---
    {
        id: 61,
        question: "What occurs once in a year, twice in a week, but never in a day?",
        correctAnswer: "Letter E",
        wrongAnswers: ["Christmas", "Payday", "Weekend"],
        difficulty: 'hard',
        gradientColors: ['#FF416C', '#FF4B2B'],
    },
    {
        id: 62,
        question: "What word is spelled incorrectly in every dictionary?",
        correctAnswer: "Incorrectly",
        wrongAnswers: ["Dictionary", "Wrong", "Misspelled"],
        difficulty: 'hard',
        gradientColors: ['#8E2DE2', '#4A00E0'],
    },
    {
        id: 63,
        question: "If you have a bowl with 6 apples and you take away 4, how many do you have?",
        correctAnswer: "You have 4",
        wrongAnswers: ["2", "6", "0"],
        difficulty: 'hard',
        gradientColors: ['#00b09b', '#96c93d'],
    },
    {
        id: 64,
        question: "What disappears as soon as you say its name?",
        correctAnswer: "Silence",
        wrongAnswers: ["Ghost", "Secret", "Shadow"],
        difficulty: 'hard',
        gradientColors: ['#fc4a1a', '#f7b733'],
    },
    {
        id: 65,
        question: "What has one voice but becomes two whenever it speaks?",
        correctAnswer: "Echo",
        wrongAnswers: ["Duet", "Mirror", "Twins"],
        difficulty: 'hard',
        gradientColors: ['#FF416C', '#FF4B2B'],
    },
    {
        id: 66,
        question: "What is so fragile that saying its name breaks it?",
        correctAnswer: "Silence",
        wrongAnswers: ["Glass", "Egg", "Peace"],
        difficulty: 'hard',
        gradientColors: ['#8E2DE2', '#4A00E0'],
    },
    {
        id: 67,
        question: "What kind of ship has two mates but no captain?",
        correctAnswer: "Relationship",
        wrongAnswers: ["Friendship", "Partnership", "Internship"],
        difficulty: 'hard',
        gradientColors: ['#00b09b', '#96c93d'],
    },
    {
        id: 68,
        question: "What can one catch that is not thrown, but only felt?",
        correctAnswer: "Nerves",
        wrongAnswers: ["Cold", "Bus", "Feelings"],
        difficulty: 'hard',
        gradientColors: ['#fc4a1a', '#f7b733'],
    },
    {
        id: 69,
        question: "What grows when you feed it but dies when you give it water?",
        correctAnswer: "Fire",
        wrongAnswers: ["Plant", "Sponge", "Gremlin"],
        difficulty: 'hard',
        gradientColors: ['#FF416C', '#FF4B2B'],
    },
    {
        id: 70,
        question: "What has keys but no locks, space but no room?",
        correctAnswer: "Keyboard",
        wrongAnswers: ["Piano", "Spacebar", "Map"],
        difficulty: 'hard',
        gradientColors: ['#8E2DE2', '#4A00E0'],
    },
    {
        id: 71,
        question: "What stands still but can climb mountains?",
        correctAnswer: "Road",
        wrongAnswers: ["Tree", "Cabin", "Sherpa"],
        difficulty: 'hard',
        gradientColors: ['#00b09b', '#96c93d'],
    },
    {
        id: 72,
        question: "What gets whiter the dirtier it gets?",
        correctAnswer: "Chalkboard",
        wrongAnswers: ["Snow", "Sheep", "Towel"],
        difficulty: 'hard',
        gradientColors: ['#fc4a1a', '#f7b733'],
    },
    {
        id: 73,
        question: "If there are 6 apples and you take away 2, how many do YOU have?",
        correctAnswer: "You have 2",
        wrongAnswers: ["4", "6", "0"],
        difficulty: 'hard',
        gradientColors: ['#FF416C', '#FF4B2B'],
    },
    {
        id: 74,
        question: "What came first, the chicken or the egg?",
        correctAnswer: "The egg",
        wrongAnswers: ["Chicken", "Rooster", "Dinosaur"],
        difficulty: 'hard',
        gradientColors: ['#8E2DE2', '#4A00E0'],
    },
    {
        id: 75,
        question: "What has roots nobody sees and is taller than trees?",
        correctAnswer: "Mountain",
        wrongAnswers: ["Skyscraper", "Iceberg", "Giraffe"],
        difficulty: 'hard',
        gradientColors: ['#00b09b', '#96c93d'],
    },
    {
        id: 76,
        question: "What has four fingers and a thumb but is not alive?",
        correctAnswer: "Glove",
        wrongAnswers: ["Mannequin", "Zombie", "Robot"],
        difficulty: 'hard',
        gradientColors: ['#fc4a1a', '#f7b733'],
    },
    {
        id: 77,
        question: "What has a head, a tail, but no body?",
        correctAnswer: "Coin",
        wrongAnswers: ["Snake", "Comet", "Worm"],
        difficulty: 'hard',
        gradientColors: ['#FF416C', '#FF4B2B'],
    },
    {
        id: 78,
        question: "What has cities with no buildings, rivers with no water?",
        correctAnswer: "Map",
        wrongAnswers: ["Ruin", "Desert", "Dream"],
        difficulty: 'hard',
        gradientColors: ['#8E2DE2', '#4A00E0'],
    },
    {
        id: 79,
        question: "What comes down but never goes up?",
        correctAnswer: "Rain",
        wrongAnswers: ["Age", "Waterfall", "Gravity"],
        difficulty: 'hard',
        gradientColors: ['#00b09b', '#96c93d'],
    },
    {
        id: 80,
        question: "What becomes smaller when you turn it upside down?",
        correctAnswer: "Number 9",
        wrongAnswers: ["Number 6", "Letter M", "Cake"],
        difficulty: 'hard',
        gradientColors: ['#fc4a1a', '#f7b733'],
    },
    {
        id: 81,
        question: "What gets heavier the more you remove?",
        correctAnswer: "Nothing",
        wrongAnswers: ["Scrapbook", "Memory", "Debt"],
        difficulty: 'hard',
        gradientColors: ['#FF416C', '#FF4B2B'],
    },
    {
        id: 82,
        question: "What two things can you never eat for breakfast?",
        correctAnswer: "Lunch & Dinner",
        wrongAnswers: ["Eggs & Toast", "Cereal & Milk", "Coffee & Tea"],
        difficulty: 'hard',
        gradientColors: ['#8E2DE2', '#4A00E0'],
    },
    {
        id: 83,
        question: "What starts with P, ends with E, and has thousands of letters?",
        correctAnswer: "Post Office",
        wrongAnswers: ["Page", "Police", "Parade"],
        difficulty: 'hard',
        gradientColors: ['#00b09b', '#96c93d'],
    },
    {
        id: 84,
        question: "If there are 3 apples and you take away 2, how many remain?",
        correctAnswer: "1 remains",
        wrongAnswers: ["2 remain", "3 remain", "0 remain"],
        difficulty: 'hard',
        gradientColors: ['#fc4a1a', '#f7b733'],
    },
    {
        id: 85,
        question: "What has a thumb but no fingers?",
        correctAnswer: "Mitten",
        wrongAnswers: ["Glove", "Paw", "Stump"],
        difficulty: 'hard',
        gradientColors: ['#FF416C', '#FF4B2B'],
    },
    {
        id: 86,
        question: "What room do ghosts avoid?",
        correctAnswer: "Living room",
        wrongAnswers: ["Bedroom", "Bathroom", "Kitchen"],
        difficulty: 'hard',
        gradientColors: ['#8E2DE2', '#4A00E0'],
    },
    {
        id: 87,
        question: "What’s at the end of everything?",
        correctAnswer: "Letter g",
        wrongAnswers: ["Death", "The Void", "Z"],
        difficulty: 'hard',
        gradientColors: ['#00b09b', '#96c93d'],
    },
    {
        id: 88,
        question: "What can you serve but never eat?",
        correctAnswer: "Tennis ball",
        wrongAnswers: ["Waiter", "Tray", "Napkin"],
        difficulty: 'hard',
        gradientColors: ['#fc4a1a', '#f7b733'],
    },
    {
        id: 89,
        question: "What has no beginning, no end, and no middle?",
        correctAnswer: "Circle",
        wrongAnswers: ["Line", "Ray", "Triangle"],
        difficulty: 'hard',
        gradientColors: ['#FF416C', '#FF4B2B'],
    },
    {
        id: 90,
        question: "What increases the more you share it?",
        correctAnswer: "Happiness",
        wrongAnswers: ["Money", "Food", "Secret"],
        difficulty: 'hard',
        gradientColors: ['#8E2DE2', '#4A00E0'],
    },
];

export default function BrainBuzzerGame() {
    const router = useRouter();
    const { numPlayers, difficulty } = useLocalSearchParams();
    const playerCount = numPlayers ? parseInt(numPlayers as string) : 2;
    const selectedDifficulty = (difficulty as 'easy' | 'medium' | 'hard') || 'easy';

    // Filter questions based on difficulty, randomize, and pick 20
    const [filteredQuestions] = useState(() => {
        const questions = ALL_QUESTIONS.filter(q => q.difficulty === selectedDifficulty);
        // Shuffle array
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        return questions.slice(0, 20);
    });

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [playerScores, setPlayerScores] = useState<number[]>(Array(playerCount).fill(0));
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
    const [currentStreak, setCurrentStreak] = useState<number[]>(Array(playerCount).fill(0));
    const [showConfetti, setShowConfetti] = useState(false);

    const pulseAnim = new Animated.Value(1);
    const shakeAnim = new Animated.Value(0);
    const confettiAnim = new Animated.Value(0);

    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const { width } = Dimensions.get('window');

    // Shuffle answers when question changes
    useEffect(() => {
        if (!currentQuestion) return;

        const allAnswers = [currentQuestion.correctAnswer, ...currentQuestion.wrongAnswers];
        const shuffled = allAnswers.sort(() => Math.random() - 0.5);
        setShuffledAnswers(shuffled);
        setTimeLeft(15);
        setSelectedAnswer(null);
        setShowResult(false);
    }, [currentQuestionIndex, currentQuestion]);

    // Timer countdown
    useEffect(() => {
        if (timeLeft > 0 && !showResult) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showResult) {
            handleTimeout();
        }
    }, [timeLeft, showResult]);

    // Pulse animation for timer
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleTimeout = () => {
        setShowResult(true);
        setSelectedAnswer(null);
    };

    const playSound = async (isCorrect: boolean) => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                isCorrect
                    ? { uri: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3' } // Correct chime
                    : { uri: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3' } // Wrong buzz
            );
            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.log('Sound error:', error);
        }
    };

    const handleAnswerPress = (answer: string) => {
        if (showResult) return;
        setSelectedAnswer(answer);
        setShowResult(true);

        const isCorrect = answer === currentQuestion.correctAnswer;

        if (isCorrect) {
            // Correct answer feedback
            const newScores = [...playerScores];
            newScores[currentPlayerIndex] += 1;
            setPlayerScores(newScores);

            // Update streak
            const newStreaks = [...currentStreak];
            newStreaks[currentPlayerIndex] += 1;
            setCurrentStreak(newStreaks);

            // Haptic feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Play sound
            playSound(true);

            // Show confetti animation
            setShowConfetti(true);
            Animated.sequence([
                Animated.timing(confettiAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(confettiAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start(() => setShowConfetti(false));
        } else {
            // Wrong answer feedback
            // Reset streak
            const newStreaks = [...currentStreak];
            newStreaks[currentPlayerIndex] = 0;
            setCurrentStreak(newStreaks);

            // Haptic feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            // Play sound
            playSound(false);

            // Shake animation
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
            ]).start();
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < filteredQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCurrentPlayerIndex((currentPlayerIndex + 1) % playerCount);
        } else {
            // Game over - find winner
            const maxScore = Math.max(...playerScores);
            const winners = playerScores
                .map((score, index) => ({ score, index }))
                .filter(p => p.score === maxScore)
                .map(p => `Player ${p.index + 1}`);

            router.push({
                pathname: '/brain-buzzer-game-over',
                params: {
                    winner: winners.join(' & '),
                    scores: JSON.stringify(playerScores),
                }
            } as any);
        }
    };

    const getAnswerButtonStyle = (answer: string) => {
        if (!showResult) return styles.answerButton;

        if (answer === currentQuestion.correctAnswer) {
            return [styles.answerButton, styles.correctAnswer];
        }
        if (answer === selectedAnswer && answer !== currentQuestion.correctAnswer) {
            return [styles.answerButton, styles.wrongAnswer];
        }
        return [styles.answerButton, styles.disabledAnswer];
    };

    const renderBackground = () => {
        if (!currentQuestion) return <View style={[StyleSheet.absoluteFill, { backgroundColor: '#18304A' }]} />;

        if (currentQuestion.backgroundImage) {
            return (
                <ImageBackground
                    source={currentQuestion.backgroundImage}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                >
                    <View style={styles.overlay} />
                </ImageBackground>
            );
        } else if (currentQuestion.gradientColors) {
            return (
                <LinearGradient
                    colors={currentQuestion.gradientColors as any}
                    style={StyleSheet.absoluteFill}
                >
                    <View style={styles.overlay} />
                </LinearGradient>
            );
        }
        return <View style={[StyleSheet.absoluteFill, { backgroundColor: '#18304A' }]} />;
    };

    if (!currentQuestion) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white', textAlign: 'center', marginTop: 100 }}>No questions found for this difficulty.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: '#FFC107', textAlign: 'center', fontSize: 18 }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {renderBackground()}

            {/* Confetti Overlay */}
            {showConfetti && (
                <Animated.View style={[styles.confettiContainer, { opacity: confettiAnim }]} pointerEvents="none">
                    <Text style={[styles.confettiEmoji, { top: '10%', left: '20%' }]}>🎉</Text>
                    <Text style={[styles.confettiEmoji, { top: '15%', left: '70%' }]}>✨</Text>
                    <Text style={[styles.confettiEmoji, { top: '25%', left: '50%' }]}>🎊</Text>
                    <Text style={[styles.confettiEmoji, { top: '35%', left: '30%' }]}>⭐</Text>
                    <Text style={[styles.confettiEmoji, { top: '40%', left: '80%' }]}>🌟</Text>
                </Animated.View>
            )}

            <Animated.View style={[styles.content, { transform: [{ translateX: shakeAnim }] }]}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.playerTurnBox}>
                        <Text style={styles.playerTurnText}>Player {currentPlayerIndex + 1}'s Turn</Text>
                    </View>

                    <Animated.View style={[styles.timerBox, { transform: [{ scale: timeLeft <= 5 ? pulseAnim : 1 }] }]}>
                        <Text style={[styles.timerText, timeLeft <= 5 && styles.timerWarning]}>{timeLeft}s</Text>
                    </Animated.View>
                </View>

                {/* Question Card */}
                <View style={styles.questionCard}>
                    <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1}/{filteredQuestions.length}</Text>
                    <Text style={styles.questionText}>{currentQuestion.question}</Text>
                </View>

                {/* Answer Buttons */}
                <View style={styles.answersContainer}>
                    {shuffledAnswers.map((answer, index) => (
                        <TouchableOpacity
                            key={index}
                            style={getAnswerButtonStyle(answer)}
                            onPress={() => handleAnswerPress(answer)}
                            disabled={showResult}
                        >
                            <Text style={styles.answerText}>{answer}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Result & Next Button */}
                {showResult && (
                    <View style={styles.resultContainer}>
                        {selectedAnswer === currentQuestion.correctAnswer ? (
                            <>
                                <Text style={styles.resultCorrect}>✓ Correct! +1 Point</Text>
                                {currentStreak[currentPlayerIndex] >= 2 && (
                                    <Text style={styles.streakText}>
                                        🔥 {currentStreak[currentPlayerIndex]} in a row!
                                    </Text>
                                )}
                            </>
                        ) : selectedAnswer ? (
                            <Text style={styles.resultWrong}>✗ Wrong! Correct: {currentQuestion.correctAnswer}</Text>
                        ) : (
                            <Text style={styles.resultTimeout}>⏱ Time's Up! Correct: {currentQuestion.correctAnswer}</Text>
                        )}

                        <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                            <Text style={styles.nextButtonText}>
                                {currentQuestionIndex < filteredQuestions.length - 1 ? 'NEXT QUESTION' : 'FINISH GAME'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Scoreboard */}
                <View style={styles.scoreboard}>
                    {playerScores.map((score, index) => (
                        <View key={index} style={[styles.scoreItem, index === currentPlayerIndex && styles.activePlayer]}>
                            <Text style={styles.scoreLabel}>P{index + 1}</Text>
                            <Text style={styles.scoreValue}>{score}</Text>
                        </View>
                    ))}
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#18304A',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    playerTurnBox: {
        backgroundColor: '#FFC107',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFA000',
    },
    playerTurnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#18304A',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' } }),
    },
    timerBox: {
        backgroundColor: '#18304A',
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFC107',
    },
    timerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFC107',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' } }),
    },
    timerWarning: {
        color: '#FF5252',
    },
    questionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 25,
        padding: 30,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 15,
    },
    questionNumber: {
        fontSize: 14,
        color: '#FFC107',
        fontWeight: 'bold',
        marginBottom: 10,
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' } }),
    },
    questionText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#18304A',
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' } }),
    },
    answersContainer: {
        gap: 12,
    },
    answerButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 18,
        borderWidth: 3,
        borderColor: '#FFC107',
    },
    correctAnswer: {
        backgroundColor: '#4CAF50',
        borderColor: '#2E7D32',
    },
    wrongAnswer: {
        backgroundColor: '#F44336',
        borderColor: '#C62828',
    },
    disabledAnswer: {
        opacity: 0.5,
    },
    answerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#18304A',
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' } }),
    },
    resultContainer: {
        alignItems: 'center',
        gap: 15,
    },
    resultCorrect: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4CAF50',
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' } }),
    },
    resultWrong: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F44336',
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' } }),
    },
    resultTimeout: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF9800',
        textAlign: 'center',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Heavy' } }),
    },
    nextButton: {
        backgroundColor: '#FFC107',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#FFA000',
    },
    nextButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#18304A',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' } }),
    },
    scoreboard: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginTop: 10,
    },
    scoreItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
        alignItems: 'center',
        minWidth: 60,
    },
    activePlayer: {
        backgroundColor: '#FFC107',
    },
    scoreLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFF',
    },
    scoreValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' } }),
    },
});
