// Brain vs Brain Trivia Questions Database
// 2400 questions total: 8 categories × 3 difficulties × 100 questions each

export type Category =
    | 'pop_culture'
    | 'geography'
    | 'science'
    | 'art_literature'
    | 'history'
    | 'sports'
    | 'music'
    | 'mixed';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type TriviaQuestion = {
    id: string;
    category: Category;
    difficulty: Difficulty;
    question: string;
    answers: string[];
    correctIndex: number;
    funFact?: string;
};

export const CATEGORY_INFO = {
    pop_culture: { name: 'Pop Culture', icon: '🎬', color: '#E91E63' },
    geography: { name: 'Geography', icon: '🌍', color: '#4CAF50' },
    science: { name: 'Science', icon: '🧪', color: '#2196F3' },
    art_literature: { name: 'Art & Literature', icon: '🎨', color: '#9C27B0' },
    history: { name: 'History', icon: '🕰', color: '#FF9800' },
    sports: { name: 'Sports', icon: '🏆', color: '#F44336' },
    music: { name: 'Music', icon: '🎧', color: '#00BCD4' },
    mixed: { name: 'Mixed Random', icon: '❓', color: '#FFC107' },
};

// Due to the large size, questions are organized by category and difficulty
// This file contains the first batch - more questions in separate imports

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
    // ===== POP CULTURE - EASY =====
    { id: 'pc_e_001', category: 'pop_culture', difficulty: 'easy', question: "What's the name of the yellow cartoon sponge who lives in a pineapple?", answers: ['SpongeBob SquarePants', 'Patrick Star', 'Squidward', 'Mr. Krabs'], correctIndex: 0 },
    { id: 'pc_e_002', category: 'pop_culture', difficulty: 'easy', question: 'Which superhero is called "The Dark Knight"?', answers: ['Superman', 'Batman', 'Spider-Man', 'Iron Man'], correctIndex: 1 },
    { id: 'pc_e_003', category: 'pop_culture', difficulty: 'easy', question: 'What app is famous for short dance videos?', answers: ['Instagram', 'Snapchat', 'TikTok', 'Twitter'], correctIndex: 2 },
    { id: 'pc_e_004', category: 'pop_culture', difficulty: 'easy', question: 'What color is Mickey Mouse\'s shorts?', answers: ['Blue', 'Red', 'Yellow', 'Green'], correctIndex: 1 },
    { id: 'pc_e_005', category: 'pop_culture', difficulty: 'easy', question: 'In "Frozen", what is the name of the snowman?', answers: ['Kristoff', 'Hans', 'Olaf', 'Sven'], correctIndex: 2 },
    { id: 'pc_e_006', category: 'pop_culture', difficulty: 'easy', question: 'What streaming service has a red "N" logo?', answers: ['Hulu', 'Netflix', 'Disney+', 'Prime Video'], correctIndex: 1 },
    { id: 'pc_e_007', category: 'pop_culture', difficulty: 'easy', question: 'Which superhero has a shield with a star?', answers: ['Captain America', 'Thor', 'Hulk', 'Black Widow'], correctIndex: 0 },
    { id: 'pc_e_008', category: 'pop_culture', difficulty: 'easy', question: 'What is Baby Yoda\'s real name?', answers: ['Yoda Jr.', 'Grogu', 'Mando', 'Din'], correctIndex: 1 },
    { id: 'pc_e_009', category: 'pop_culture', difficulty: 'easy', question: 'What color pill does Neo take in The Matrix?', answers: ['Blue', 'Red', 'Green', 'Yellow'], correctIndex: 1 },
    { id: 'pc_e_010', category: 'pop_culture', difficulty: 'easy', question: 'Which Disney princess has a pet tiger?', answers: ['Ariel', 'Belle', 'Jasmine', 'Mulan'], correctIndex: 2 },
    { id: 'pc_e_011', category: 'pop_culture', difficulty: 'easy', question: 'What is Superman\'s weakness?', answers: ['Kryptonite', 'Water', 'Fire', 'Gold'], correctIndex: 0 },
    { id: 'pc_e_012', category: 'pop_culture', difficulty: 'easy', question: 'In Harry Potter, what house is Harry in?', answers: ['Slytherin', 'Hufflepuff', 'Gryffindor', 'Ravenclaw'], correctIndex: 2 },
    { id: 'pc_e_013', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the toy cowboy in Toy Story?', answers: ['Buzz', 'Woody', 'Rex', 'Hamm'], correctIndex: 1 },
    { id: 'pc_e_014', category: 'pop_culture', difficulty: 'easy', question: 'Which social media platform uses a bird logo?', answers: ['Facebook', 'Instagram', 'Twitter/X', 'LinkedIn'], correctIndex: 2 },
    { id: 'pc_e_015', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the wizarding school in Harry Potter?', answers: ['Hogwarts', 'Beauxbatons', 'Durmstrang', 'Ilvermorny'], correctIndex: 0 },
    { id: 'pc_e_016', category: 'pop_culture', difficulty: 'easy', question: 'In "The Lion King", what is Simba\'s father\'s name?', answers: ['Scar', 'Mufasa', 'Rafiki', 'Zazu'], correctIndex: 1 },
    { id: 'pc_e_017', category: 'pop_culture', difficulty: 'easy', question: 'What gaming console is made by Sony?', answers: ['Xbox', 'Nintendo Switch', 'PlayStation', 'Wii'], correctIndex: 2 },
    { id: 'pc_e_018', category: 'pop_culture', difficulty: 'easy', question: 'Which Marvel hero is a billionaire genius?', answers: ['Captain America', 'Thor', 'Iron Man', 'Hulk'], correctIndex: 2 },
    { id: 'pc_e_019', category: 'pop_culture', difficulty: 'easy', question: 'What color is Shrek?', answers: ['Blue', 'Green', 'Brown', 'Yellow'], correctIndex: 1 },
    { id: 'pc_e_020', category: 'pop_culture', difficulty: 'easy', question: 'In "Finding Nemo", what type of fish is Nemo?', answers: ['Clownfish', 'Goldfish', 'Angelfish', 'Pufferfish'], correctIndex: 0 },

    // Continue with more Pop Culture Easy questions...
    { id: 'pc_e_021', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the wizarding currency in Harry Potter?', answers: ['Dollars', 'Galleons', 'Crowns', 'Coins'], correctIndex: 1 },
    { id: 'pc_e_022', category: 'pop_culture', difficulty: 'easy', question: 'Which streaming service created "Stranger Things"?', answers: ['Hulu', 'Netflix', 'Amazon Prime', 'Disney+'], correctIndex: 1 },
    { id: 'pc_e_023', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "The Hunger Games"?', answers: ['Peeta', 'Katniss', 'Gale', 'Prim'], correctIndex: 1 },
    { id: 'pc_e_024', category: 'pop_culture', difficulty: 'easy', question: 'Which video game features a plumber saving a princess?', answers: ['Sonic', 'Mario', 'Zelda', 'Pac-Man'], correctIndex: 1 },
    { id: 'pc_e_025', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of Thor\'s hammer?', answers: ['Mjolnir', 'Stormbreaker', 'Gungnir', 'Excalibur'], correctIndex: 0 },

    // Adding 75 more Pop Culture Easy questions to reach 100
    { id: 'pc_e_026', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the dragon in "Mulan"?', answers: ['Mushu', 'Cri-Kee', 'Khan', 'Shan Yu'], correctIndex: 0 },
    { id: 'pc_e_027', category: 'pop_culture', difficulty: 'easy', question: 'Which superhero can climb walls?', answers: ['Batman', 'Superman', 'Spider-Man', 'Flash'], correctIndex: 2 },
    { id: 'pc_e_028', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of Elsa\'s sister in "Frozen"?', answers: ['Anna', 'Belle', 'Ariel', 'Rapunzel'], correctIndex: 0 },
    { id: 'pc_e_029', category: 'pop_culture', difficulty: 'easy', question: 'Which platform is known for 280-character posts?', answers: ['Facebook', 'Instagram', 'Twitter/X', 'TikTok'], correctIndex: 2 },
    { id: 'pc_e_030', category: 'pop_culture', difficulty: 'easy', question: 'What color is the Incredible Hulk?', answers: ['Red', 'Blue', 'Green', 'Purple'], correctIndex: 2 },
    { id: 'pc_e_031', category: 'pop_culture', difficulty: 'easy', question: 'In "Aladdin", what is the name of the princess?', answers: ['Jasmine', 'Belle', 'Ariel', 'Cinderella'], correctIndex: 0 },
    { id: 'pc_e_032', category: 'pop_culture', difficulty: 'easy', question: 'What gaming company created Pokémon?', answers: ['Sony', 'Microsoft', 'Nintendo', 'Sega'], correctIndex: 2 },
    { id: 'pc_e_033', category: 'pop_culture', difficulty: 'easy', question: 'Which Marvel hero has a metal arm?', answers: ['Iron Man', 'Winter Soldier', 'War Machine', 'Falcon'], correctIndex: 1 },
    { id: 'pc_e_034', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the cowgirl in Toy Story?', answers: ['Bo Peep', 'Jessie', 'Barbie', 'Mrs. Potato Head'], correctIndex: 1 },
    { id: 'pc_e_035', category: 'pop_culture', difficulty: 'easy', question: 'Which Disney movie features "Let It Go"?', answers: ['Moana', 'Frozen', 'Tangled', 'Brave'], correctIndex: 1 },
    { id: 'pc_e_036', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "The Little Mermaid"?', answers: ['Maleficent', 'Ursula', 'Cruella', 'Jafar'], correctIndex: 1 },
    { id: 'pc_e_037', category: 'pop_culture', difficulty: 'easy', question: 'Which social media app is owned by Meta?', answers: ['TikTok', 'Twitter', 'Instagram', 'Snapchat'], correctIndex: 2 },
    { id: 'pc_e_038', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the talking dog in "Up"?', answers: ['Dug', 'Kevin', 'Russell', 'Carl'], correctIndex: 0 },
    { id: 'pc_e_039', category: 'pop_culture', difficulty: 'easy', question: 'Which superhero is from Wakanda?', answers: ['Black Widow', 'Black Panther', 'Falcon', 'War Machine'], correctIndex: 1 },
    { id: 'pc_e_040', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the rat in "Ratatouille"?', answers: ['Remy', 'Linguini', 'Gusteau', 'Skinner'], correctIndex: 0 },
    { id: 'pc_e_041', category: 'pop_culture', difficulty: 'easy', question: 'Which video game features building with blocks?', answers: ['Fortnite', 'Minecraft', 'Roblox', 'Terraria'], correctIndex: 1 },
    { id: 'pc_e_042', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Moana"?', answers: ['Moana', 'Maui', 'Tala', 'Sina'], correctIndex: 0 },
    { id: 'pc_e_043', category: 'pop_culture', difficulty: 'easy', question: 'Which Marvel hero uses a bow and arrow?', answers: ['Black Widow', 'Hawkeye', 'Falcon', 'Vision'], correctIndex: 1 },
    { id: 'pc_e_044', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Brave"?', answers: ['Merida', 'Moana', 'Elsa', 'Anna'], correctIndex: 0 },
    { id: 'pc_e_045', category: 'pop_culture', difficulty: 'easy', question: 'Which platform is known for disappearing messages?', answers: ['Instagram', 'Snapchat', 'WhatsApp', 'Telegram'], correctIndex: 1 },
    { id: 'pc_e_046', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "Sleeping Beauty"?', answers: ['Ursula', 'Maleficent', 'Cruella', 'Evil Queen'], correctIndex: 1 },
    { id: 'pc_e_047', category: 'pop_culture', difficulty: 'easy', question: 'Which superhero has a lasso of truth?', answers: ['Black Widow', 'Wonder Woman', 'Catwoman', 'Supergirl'], correctIndex: 1 },
    { id: 'pc_e_048', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Tangled"?', answers: ['Rapunzel', 'Flynn', 'Gothel', 'Pascal'], correctIndex: 0 },
    { id: 'pc_e_049', category: 'pop_culture', difficulty: 'easy', question: 'Which video game features battle royale on an island?', answers: ['Minecraft', 'Roblox', 'Fortnite', 'PUBG'], correctIndex: 2 },
    { id: 'pc_e_050', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "101 Dalmatians"?', answers: ['Maleficent', 'Ursula', 'Cruella de Vil', 'Evil Queen'], correctIndex: 2 },

    // Continue to 100 Pop Culture Easy...
    { id: 'pc_e_051', category: 'pop_culture', difficulty: 'easy', question: 'Which Marvel hero can shrink?', answers: ['Ant-Man', 'Wasp', 'Both A and B', 'Iron Man'], correctIndex: 2 },
    { id: 'pc_e_052', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Encanto"?', answers: ['Mirabel', 'Isabela', 'Luisa', 'Dolores'], correctIndex: 0 },
    { id: 'pc_e_053', category: 'pop_culture', difficulty: 'easy', question: 'Which social media platform uses hashtags?', answers: ['All of them', 'None of them', 'Only Twitter', 'Only Instagram'], correctIndex: 0 },
    { id: 'pc_e_054', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "Aladdin"?', answers: ['Jafar', 'Iago', 'Razoul', 'Sultan'], correctIndex: 0 },
    { id: 'pc_e_055', category: 'pop_culture', difficulty: 'easy', question: 'Which superhero is the fastest man alive?', answers: ['Quicksilver', 'The Flash', 'Superman', 'Sonic'], correctIndex: 1 },
    { id: 'pc_e_056', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Coco"?', answers: ['Miguel', 'Hector', 'Ernesto', 'Dante'], correctIndex: 0 },
    { id: 'pc_e_057', category: 'pop_culture', difficulty: 'easy', question: 'Which video game features a hedgehog?', answers: ['Mario', 'Sonic', 'Crash Bandicoot', 'Spyro'], correctIndex: 1 },
    { id: 'pc_e_058', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "The Lion King"?', answers: ['Scar', 'Mufasa', 'Simba', 'Zazu'], correctIndex: 0 },
    { id: 'pc_e_059', category: 'pop_culture', difficulty: 'easy', question: 'Which Marvel hero is a god of thunder?', answers: ['Zeus', 'Thor', 'Hercules', 'Odin'], correctIndex: 1 },
    { id: 'pc_e_060', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Inside Out"?', answers: ['Joy', 'Sadness', 'Riley', 'Anger'], correctIndex: 2 },
    { id: 'pc_e_061', category: 'pop_culture', difficulty: 'easy', question: 'Which platform is known for professional networking?', answers: ['Facebook', 'LinkedIn', 'Twitter', 'Instagram'], correctIndex: 1 },
    { id: 'pc_e_062', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "Tangled"?', answers: ['Mother Gothel', 'Maleficent', 'Ursula', 'Evil Queen'], correctIndex: 0 },
    { id: 'pc_e_063', category: 'pop_culture', difficulty: 'easy', question: 'Which superhero has claws?', answers: ['Wolverine', 'Black Panther', 'Catwoman', 'All of them'], correctIndex: 3 },
    { id: 'pc_e_064', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Wreck-It Ralph"?', answers: ['Ralph', 'Felix', 'Vanellope', 'King Candy'], correctIndex: 0 },
    { id: 'pc_e_065', category: 'pop_culture', difficulty: 'easy', question: 'Which video game features catching creatures in balls?', answers: ['Digimon', 'Pokémon', 'Monster Hunter', 'Yo-Kai Watch'], correctIndex: 1 },
    { id: 'pc_e_066', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "Frozen"?', answers: ['Hans', 'Elsa', 'Duke of Weselton', 'Marshmallow'], correctIndex: 0 },
    { id: 'pc_e_067', category: 'pop_culture', difficulty: 'easy', question: 'Which Marvel hero is a master of martial arts?', answers: ['Iron Fist', 'Shang-Chi', 'Black Widow', 'All of them'], correctIndex: 3 },
    { id: 'pc_e_068', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Big Hero 6"?', answers: ['Hiro', 'Baymax', 'Tadashi', 'Fred'], correctIndex: 0 },
    { id: 'pc_e_069', category: 'pop_culture', difficulty: 'easy', question: 'Which social media platform is owned by ByteDance?', answers: ['Instagram', 'Snapchat', 'TikTok', 'Twitter'], correctIndex: 2 },
    { id: 'pc_e_070', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "Mulan"?', answers: ['Shan Yu', 'Chi-Fu', 'Mushu', 'Li Shang'], correctIndex: 0 },
    { id: 'pc_e_071', category: 'pop_culture', difficulty: 'easy', question: 'Which superhero has a magic ring?', answers: ['Green Lantern', 'Doctor Strange', 'Scarlet Witch', 'Vision'], correctIndex: 0 },
    { id: 'pc_e_072', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Zootopia"?', answers: ['Judy Hopps', 'Nick Wilde', 'Chief Bogo', 'Flash'], correctIndex: 0 },
    { id: 'pc_e_073', category: 'pop_culture', difficulty: 'easy', question: 'Which video game features a battle between plants and zombies?', answers: ['Plants vs Zombies', 'Garden Warfare', 'Both A and B', 'Neither'], correctIndex: 2 },
    { id: 'pc_e_074', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "Hercules"?', answers: ['Hades', 'Zeus', 'Pain', 'Panic'], correctIndex: 0 },
    { id: 'pc_e_075', category: 'pop_culture', difficulty: 'easy', question: 'Which Marvel hero is a sorcerer?', answers: ['Loki', 'Doctor Strange', 'Scarlet Witch', 'Vision'], correctIndex: 1 },
    { id: 'pc_e_076', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "The Incredibles"?', answers: ['Mr. Incredible', 'Elastigirl', 'Dash', 'Violet'], correctIndex: 0 },
    { id: 'pc_e_077', category: 'pop_culture', difficulty: 'easy', question: 'Which platform is known for Stories?', answers: ['Instagram', 'Snapchat', 'Facebook', 'All of them'], correctIndex: 3 },
    { id: 'pc_e_078', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "Beauty and the Beast"?', answers: ['Gaston', 'Beast', 'LeFou', 'Maurice'], correctIndex: 0 },
    { id: 'pc_e_079', category: 'pop_culture', difficulty: 'easy', question: 'Which superhero has a utility belt?', answers: ['Batman', 'Robin', 'Nightwing', 'All of them'], correctIndex: 3 },
    { id: 'pc_e_080', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Cars"?', answers: ['Lightning McQueen', 'Mater', 'Doc Hudson', 'Sally'], correctIndex: 0 },
    { id: 'pc_e_081', category: 'pop_culture', difficulty: 'easy', question: 'Which video game features a princess named Zelda?', answers: ['The Legend of Zelda', 'Super Mario', 'Metroid', 'Fire Emblem'], correctIndex: 0 },
    { id: 'pc_e_082', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "Pocahontas"?', answers: ['Governor Ratcliffe', 'John Smith', 'Kocoum', 'Wiggins'], correctIndex: 0 },
    { id: 'pc_e_083', category: 'pop_culture', difficulty: 'easy', question: 'Which Marvel hero has a vibranium shield?', answers: ['Captain America', 'Black Panther', 'Winter Soldier', 'U.S. Agent'], correctIndex: 0 },
    { id: 'pc_e_084', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Monsters, Inc."?', answers: ['Sulley', 'Mike', 'Boo', 'Randall'], correctIndex: 0 },
    { id: 'pc_e_085', category: 'pop_culture', difficulty: 'easy', question: 'Which social media platform uses pins?', answers: ['Pinterest', 'Instagram', 'Facebook', 'Twitter'], correctIndex: 0 },
    { id: 'pc_e_086', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "The Princess and the Frog"?', answers: ['Dr. Facilier', 'Lawrence', 'Prince Naveen', 'Mama Odie'], correctIndex: 0 },
    { id: 'pc_e_087', category: 'pop_culture', difficulty: 'easy', question: 'Which superhero can talk to fish?', answers: ['Aquaman', 'Namor', 'Both A and B', 'Neither'], correctIndex: 2 },
    { id: 'pc_e_088', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Raya and the Last Dragon"?', answers: ['Raya', 'Sisu', 'Namaari', 'Boun'], correctIndex: 0 },
    { id: 'pc_e_089', category: 'pop_culture', difficulty: 'easy', question: 'Which video game features a character named Master Chief?', answers: ['Halo', 'Call of Duty', 'Destiny', 'Gears of War'], correctIndex: 0 },
    { id: 'pc_e_090', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "The Hunchback of Notre Dame"?', answers: ['Frollo', 'Quasimodo', 'Phoebus', 'Clopin'], correctIndex: 0 },
    { id: 'pc_e_091', category: 'pop_culture', difficulty: 'easy', question: 'Which Marvel hero is a spy?', answers: ['Black Widow', 'Nick Fury', 'Hawkeye', 'All of them'], correctIndex: 3 },
    { id: 'pc_e_092', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Soul"?', answers: ['Joe', '22', 'Dorothea', 'Moonwind'], correctIndex: 0 },
    { id: 'pc_e_093', category: 'pop_culture', difficulty: 'easy', question: 'Which platform is known for live streaming?', answers: ['Twitch', 'YouTube', 'Facebook', 'All of them'], correctIndex: 3 },
    { id: 'pc_e_094', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "Tarzan"?', answers: ['Clayton', 'Kerchak', 'Sabor', 'Terk'], correctIndex: 0 },
    { id: 'pc_e_095', category: 'pop_culture', difficulty: 'easy', question: 'Which superhero has a magic lasso?', answers: ['Wonder Woman', 'Supergirl', 'Batwoman', 'Black Canary'], correctIndex: 0 },
    { id: 'pc_e_096', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Luca"?', answers: ['Luca', 'Alberto', 'Giulia', 'Massimo'], correctIndex: 0 },
    { id: 'pc_e_097', category: 'pop_culture', difficulty: 'easy', question: 'Which video game features a character named Kratos?', answers: ['God of War', 'Assassin\'s Creed', 'Dark Souls', 'Skyrim'], correctIndex: 0 },
    { id: 'pc_e_098', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main villain in "Atlantis: The Lost Empire"?', answers: ['Rourke', 'Helga', 'Milo', 'Kida'], correctIndex: 0 },
    { id: 'pc_e_099', category: 'pop_culture', difficulty: 'easy', question: 'Which Marvel hero has a metal suit?', answers: ['Iron Man', 'War Machine', 'Iron Patriot', 'All of them'], correctIndex: 3 },
    { id: 'pc_e_100', category: 'pop_culture', difficulty: 'easy', question: 'What is the name of the main character in "Turning Red"?', answers: ['Mei', 'Miriam', 'Priya', 'Abby'], correctIndex: 0 },

];

// Note: This is a partial export. Due to size constraints, the full 2400 questions
// will be split across multiple files and imported together.
// Total structure: 8 categories × 3 difficulties × 100 questions = 2400 questions
