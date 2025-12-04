export type Difficulty = 'easy' | 'medium' | 'hard';

export type TrickyQuestion = {
    id: string;
    difficulty: Difficulty;
    question: string;
    answers: string[];
    correctIndex: number;
    explanation: string;
};

export const TRICKY_QUESTIONS: TrickyQuestion[] = [
    // EASY
    { id: '1', difficulty: 'easy', question: "What has keys but can't open locks?", answers: ['A Piano', 'A Map', 'A Banana', 'A Book'], correctIndex: 0, explanation: "A piano has keys!" },
    { id: '2', difficulty: 'easy', question: "What comes once in a minute, twice in a moment, but never in a thousand years?", answers: ['The letter M', 'The letter E', 'Time', 'Luck'], correctIndex: 0, explanation: "The letter 'M'!" },
    { id: '3', difficulty: 'easy', question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answers: ['An Echo', 'A Ghost', 'A Cloud', 'A Whistle'], correctIndex: 0, explanation: "An Echo!" },
    { id: '4', difficulty: 'easy', question: "What has to be broken before you can use it?", answers: ['An Egg', 'A Promise', 'A Record', 'A Window'], correctIndex: 0, explanation: "An Egg!" },
    { id: '5', difficulty: 'easy', question: "I’m tall when I’m young, and I’m short when I’m old. What am I?", answers: ['A Candle', 'A Tree', 'A Person', 'A Pencil'], correctIndex: 0, explanation: "A Candle!" },

    // MEDIUM
    { id: '6', difficulty: 'medium', question: "The more of this there is, the less you see. What is it?", answers: ['Darkness', 'Fog', 'Light', 'Money'], correctIndex: 0, explanation: "Darkness!" },
    { id: '7', difficulty: 'medium', question: "What has many keys but can't open a single lock?", answers: ['A Piano', 'A Keychain', 'A Jailer', 'A Computer'], correctIndex: 0, explanation: "A Piano (again, but trickier context)!" },
    { id: '8', difficulty: 'medium', question: "What can travel all around the world without leaving its corner?", answers: ['A Stamp', 'A Plane', 'A Satellite', 'A Thought'], correctIndex: 0, explanation: "A Stamp!" },
    { id: '9', difficulty: 'medium', question: "What has a head and a tail but no body?", answers: ['A Coin', 'A Snake', 'A Comet', 'A Story'], correctIndex: 0, explanation: "A Coin!" },
    { id: '10', difficulty: 'medium', question: "What gets wet while drying?", answers: ['A Towel', 'A Sponge', 'Water', 'Clothes'], correctIndex: 0, explanation: "A Towel!" },

    // HARD
    { id: '11', difficulty: 'hard', question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", answers: ['A Map', 'A Dream', 'A Planet', 'A Globe'], correctIndex: 0, explanation: "A Map!" },
    { id: '12', difficulty: 'hard', question: "The person who makes it has no need of it; the person who buys it has no use for it. The person who uses it can neither see nor feel it. What is it?", answers: ['A Coffin', 'A Gift', 'A Secret', 'A Lie'], correctIndex: 0, explanation: "A Coffin!" },
    { id: '13', difficulty: 'hard', question: "What belongs to you, but other people use it more than you?", answers: ['Your Name', 'Your Money', 'Your Car', 'Your House'], correctIndex: 0, explanation: "Your Name!" },
    { id: '14', difficulty: 'hard', question: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?", answers: ['Fire', 'A Balloon', 'A Plant', 'Ice'], correctIndex: 0, explanation: "Fire!" },
    { id: '15', difficulty: 'hard', question: "What is always in front of you but can’t be seen?", answers: ['The Future', 'The Past', 'Your Nose', 'Air'], correctIndex: 0, explanation: "The Future!" },
];

export function getTrickyQuestions(difficulty: Difficulty, count: number): TrickyQuestion[] {
    const filtered = TRICKY_QUESTIONS.filter(q => q.difficulty === difficulty);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
