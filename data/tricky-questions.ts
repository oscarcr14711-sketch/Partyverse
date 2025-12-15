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
    // EASY (25 questions)
    { id: '1', difficulty: 'easy', question: "What has keys but can't open locks?", answers: ['A Piano', 'A Map', 'A Banana', 'A Book'], correctIndex: 0, explanation: "A piano has keys!" },
    { id: '2', difficulty: 'easy', question: "What comes once in a minute, twice in a moment, but never in a thousand years?", answers: ['The letter M', 'The letter E', 'Time', 'Luck'], correctIndex: 0, explanation: "The letter 'M'!" },
    { id: '3', difficulty: 'easy', question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answers: ['An Echo', 'A Ghost', 'A Cloud', 'A Whistle'], correctIndex: 0, explanation: "An Echo!" },
    { id: '4', difficulty: 'easy', question: "What has to be broken before you can use it?", answers: ['An Egg', 'A Promise', 'A Record', 'A Window'], correctIndex: 0, explanation: "A Egg!" },
    { id: '5', difficulty: 'easy', question: "I'm tall when I'm young, and I'm short when I'm old. What am I?", answers: ['A Candle', 'A Tree', 'A Person', 'A Pencil'], correctIndex: 0, explanation: "A Candle!" },
    { id: 'e6', difficulty: 'easy', question: "What can you catch but not throw?", answers: ['A Cold', 'A Ball', 'A Fish', 'A Frisbee'], correctIndex: 0, explanation: "A Cold!" },
    { id: 'e7', difficulty: 'easy', question: "What has hands but can't clap?", answers: ['A Clock', 'A Robot', 'A Statue', 'A Mannequin'], correctIndex: 0, explanation: "A Clock!" },
    { id: 'e8', difficulty: 'easy', question: "What gets wetter the more it dries?", answers: ['A Towel', 'A Sponge', 'Paper', 'Clothes'], correctIndex: 0, explanation: "A Towel!" },
    { id: 'e9', difficulty: 'easy', question: "What has a neck but no head?", answers: ['A Bottle', 'A Giraffe', 'A Shirt', 'A Guitar'], correctIndex: 0, explanation: "A Bottle!" },
    { id: 'e10', difficulty: 'easy', question: "What goes up but never comes down?", answers: ['Your Age', 'A Balloon', 'A Plane', 'Temperature'], correctIndex: 0, explanation: "Your Age!" },
    { id: 'e11', difficulty: 'easy', question: "What has one eye but can't see?", answers: ['A Needle', 'A Cyclops', 'A Camera', 'A Potato'], correctIndex: 0, explanation: "A Needle!" },
    { id: 'e12', difficulty: 'easy', question: "What runs but never walks?", answers: ['Water', 'A Horse', 'Time', 'A Car'], correctIndex: 0, explanation: "Water!" },
    { id: 'e13', difficulty: 'easy', question: "What has teeth but can't bite?", answers: ['A Comb', 'A Saw', 'A Zipper', 'A Gear'], correctIndex: 0, explanation: "A Comb!" },
    { id: 'e14', difficulty: 'easy', question: "What can fill a room but takes up no space?", answers: ['Light', 'Air', 'Sound', 'Smell'], correctIndex: 0, explanation: "Light!" },
    { id: 'e15', difficulty: 'easy', question: "What has a face and two hands but no arms or legs?", answers: ['A Clock', 'A Watch', 'A Puppet', 'A Doll'], correctIndex: 0, explanation: "A Clock!" },
    { id: 'e16', difficulty: 'easy', question: "What begins with T, ends with T, and has T in it?", answers: ['A Teapot', 'A Tent', 'A Tablet', 'A Trumpet'], correctIndex: 0, explanation: "A Teapot!" },
    { id: 'e17', difficulty: 'easy', question: "What has four fingers and a thumb but isn't alive?", answers: ['A Glove', 'A Hand', 'A Toy', 'A Robot'], correctIndex: 0, explanation: "A Glove!" },
    { id: 'e18', difficulty: 'easy', question: "What has legs but doesn't walk?", answers: ['A Table', 'A Chair', 'A Bed', 'A Desk'], correctIndex: 0, explanation: "A Table (or chair)!" },
    { id: 'e19', difficulty: 'easy', question: "What is full of holes but still holds water?", answers: ['A Sponge', 'A Net', 'A Hose', 'A Bucket'], correctIndex: 0, explanation: "A Sponge!" },
    { id: 'e20', difficulty: 'easy', question: "What can you break without touching it?", answers: ['A Promise', 'A Glass', 'A Rule', 'A Heart'], correctIndex: 0, explanation: "A Promise!" },
    { id: 'e21', difficulty: 'easy', question: "What has a bottom at the top?", answers: ['Your Legs', 'A Hill', 'A Tree', 'A Hat'], correctIndex: 0, explanation: "Your Legs!" },
    { id: 'e22', difficulty: 'easy', question: "What goes around the world but stays in a corner?", answers: ['A Stamp', 'A Flag', 'A Sign', 'A Letter'], correctIndex: 0, explanation: "A Stamp!" },
    { id: 'e23', difficulty: 'easy', question: "What has words but never speaks?", answers: ['A Book', 'A Sign', 'A Computer', 'A Letter'], correctIndex: 0, explanation: "A Book!" },
    { id: 'e24', difficulty: 'easy', question: "What gets sharper the more you use it?", answers: ['Your Brain', 'A Knife', 'A Pencil', 'A Sword'], correctIndex: 0, explanation: "Your Brain!" },
    { id: 'e25', difficulty: 'easy', question: "What has a ring but no finger?", answers: ['A Phone', 'A Bell', 'A Doorbell', 'A Tree'], correctIndex: 0, explanation: "A Phone!" },

    // MEDIUM (25 questions)
    { id: '6', difficulty: 'medium', question: "The more of this there is, the less you see. What is it?", answers: ['Darkness', 'Fog', 'Light', 'Money'], correctIndex: 0, explanation: "Darkness!" },
    { id: '7', difficulty: 'medium', question: "What has many keys but can't open a single lock?", answers: ['A Piano', 'A Keychain', 'A Jailer', 'A Computer'], correctIndex: 0, explanation: "A Piano (again, but trickier context)!" },
    { id: '8', difficulty: 'medium', question: "What can travel all around the world without leaving its corner?", answers: ['A Stamp', 'A Plane', 'A Satellite', 'A Thought'], correctIndex: 0, explanation: "A Stamp!" },
    { id: '9', difficulty: 'medium', question: "What has a head and a tail but no body?", answers: ['A Coin', 'A Snake', 'A Comet', 'A Story'], correctIndex: 0, explanation: "A Coin!" },
    { id: '10', difficulty: 'medium', question: "What gets wet while drying?", answers: ['A Towel', 'A Sponge', 'Water', 'Clothes'], correctIndex: 0, explanation: "A Towel!" },
    { id: 'm6', difficulty: 'medium', question: "What is so fragile that saying its name breaks it?", answers: ['Silence', 'A Secret', 'Glass', 'Peace'], correctIndex: 0, explanation: "Silence!" },
    { id: 'm7', difficulty: 'medium', question: "What can you hold without ever touching it?", answers: ['A Conversation', 'Your Breath', 'A Grudge', 'A Meeting'], correctIndex: 1, explanation: "Your Breath!" },
    { id: 'm8', difficulty: 'medium', question: "What flies without wings?", answers: ['Time', 'A Bird', 'A Plane', 'A Kite'], correctIndex: 0, explanation: "Time!" },
    { id: 'm9', difficulty: 'medium', question: "What has 13 hearts but no other organs?", answers: ['A Deck of Cards', 'A Monster', 'A Plant', 'A Puzzle'], correctIndex: 0, explanation: "A Deck of Cards!" },
    { id: 'm10', difficulty: 'medium', question: "What disappears as soon as you say its name?", answers: ['Silence', 'A Secret', 'A Whisper', 'Nothing'], correctIndex: 0, explanation: "Silence!" },
    { id: 'm11', difficulty: 'medium', question: "What invention lets you look through a wall?", answers: ['A Window', 'X-ray', 'A Mirror', 'A Camera'], correctIndex: 0, explanation: "A Window!" },
    { id: 'm12', difficulty: 'medium', question: "What is at the end of a rainbow?", answers: ['The letter W', 'Gold', 'Clouds', 'Nothing'], correctIndex: 0, explanation: "The letter W!" },
    { id: 'm13', difficulty: 'medium', question: "What occurs once in every minute, twice in every moment, yet never in a thousand years?", answers: ['The letter M', 'Time', 'A Breath', 'A Blink'], correctIndex: 0, explanation: "The letter M!" },
    { id: 'm14', difficulty: 'medium', question: "What building has the most stories?", answers: ['A Library', 'A Skyscraper', 'A Mall', 'A Museum'], correctIndex: 0, explanation: "A Library!" },
    { id: 'm15', difficulty: 'medium', question: "What kind of coat is best put on wet?", answers: ['Paint', 'Raincoat', 'Fur Coat', 'Lab Coat'], correctIndex: 0, explanation: "A coat of paint!" },
    { id: 'm16', difficulty: 'medium', question: "What has a thumb and four fingers but isn't alive?", answers: ['A Glove', 'A Hand', 'A Robot', 'A Statue'], correctIndex: 0, explanation: "A Glove!" },
    { id: 'm17', difficulty: 'medium', question: "What can run but never walks, has a mouth but never talks?", answers: ['A River', 'A Car', 'A Clock', 'Wind'], correctIndex: 0, explanation: "A River!" },
    { id: 'm18', difficulty: 'medium', question: "What breaks yet never falls, and what falls yet never breaks?", answers: ['Day & Night', 'Glass & Feather', 'Ice & Rain', 'Wave & Snow'], correctIndex: 0, explanation: "Day breaks and night falls!" },
    { id: 'm19', difficulty: 'medium', question: "What word is spelled incorrectly in every dictionary?", answers: ['Incorrectly', 'Wrong', 'Mistake', 'Error'], correctIndex: 0, explanation: "Incorrectly!" },
    { id: 'm20', difficulty: 'medium', question: "What begins and has no end, and ends all things that begin?", answers: ['Death', 'Life', 'Time', 'Infinity'], correctIndex: 0, explanation: "Death!" },
    { id: 'm21', difficulty: 'medium', question: "What always ends everything?", answers: ['The letter G', 'Death', 'Time', 'The End'], correctIndex: 0, explanation: "The letter G!" },
    { id: 'm22', difficulty: 'medium', question: "What comes down but never goes up?", answers: ['Rain', 'A Slide', 'Gravity', 'Temperature'], correctIndex: 0, explanation: "Rain!" },
    { id: 'm23', difficulty: 'medium', question: "What month of the year has 28 days?", answers: ['All of them', 'February', 'None', 'January'], correctIndex: 0, explanation: "All months have at least 28 days!" },
    { id: 'm24', difficulty: 'medium', question: "What can't be used until it's broken?", answers: ['An Egg', 'A Promise', 'A Seal', 'A Safe'], correctIndex: 0, explanation: "An Egg!" },
    { id: 'm25', difficulty: 'medium', question: "What has a bank but no money?", answers: ['A River', 'A Piggy Bank', 'A Game', 'A Lake'], correctIndex: 0, explanation: "A River!" },

    // HARD (25 questions)
    { id: '11', difficulty: 'hard', question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", answers: ['A Map', 'A Dream', 'A Planet', 'A Globe'], correctIndex: 0, explanation: "A Map!" },
    { id: '12', difficulty: 'hard', question: "The person who makes it has no need of it; the person who buys it has no use for it. The person who uses it can neither see nor feel it. What is it?", answers: ['A Coffin', 'A Gift', 'A Secret', 'A Lie'], correctIndex: 0, explanation: "A Coffin!" },
    { id: '13', difficulty: 'hard', question: "What belongs to you, but other people use it more than you?", answers: ['Your Name', 'Your Money', 'Your Car', 'Your House'], correctIndex: 0, explanation: "Your Name!" },
    { id: '14', difficulty: 'hard', question: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?", answers: ['Fire', 'A Balloon', 'A Plant', 'Ice'], correctIndex: 0, explanation: "Fire!" },
    { id: '15', difficulty: 'hard', question: "What is always in front of you but can't be seen?", answers: ['The Future', 'The Past', 'Your Nose', 'Air'], correctIndex: 0, explanation: "The Future!" },
    { id: 'h6', difficulty: 'hard', question: "What is seen in the middle of March and April that can't be seen at the beginning or end of either month?", answers: ['The letter R', 'Spring', 'Rain', 'Flowers'], correctIndex: 0, explanation: "The letter R!" },
    { id: 'h7', difficulty: 'hard', question: "I am taken from a mine and shut up in a wooden case, from which I am never released. Yet I am used by almost everybody. What am I?", answers: ['Pencil Lead', 'Coal', 'Diamond', 'Metal'], correctIndex: 0, explanation: "Pencil lead (graphite)!" },
    { id: 'h8', difficulty: 'hard', question: "What disappears the moment you say its name?", answers: ['Silence', 'Nothing', 'A Secret', 'Darkness'], correctIndex: 0, explanation: "Silence!" },
    { id: 'h9', difficulty: 'hard', question: "I can be cracked, made, told, and played. What am I?", answers: ['A Joke', 'An Egg', 'A Game', 'Music'], correctIndex: 0, explanation: "A Joke!" },
    { id: 'h10', difficulty: 'hard', question: "The more you take, the more you leave behind. What am I?", answers: ['Footsteps', 'Time', 'Memories', 'Money'], correctIndex: 0, explanation: "Footsteps!" },
    { id: 'h11', difficulty: 'hard', question: "What can travel around the world while staying in a corner?", answers: ['A Stamp', 'A Spider', 'Dust', 'A Shadow'], correctIndex: 0, explanation: "A stamp!" },
    { id: 'h12', difficulty: 'hard', question: "What word becomes shorter when you add two letters to it?", answers: ['Short', 'Long', 'Word', 'Brief'], correctIndex: 0, explanation: "Short (add 'er' = shorter)!" },
    { id: 'h13', difficulty: 'hard', question: "What has four wheels and flies?", answers: ['A Garbage Truck', 'A Plane', 'A Car', 'A Bike'], correctIndex: 0, explanation: "A garbage truck!" },
    { id: 'h14', difficulty: 'hard', question: "What 5-letter word becomes shorter when you add two letters to it?", answers: ['Short', 'Bread', 'Light', 'Heart'], correctIndex: 0, explanation: "Short (shorter)!" },
    { id: 'h15', difficulty: 'hard', question: "What appears once in a year, twice in a week, but never in a day?", answers: ['The letter E', 'The letter Y', 'Time', 'Sunday'], correctIndex: 0, explanation: "The letter E!" },
    { id: 'h16', difficulty: 'hard', question: "What can't talk but will reply when spoken to?", answers: ['An Echo', 'A Mirror', 'A Phone', 'A Radio'], correctIndex: 0, explanation: "An Echo!" },
    { id: 'h17', difficulty: 'hard', question: "What has a head, a tail, is brown, and has no legs?", answers: ['A Penny', 'A Snake', 'A Worm', 'A Rope'], correctIndex: 0, explanation: "A penny!" },
    { id: 'h18', difficulty: 'hard', question: "What has cities but no people, forests but no trees, and rivers but no water?", answers: ['A Map', 'A Model', 'A Game', 'A Painting'], correctIndex: 0, explanation: "A map!" },
    { id: 'h19', difficulty: 'hard', question: "What can point in every direction but can't reach the destination by itself?", answers: ['Your Finger', 'A Compass', 'An Arrow', 'A Sign'], correctIndex: 1, explanation: "A compass!" },
    { id: 'h20', difficulty: 'hard', question: "What goes through cities and fields but never moves?", answers: ['A Road', 'A River', 'The Wind', 'Light'], correctIndex: 0, explanation: "A road!" },
    { id: 'h21', difficulty: 'hard', question: "What has a heart that doesn't beat?", answers: ['An Artichoke', 'A Statue', 'A Robot', 'A Painting'], correctIndex: 0, explanation: "An artichoke!" },
    { id: 'h22', difficulty: 'hard', question: "What kind of room has no doors or windows?", answers: ['A Mushroom', 'A Classroom', 'A Bathroom', 'A Bedroom'], correctIndex: 0, explanation: "A mushroom!" },
    { id: 'h23', difficulty: 'hard', question: "What is the longest word in the dictionary?", answers: ['Smiles', 'Dictionary', 'Encyclopedia', 'Extraordinary'], correctIndex: 0, explanation: "Smiles (mile between the s's)!" },
    { id: 'h24', difficulty: 'hard', question: "What starts with P, ends with E, and has thousands of letters?", answers: ['Post Office', 'Postage', 'Parcel', 'Package'], correctIndex: 0, explanation: "Post Office!" },
    { id: 'h25', difficulty: 'hard', question: "What has hands but can't scratch itself?", answers: ['A Clock', 'A Watch', 'A Robot', 'A Glove'], correctIndex: 0, explanation: "A clock!" },
];

export function getTrickyQuestions(difficulty: Difficulty, count: number): TrickyQuestion[] {
    const filtered = TRICKY_QUESTIONS.filter(q => q.difficulty === difficulty);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
