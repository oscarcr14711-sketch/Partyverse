export interface Phrase {
    text: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    clue: string; // Clue to help players guess the phrase
}

export const phrases: Phrase[] = [
    // Movie Quotes
    { text: 'MAY THE FORCE BE WITH YOU', category: 'Movie Quotes', difficulty: 'easy', clue: 'A Jedi master\'s blessing in a galaxy far, far away' },
    { text: 'I WILL BE BACK', category: 'Movie Quotes', difficulty: 'easy', clue: 'A cyborg\'s promise to return' },
    { text: 'JUST KEEP SWIMMING', category: 'Movie Quotes', difficulty: 'easy', clue: 'A forgetful blue fish\'s advice' },
    { text: 'TO INFINITY AND BEYOND', category: 'Movie Quotes', difficulty: 'easy', clue: 'A space ranger\'s catchphrase' },
    { text: 'THERE IS NO PLACE LIKE HOME', category: 'Movie Quotes', difficulty: 'medium', clue: 'Dorothy clicks her ruby slippers and says...' },
    { text: 'YOU CANNOT HANDLE THE TRUTH', category: 'Movie Quotes', difficulty: 'medium', clue: 'A military courtroom outburst' },
    { text: 'HERE IS LOOKING AT YOU KID', category: 'Movie Quotes', difficulty: 'medium', clue: 'A toast in Casablanca' },
    { text: 'I AM GOING TO MAKE HIM AN OFFER HE CANNOT REFUSE', category: 'Movie Quotes', difficulty: 'hard', clue: 'The Godfather\'s business strategy' },
    { text: 'LIFE IS LIKE A BOX OF CHOCOLATES', category: 'Movie Quotes', difficulty: 'easy', clue: 'Forrest Gump\'s mother\'s wisdom' },
    { text: 'YOU TALKING TO ME', category: 'Movie Quotes', difficulty: 'medium', clue: 'Travis Bickle in front of a mirror' },
    { text: 'WHY SO SERIOUS', category: 'Movie Quotes', difficulty: 'easy', clue: 'The Joker\'s favorite question' },
    { text: 'I SEE DEAD PEOPLE', category: 'Movie Quotes', difficulty: 'easy', clue: 'A boy with a sixth sense' },

    // Song Lyrics
    { text: 'SHAKE IT OFF', category: 'Song Lyrics', difficulty: 'easy', clue: 'Taylor Swift\'s advice about haters' },
    { text: 'LET IT BE', category: 'Song Lyrics', difficulty: 'easy', clue: 'The Beatles speaking words of wisdom' },
    { text: 'DONT STOP BELIEVING', category: 'Song Lyrics', difficulty: 'easy', clue: 'Journey\'s anthem for small town dreamers' },
    { text: 'I WANT TO HOLD YOUR HAND', category: 'Song Lyrics', difficulty: 'medium', clue: 'Early Beatles romance' },
    { text: 'WE ARE THE CHAMPIONS', category: 'Song Lyrics', difficulty: 'medium', clue: 'Queen\'s victory anthem' },
    { text: 'EVERY BREATH YOU TAKE', category: 'Song Lyrics', difficulty: 'medium', clue: 'The Police will be watching you' },
    { text: 'IS THIS THE REAL LIFE IS THIS JUST FANTASY', category: 'Song Lyrics', difficulty: 'hard', clue: 'The opening lines of Bohemian Rhapsody' },
    { text: 'SWEET DREAMS ARE MADE OF THIS', category: 'Song Lyrics', difficulty: 'medium', clue: 'Eurythmics traveled the world for this' },
    { text: 'ANOTHER ONE BITES THE DUST', category: 'Song Lyrics', difficulty: 'easy', clue: 'Queen\'s bass-heavy hit about falling' },
    { text: 'YELLOW SUBMARINE', category: 'Song Lyrics', difficulty: 'easy', clue: 'The Beatles\' underwater colorful vehicle' },

    // Famous Sayings
    { text: 'PRACTICE MAKES PERFECT', category: 'Famous Sayings', difficulty: 'easy', clue: 'How to master a skill' },
    { text: 'TIME IS MONEY', category: 'Famous Sayings', difficulty: 'easy', clue: 'Benjamin Franklin\'s economic wisdom' },
    { text: 'BETTER LATE THAN NEVER', category: 'Famous Sayings', difficulty: 'easy', clue: 'An excuse for delayed arrival' },
    { text: 'ACTIONS SPEAK LOUDER THAN WORDS', category: 'Famous Sayings', difficulty: 'medium', clue: 'Show, don\'t tell' },
    { text: 'THE EARLY BIRD CATCHES THE WORM', category: 'Famous Sayings', difficulty: 'medium', clue: 'Why you should wake up early' },
    { text: 'WHEN LIFE GIVES YOU LEMONS MAKE LEMONADE', category: 'Famous Sayings', difficulty: 'hard', clue: 'Turn bad situations into good ones' },
    { text: 'A PICTURE IS WORTH A THOUSAND WORDS', category: 'Famous Sayings', difficulty: 'medium', clue: 'Visual communication beats text' },
    { text: 'DONT JUDGE A BOOK BY ITS COVER', category: 'Famous Sayings', difficulty: 'medium', clue: 'Appearances can be deceiving' },
    { text: 'EVERY CLOUD HAS A SILVER LINING', category: 'Famous Sayings', difficulty: 'medium', clue: 'Finding the positive in negativity' },

    // TV Shows
    { text: 'BREAKING BAD', category: 'TV Shows', difficulty: 'easy', clue: 'A chemistry teacher turns to crime' },
    { text: 'STRANGER THINGS', category: 'TV Shows', difficulty: 'easy', clue: 'Kids in the 80s fight supernatural forces' },
    { text: 'THE OFFICE', category: 'TV Shows', difficulty: 'easy', clue: 'A mockumentary about paper company employees' },
    { text: 'GAME OF THRONES', category: 'TV Shows', difficulty: 'easy', clue: 'Fantasy kingdoms fighting for power' },
    { text: 'THE WALKING DEAD', category: 'TV Shows', difficulty: 'medium', clue: 'Survivors in a zombie apocalypse' },
    { text: 'BETTER CALL SAUL', category: 'TV Shows', difficulty: 'medium', clue: 'A lawyer\'s origin story in Albuquerque' },
    { text: 'HOW I MET YOUR MOTHER', category: 'TV Shows', difficulty: 'medium', clue: 'A father tells his kids a very long story' },
    { text: 'FRIENDS', category: 'TV Shows', difficulty: 'easy', clue: 'Six people hang out at Central Perk' },
    { text: 'THE BIG BANG THEORY', category: 'TV Shows', difficulty: 'easy', clue: 'Nerdy physicists and their neighbor' },

    // Book Titles
    { text: 'HARRY POTTER', category: 'Book Titles', difficulty: 'easy', clue: 'The boy who lived goes to wizard school' },
    { text: 'THE HUNGER GAMES', category: 'Book Titles', difficulty: 'easy', clue: 'Teens fight to the death on TV' },
    { text: 'TO KILL A MOCKINGBIRD', category: 'Book Titles', difficulty: 'medium', clue: 'Scout Finch learns about racial injustice' },
    { text: 'THE GREAT GATSBY', category: 'Book Titles', difficulty: 'medium', clue: 'A mysterious millionaire and the green light' },
    { text: 'ONE HUNDRED YEARS OF SOLITUDE', category: 'Book Titles', difficulty: 'hard', clue: 'Gabriel García Márquez\'s Macondo family saga' },
    { text: 'THE CATCHER IN THE RYE', category: 'Book Titles', difficulty: 'medium', clue: 'Holden Caulfield\'s teenage angst' },
    { text: 'PRIDE AND PREJUDICE', category: 'Book Titles', difficulty: 'medium', clue: 'Elizabeth Bennet meets Mr. Darcy' },
    { text: 'THE LORD OF THE RINGS', category: 'Book Titles', difficulty: 'easy', clue: 'A hobbit must destroy a powerful ring' },

    // Common Expressions
    { text: 'BREAK A LEG', category: 'Common Expressions', difficulty: 'easy', clue: 'Good luck wish before a performance' },
    { text: 'PIECE OF CAKE', category: 'Common Expressions', difficulty: 'easy', clue: 'Something very easy to do' },
    { text: 'SPILL THE BEANS', category: 'Common Expressions', difficulty: 'easy', clue: 'Reveal a secret accidentally' },
    { text: 'HIT THE NAIL ON THE HEAD', category: 'Common Expressions', difficulty: 'medium', clue: 'Get something exactly right' },
    { text: 'KILL TWO BIRDS WITH ONE STONE', category: 'Common Expressions', difficulty: 'medium', clue: 'Accomplish two things at once' },
    { text: 'THE BALL IS IN YOUR COURT', category: 'Common Expressions', difficulty: 'medium', clue: 'It\'s your turn to make a decision' },
    { text: 'BITE THE BULLET', category: 'Common Expressions', difficulty: 'medium', clue: 'Face a difficult situation bravely' },
    { text: 'COSTS AN ARM AND A LEG', category: 'Common Expressions', difficulty: 'easy', clue: 'Something very expensive' },
];

export function getRandomPhrase(category: string): Phrase {
    let filteredPhrases = phrases;

    if (category !== 'Random Mix') {
        filteredPhrases = phrases.filter(p => p.category === category);
    }

    const randomIndex = Math.floor(Math.random() * filteredPhrases.length);
    return filteredPhrases[randomIndex];
}
