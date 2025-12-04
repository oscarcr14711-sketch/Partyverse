// Compact trivia database - expandable later
export type Category = 'pop_culture' | 'geography' | 'science' | 'art_literature' | 'history' | 'sports' | 'music' | 'mixed';
export type Difficulty = 'easy' | 'medium' | 'hard';

export type TriviaQuestion = {
    id: string;
    category: Category;
    difficulty: Difficulty;
    question: string;
    answers: string[];
    correctIndex: number;
};

export const CATEGORY_INFO = {
    pop_culture: { name: 'Pop Culture', icon: '🎬', color: '#E91E63' },
    geography: { name: 'Geography', icon: '🌍', color: '#4CAF50' },
    science: { name: 'Science', icon: '🧪', color: '#2196F3' },
    art_literature: { name: 'Art & Literature', icon: '🎨', color: '#9C27B0' },
    history: { name: 'History', icon: '🕰', color: '#FF9800' },
    sports: { name: 'Sports', icon: '🏆', color: '#F44336' },
    music: { name: 'Music', icon: '🎧', color: '#00BCD4' },
    mixed: { name: 'Mixed', icon: '❓', color: '#FFC107' },
};

// Sample questions - 15 per category per difficulty
export const QUESTIONS: TriviaQuestion[] = [
    // Pop Culture Easy
    { id: '1', category: 'pop_culture', difficulty: 'easy', question: "What's the name of the yellow cartoon sponge?", answers: ['SpongeBob', 'Patrick', 'Squidward', 'Gary'], correctIndex: 0 },
    { id: '2', category: 'pop_culture', difficulty: 'easy', question: 'Which superhero is "The Dark Knight"?', answers: ['Superman', 'Batman', 'Spider-Man', 'Iron Man'], correctIndex: 1 },
    { id: '3', category: 'pop_culture', difficulty: 'easy', question: 'What app is famous for dance videos?', answers: ['Instagram', 'Snapchat', 'TikTok', 'Twitter'], correctIndex: 2 },
    { id: '4', category: 'pop_culture', difficulty: 'easy', question: 'What streaming service has a red N logo?', answers: ['Hulu', 'Netflix', 'Disney+', 'Prime'], correctIndex: 1 },
    { id: '5', category: 'pop_culture', difficulty: 'easy', question: 'In Frozen, what is the snowman\'s name?', answers: ['Kristoff', 'Hans', 'Olaf', 'Sven'], correctIndex: 2 },

    // Geography Easy
    { id: '6', category: 'geography', difficulty: 'easy', question: 'What is the capital of France?', answers: ['London', 'Paris', 'Berlin', 'Rome'], correctIndex: 1 },
    { id: '7', category: 'geography', difficulty: 'easy', question: 'Which ocean is the largest?', answers: ['Atlantic', 'Pacific', 'Indian', 'Arctic'], correctIndex: 1 },
    { id: '8', category: 'geography', difficulty: 'easy', question: 'Which country looks like a boot?', answers: ['Spain', 'Greece', 'Italy', 'Portugal'], correctIndex: 2 },
    { id: '9', category: 'geography', difficulty: 'easy', question: 'What is the tallest mountain?', answers: ['K2', 'Everest', 'Kilimanjaro', 'Denali'], correctIndex: 1 },
    { id: '10', category: 'geography', difficulty: 'easy', question: 'Which continent is Egypt in?', answers: ['Asia', 'Africa', 'Europe', 'Australia'], correctIndex: 1 },

    // Science Easy  
    { id: '11', category: 'science', difficulty: 'easy', question: 'Which planet is called the Red Planet?', answers: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1 },
    { id: '12', category: 'science', difficulty: 'easy', question: 'What do humans breathe to survive?', answers: ['Nitrogen', 'Oxygen', 'Carbon', 'Hydrogen'], correctIndex: 1 },
    { id: '13', category: 'science', difficulty: 'easy', question: 'How many senses do humans have?', answers: ['3', '5', '7', '10'], correctIndex: 1 },
    { id: '14', category: 'science', difficulty: 'easy', question: 'What is H2O?', answers: ['Air', 'Water', 'Fire', 'Earth'], correctIndex: 1 },
    { id: '15', category: 'science', difficulty: 'easy', question: 'What is the center of our solar system?', answers: ['Earth', 'Moon', 'Sun', 'Mars'], correctIndex: 2 },

    // Other Easy
    { id: '16', category: 'history', difficulty: 'easy', question: 'Who was the first US president?', answers: ['Lincoln', 'Washington', 'Jefferson', 'Adams'], correctIndex: 1 },
    { id: '17', category: 'sports', difficulty: 'easy', question: 'What ball is used in soccer?', answers: ['Football', 'Basketball', 'Baseball', 'Tennis ball'], correctIndex: 0 },
    { id: '18', category: 'music', difficulty: 'easy', question: 'Who is the King of Pop?', answers: ['Elvis', 'Prince', 'Michael Jackson', 'Madonna'], correctIndex: 2 },
    { id: '19', category: 'art_literature', difficulty: 'easy', question: 'Who painted the Mona Lisa?', answers: ['Picasso', 'Da Vinci', 'Van Gogh', 'Monet'], correctIndex: 1 },
    { id: '20', category: 'mixed', difficulty: 'easy', question: 'How many days in a week?', answers: ['5', '6', '7', '8'], correctIndex: 2 },

    // MEDIUM QUESTIONS
    { id: '21', category: 'pop_culture', difficulty: 'medium', question: 'Who played Jack in Titanic?', answers: ['Brad Pitt', 'Tom Cruise', 'Leonardo DiCaprio', 'Johnny Depp'], correctIndex: 2 },
    { id: '22', category: 'pop_culture', difficulty: 'medium', question: 'Which house is Harry Potter in?', answers: ['Slytherin', 'Hufflepuff', 'Ravenclaw', 'Gryffindor'], correctIndex: 3 },
    { id: '23', category: 'geography', difficulty: 'medium', question: 'What is the capital of Japan?', answers: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'], correctIndex: 2 },
    { id: '24', category: 'geography', difficulty: 'medium', question: 'Which river flows through Egypt?', answers: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], correctIndex: 1 },
    { id: '25', category: 'science', difficulty: 'medium', question: 'What is the hardest natural substance?', answers: ['Gold', 'Iron', 'Diamond', 'Platinum'], correctIndex: 2 },
    { id: '26', category: 'science', difficulty: 'medium', question: 'What is the speed of light approx?', answers: ['300,000 km/s', '150,000 km/s', '1,000 km/s', 'Sound speed'], correctIndex: 0 },
    { id: '27', category: 'history', difficulty: 'medium', question: 'In which year did WWII end?', answers: ['1940', '1945', '1950', '1939'], correctIndex: 1 },
    { id: '28', category: 'history', difficulty: 'medium', question: 'Who discovered America?', answers: ['Columbus', 'Magellan', 'Cook', 'Vespucci'], correctIndex: 0 },
    { id: '29', category: 'sports', difficulty: 'medium', question: 'How long is a marathon?', answers: ['26.2 miles', '20 miles', '30 miles', '13.1 miles'], correctIndex: 0 },
    { id: '30', category: 'music', difficulty: 'medium', question: 'Which band sang "Bohemian Rhapsody"?', answers: ['Beatles', 'Queen', 'Pink Floyd', 'Led Zeppelin'], correctIndex: 1 },
    { id: '31', category: 'art_literature', difficulty: 'medium', question: 'Who wrote "Romeo and Juliet"?', answers: ['Dickens', 'Shakespeare', 'Hemingway', 'Austen'], correctIndex: 1 },
    { id: '32', category: 'mixed', difficulty: 'medium', question: 'What is the square root of 64?', answers: ['6', '7', '8', '9'], correctIndex: 2 },
    { id: '33', category: 'mixed', difficulty: 'medium', question: 'Which is a primary color?', answers: ['Green', 'Orange', 'Red', 'Purple'], correctIndex: 2 },
    { id: '34', category: 'pop_culture', difficulty: 'medium', question: 'Who is the "Material Girl"?', answers: ['Madonna', 'Cher', 'Lady Gaga', 'Britney'], correctIndex: 0 },
    { id: '35', category: 'geography', difficulty: 'medium', question: 'Which country has the most people?', answers: ['USA', 'India', 'China', 'Russia'], correctIndex: 1 },

    // HARD QUESTIONS
    { id: '36', category: 'science', difficulty: 'hard', question: 'What is the atomic number of Gold?', answers: ['50', '79', '82', '94'], correctIndex: 1 },
    { id: '37', category: 'science', difficulty: 'hard', question: 'What is the powerhouse of the cell?', answers: ['Nucleus', 'Ribosome', 'Mitochondria', 'Lysosome'], correctIndex: 2 },
    { id: '38', category: 'history', difficulty: 'hard', question: 'Who was the second US president?', answers: ['Jefferson', 'Adams', 'Madison', 'Monroe'], correctIndex: 1 },
    { id: '39', category: 'history', difficulty: 'hard', question: 'When did the Berlin Wall fall?', answers: ['1987', '1989', '1991', '1993'], correctIndex: 1 },
    { id: '40', category: 'geography', difficulty: 'hard', question: 'What is the capital of Australia?', answers: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correctIndex: 2 },
    { id: '41', category: 'geography', difficulty: 'hard', question: 'Which desert is the largest?', answers: ['Sahara', 'Arabian', 'Gobi', 'Antarctic'], correctIndex: 3 },
    { id: '42', category: 'art_literature', difficulty: 'hard', question: 'Who wrote "1984"?', answers: ['Orwell', 'Huxley', 'Bradbury', 'Steinbeck'], correctIndex: 0 },
    { id: '43', category: 'art_literature', difficulty: 'hard', question: 'Who painted "The Starry Night"?', answers: ['Monet', 'Manet', 'Van Gogh', 'Dali'], correctIndex: 2 },
    { id: '44', category: 'music', difficulty: 'hard', question: 'Who composed "The Four Seasons"?', answers: ['Bach', 'Mozart', 'Vivaldi', 'Beethoven'], correctIndex: 2 },
    { id: '45', category: 'music', difficulty: 'hard', question: 'Which album is by Pink Floyd?', answers: ['Abbey Road', 'Dark Side of the Moon', 'Thriller', 'Rumours'], correctIndex: 1 },
    { id: '46', category: 'sports', difficulty: 'hard', question: 'How many players in a rugby union team?', answers: ['11', '13', '15', '7'], correctIndex: 2 },
    { id: '47', category: 'sports', difficulty: 'hard', question: 'Where were the first modern Olympics?', answers: ['Paris', 'London', 'Athens', 'Rome'], correctIndex: 2 },
    { id: '48', category: 'pop_culture', difficulty: 'hard', question: 'Who directed "Pulp Fiction"?', answers: ['Spielberg', 'Scorsese', 'Tarantino', 'Nolan'], correctIndex: 2 },
    { id: '49', category: 'mixed', difficulty: 'hard', question: 'What is the value of Pi to 2 decimals?', answers: ['3.12', '3.14', '3.16', '3.18'], correctIndex: 1 },
    { id: '50', category: 'mixed', difficulty: 'hard', question: 'How many bones in the adult body?', answers: ['206', '208', '210', '212'], correctIndex: 0 },
];

export function getQuestionsByCategory(category: Category, difficulty: Difficulty): TriviaQuestion[] {
    return QUESTIONS.filter(q => q.category === category && q.difficulty === difficulty);
}

export function getRandomQuestions(category: Category, difficulty: Difficulty, count: number): TriviaQuestion[] {
    const filtered = getQuestionsByCategory(category, difficulty);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
