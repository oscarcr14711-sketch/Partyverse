export interface Phrase {
    text: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export const phrases: Phrase[] = [
    // Movie Quotes
    { text: 'MAY THE FORCE BE WITH YOU', category: 'Movie Quotes', difficulty: 'easy' },
    { text: 'I WILL BE BACK', category: 'Movie Quotes', difficulty: 'easy' },
    { text: 'JUST KEEP SWIMMING', category: 'Movie Quotes', difficulty: 'easy' },
    { text: 'TO INFINITY AND BEYOND', category: 'Movie Quotes', difficulty: 'easy' },
    { text: 'THERE IS NO PLACE LIKE HOME', category: 'Movie Quotes', difficulty: 'medium' },
    { text: 'YOU CANNOT HANDLE THE TRUTH', category: 'Movie Quotes', difficulty: 'medium' },
    { text: 'HERE IS LOOKING AT YOU KID', category: 'Movie Quotes', difficulty: 'medium' },
    { text: 'I AM GOING TO MAKE HIM AN OFFER HE CANNOT REFUSE', category: 'Movie Quotes', difficulty: 'hard' },

    // Song Lyrics
    { text: 'SHAKE IT OFF', category: 'Song Lyrics', difficulty: 'easy' },
    { text: 'LET IT BE', category: 'Song Lyrics', difficulty: 'easy' },
    { text: 'DONT STOP BELIEVING', category: 'Song Lyrics', difficulty: 'easy' },
    { text: 'I WANT TO HOLD YOUR HAND', category: 'Song Lyrics', difficulty: 'medium' },
    { text: 'WE ARE THE CHAMPIONS', category: 'Song Lyrics', difficulty: 'medium' },
    { text: 'EVERY BREATH YOU TAKE', category: 'Song Lyrics', difficulty: 'medium' },
    { text: 'IS THIS THE REAL LIFE IS THIS JUST FANTASY', category: 'Song Lyrics', difficulty: 'hard' },

    // Famous Sayings
    { text: 'PRACTICE MAKES PERFECT', category: 'Famous Sayings', difficulty: 'easy' },
    { text: 'TIME IS MONEY', category: 'Famous Sayings', difficulty: 'easy' },
    { text: 'BETTER LATE THAN NEVER', category: 'Famous Sayings', difficulty: 'easy' },
    { text: 'ACTIONS SPEAK LOUDER THAN WORDS', category: 'Famous Sayings', difficulty: 'medium' },
    { text: 'THE EARLY BIRD CATCHES THE WORM', category: 'Famous Sayings', difficulty: 'medium' },
    { text: 'WHEN LIFE GIVES YOU LEMONS MAKE LEMONADE', category: 'Famous Sayings', difficulty: 'hard' },

    // TV Shows
    { text: 'BREAKING BAD', category: 'TV Shows', difficulty: 'easy' },
    { text: 'STRANGER THINGS', category: 'TV Shows', difficulty: 'easy' },
    { text: 'THE OFFICE', category: 'TV Shows', difficulty: 'easy' },
    { text: 'GAME OF THRONES', category: 'TV Shows', difficulty: 'easy' },
    { text: 'THE WALKING DEAD', category: 'TV Shows', difficulty: 'medium' },
    { text: 'BETTER CALL SAUL', category: 'TV Shows', difficulty: 'medium' },
    { text: 'HOW I MET YOUR MOTHER', category: 'TV Shows', difficulty: 'medium' },

    // Book Titles
    { text: 'HARRY POTTER', category: 'Book Titles', difficulty: 'easy' },
    { text: 'THE HUNGER GAMES', category: 'Book Titles', difficulty: 'easy' },
    { text: 'TO KILL A MOCKINGBIRD', category: 'Book Titles', difficulty: 'medium' },
    { text: 'THE GREAT GATSBY', category: 'Book Titles', difficulty: 'medium' },
    { text: 'ONE HUNDRED YEARS OF SOLITUDE', category: 'Book Titles', difficulty: 'hard' },
    { text: 'THE CATCHER IN THE RYE', category: 'Book Titles', difficulty: 'medium' },
];

export function getRandomPhrase(category: string): Phrase {
    let filteredPhrases = phrases;

    if (category !== 'Random Mix') {
        filteredPhrases = phrases.filter(p => p.category === category);
    }

    const randomIndex = Math.floor(Math.random() * filteredPhrases.length);
    return filteredPhrases[randomIndex];
}
