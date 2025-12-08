// Extended trivia questions database
// This file adds many more questions to the original database

import { TriviaQuestion } from './trivia-questions-compact';

export const ADDITIONAL_QUESTIONS: TriviaQuestion[] = [
    // ============= POP CULTURE - EASY =============
    { id: 'pc_e1', category: 'pop_culture', difficulty: 'easy', question: "Which princess has long blonde hair in 'Tangled'?", answers: ['Elsa', 'Rapunzel', 'Aurora', 'Belle'], correctIndex: 1 },
    { id: 'pc_e2', category: 'pop_culture', difficulty: 'easy', question: "What color is Cookie Monster?", answers: ['Green', 'Blue', 'Red', 'Yellow'], correctIndex: 1 },
    { id: 'pc_e3', category: 'pop_culture', difficulty: 'easy', question: "What animal is Simba in The Lion King?", answers: ['Tiger', 'Lion', 'Panther', 'Cheetah'], correctIndex: 1 },
    { id: 'pc_e4', category: 'pop_culture', difficulty: 'easy', question: "Who lives in a pineapple under the sea?", answers: ['Dora', 'SpongeBob', 'Nemo', 'Patrick'], correctIndex: 1 },
    { id: 'pc_e5', category: 'pop_culture', difficulty: 'easy', question: "What is the name of Mickey Mouse's girlfriend?", answers: ['Daisy', 'Minnie', 'Goofy', 'Pluto'], correctIndex: 1 },
    { id: 'pc_e6', category: 'pop_culture', difficulty: 'easy', question: "Which movie features a fish named Nemo?", answers: ['Shark Tale', 'Finding Nemo', 'Moana', 'Ponyo'], correctIndex: 1 },
    { id: 'pc_e7', category: 'pop_culture', difficulty: 'easy', question: "What color is Shrek?", answers: ['Blue', 'Yellow', 'Green', 'Purple'], correctIndex: 2 },
    { id: 'pc_e8', category: 'pop_culture', difficulty: 'easy', question: "Who is the main character in Minecraft?", answers: ['Steve', 'Alex', 'Creeper', 'Herobrine'], correctIndex: 0 },

    // ============= POP CULTURE - MEDIUM =============
    { id: 'pc_m1', category: 'pop_culture', difficulty: 'medium', question: "What year did the first iPhone release?", answers: ['2005', '2007', '2009', '2010'], correctIndex: 1 },
    { id: 'pc_m2', category: 'pop_culture', difficulty: 'medium', question: "Which movie won Best Picture at the 2020 Oscars?", answers: ['1917', 'Joker', 'Parasite', 'Ford v Ferrari'], correctIndex: 2 },
    { id: 'pc_m3', category: 'pop_culture', difficulty: 'medium', question: "Who played Tony Stark in the MCU?", answers: ['Chris Evans', 'Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo'], correctIndex: 1 },
    { id: 'pc_m4', category: 'pop_culture', difficulty: 'medium', question: "What is the highest-grossing film of all time?", answers: ['Titanic', 'Avatar', 'Avengers: Endgame', 'Star Wars'], correctIndex: 1 },
    { id: 'pc_m5', category: 'pop_culture', difficulty: 'medium', question: "Which TV show features dragons and the Iron Throne?", answers: ['Vikings', 'The Witcher', 'Game of Thrones', 'Lord of the Rings'], correctIndex: 2 },
    { id: 'pc_m6', category: 'pop_culture', difficulty: 'medium', question: "What year did Friends first air?", answers: ['1992', '1994', '1996', '1998'], correctIndex: 1 },
    { id: 'pc_m7', category: 'pop_culture', difficulty: 'medium', question: "Who created Facebook?", answers: ['Bill Gates', 'Steve Jobs', 'Mark Zuckerberg', 'Elon Musk'], correctIndex: 2 },
    { id: 'pc_m8', category: 'pop_culture', difficulty: 'medium', question: "What is the name of the coffee shop in Friends?", answers: ['Central Perk', 'Starbucks', 'The Bean', 'Java Joes'], correctIndex: 0 },

    // ============= POP CULTURE - HARD =============
    { id: 'pc_h1', category: 'pop_culture', difficulty: 'hard', question: "What year was the first Star Wars movie released?", answers: ['1975', '1977', '1979', '1980'], correctIndex: 1 },
    { id: 'pc_h2', category: 'pop_culture', difficulty: 'hard', question: "Who directed Inception?", answers: ['James Cameron', 'Steven Spielberg', 'Christopher Nolan', 'Denis Villeneuve'], correctIndex: 2 },
    { id: 'pc_h3', category: 'pop_culture', difficulty: 'hard', question: "Which actor has won the most Academy Awards?", answers: ['Daniel Day-Lewis', 'Katharine Hepburn', 'Meryl Streep', 'Jack Nicholson'], correctIndex: 1 },
    { id: 'pc_h4', category: 'pop_culture', difficulty: 'hard', question: "What is the name of Darth Vader's home planet?", answers: ['Coruscant', 'Naboo', 'Tatooine', 'Mustafar'], correctIndex: 2 },
    { id: 'pc_h5', category: 'pop_culture', difficulty: 'hard', question: "What was the first Pixar movie?", answers: ['A Bugs Life', 'Toy Story', 'Finding Nemo', 'Monsters Inc'], correctIndex: 1 },
    { id: 'pc_h6', category: 'pop_culture', difficulty: 'hard', question: "Who played the Joker in The Dark Knight?", answers: ['Joaquin Phoenix', 'Jack Nicholson', 'Heath Ledger', 'Jared Leto'], correctIndex: 2 },
    { id: 'pc_h7', category: 'pop_culture', difficulty: 'hard', question: "What Netflix show is set in Hawkins, Indiana?", answers: ['Dark', 'Stranger Things', 'The OA', 'Black Mirror'], correctIndex: 1 },

    // ============= GEOGRAPHY - EASY =============
    { id: 'geo_e1', category: 'geography', difficulty: 'easy', question: "What is the capital of the United States?", answers: ['New York', 'Los Angeles', 'Washington D.C.', 'Chicago'], correctIndex: 2 },
    { id: 'geo_e2', category: 'geography', difficulty: 'easy', question: "Which continent is Brazil in?", answers: ['Africa', 'Europe', 'South America', 'Asia'], correctIndex: 2 },
    { id: 'geo_e3', category: 'geography', difficulty: 'easy', question: "What is the largest country by area?", answers: ['China', 'USA', 'Canada', 'Russia'], correctIndex: 3 },
    { id: 'geo_e4', category: 'geography', difficulty: 'easy', question: "Which country is known for the Eiffel Tower?", answers: ['Italy', 'England', 'France', 'Germany'], correctIndex: 2 },
    { id: 'geo_e5', category: 'geography', difficulty: 'easy', question: "What is the capital of Spain?", answers: ['Barcelona', 'Madrid', 'Seville', 'Valencia'], correctIndex: 1 },
    { id: 'geo_e6', category: 'geography', difficulty: 'easy', question: "Which ocean is between USA and Europe?", answers: ['Pacific', 'Indian', 'Atlantic', 'Arctic'], correctIndex: 2 },
    { id: 'geo_e7', category: 'geography', difficulty: 'easy', question: "What country is famous for kangaroos?", answers: ['New Zealand', 'Australia', 'South Africa', 'India'], correctIndex: 1 },
    { id: 'geo_e8', category: 'geography', difficulty: 'easy', question: "What is the capital of England?", answers: ['Manchester', 'Liverpool', 'London', 'Edinburgh'], correctIndex: 2 },

    // ============= GEOGRAPHY - MEDIUM =============
    { id: 'geo_m1', category: 'geography', difficulty: 'medium', question: "What is the smallest country in the world?", answers: ['Monaco', 'San Marino', 'Vatican City', 'Liechtenstein'], correctIndex: 2 },
    { id: 'geo_m2', category: 'geography', difficulty: 'medium', question: "Which river is the longest in the world?", answers: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correctIndex: 1 },
    { id: 'geo_m3', category: 'geography', difficulty: 'medium', question: "What is the capital of Brazil?", answers: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], correctIndex: 2 },
    { id: 'geo_m4', category: 'geography', difficulty: 'medium', question: "How many continents are there?", answers: ['5', '6', '7', '8'], correctIndex: 2 },
    { id: 'geo_m5', category: 'geography', difficulty: 'medium', question: "Which country has the most islands?", answers: ['Philippines', 'Indonesia', 'Sweden', 'Japan'], correctIndex: 2 },
    { id: 'geo_m6', category: 'geography', difficulty: 'medium', question: "What is the currency of Japan?", answers: ['Won', 'Yuan', 'Yen', 'Peso'], correctIndex: 2 },
    { id: 'geo_m7', category: 'geography', difficulty: 'medium', question: "Which country is known as the Land of the Rising Sun?", answers: ['China', 'Japan', 'Korea', 'Thailand'], correctIndex: 1 },

    // ============= GEOGRAPHY - HARD =============
    { id: 'geo_h1', category: 'geography', difficulty: 'hard', question: "What is the capital of Mongolia?", answers: ['Ulaanbaatar', 'Almaty', 'Bishkek', 'Dushanbe'], correctIndex: 0 },
    { id: 'geo_h2', category: 'geography', difficulty: 'hard', question: "Which African country was never colonized?", answers: ['Nigeria', 'Kenya', 'Ethiopia', 'Ghana'], correctIndex: 2 },
    { id: 'geo_h3', category: 'geography', difficulty: 'hard', question: "What is the deepest ocean trench?", answers: ['Puerto Rico', 'Java', 'Mariana', 'Philippine'], correctIndex: 2 },
    { id: 'geo_h4', category: 'geography', difficulty: 'hard', question: "Which country has the longest coastline?", answers: ['Russia', 'Indonesia', 'Canada', 'Australia'], correctIndex: 2 },
    { id: 'geo_h5', category: 'geography', difficulty: 'hard', question: "What is the driest place on Earth?", answers: ['Sahara Desert', 'Death Valley', 'Atacama Desert', 'Gobi Desert'], correctIndex: 2 },
    { id: 'geo_h6', category: 'geography', difficulty: 'hard', question: "What is the capital of New Zealand?", answers: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton'], correctIndex: 1 },

    // ============= SCIENCE - EASY =============
    { id: 'sci_e1', category: 'science', difficulty: 'easy', question: "How many legs does a spider have?", answers: ['6', '8', '10', '4'], correctIndex: 1 },
    { id: 'sci_e2', category: 'science', difficulty: 'easy', question: "What is the largest planet in our solar system?", answers: ['Earth', 'Saturn', 'Jupiter', 'Neptune'], correctIndex: 2 },
    { id: 'sci_e3', category: 'science', difficulty: 'easy', question: "What do bees make?", answers: ['Milk', 'Honey', 'Silk', 'Wax'], correctIndex: 1 },
    { id: 'sci_e4', category: 'science', difficulty: 'easy', question: "What is the closest star to Earth?", answers: ['Moon', 'Mars', 'Sun', 'Venus'], correctIndex: 2 },
    { id: 'sci_e5', category: 'science', difficulty: 'easy', question: "How many colors are in a rainbow?", answers: ['5', '6', '7', '8'], correctIndex: 2 },
    { id: 'sci_e6', category: 'science', difficulty: 'easy', question: "What animal is known as mans best friend?", answers: ['Cat', 'Dog', 'Horse', 'Bird'], correctIndex: 1 },
    { id: 'sci_e7', category: 'science', difficulty: 'easy', question: "What is frozen water called?", answers: ['Steam', 'Fog', 'Ice', 'Dew'], correctIndex: 2 },

    // ============= SCIENCE - MEDIUM =============
    { id: 'sci_m1', category: 'science', difficulty: 'medium', question: "What is the chemical symbol for gold?", answers: ['Go', 'Gd', 'Au', 'Ag'], correctIndex: 2 },
    { id: 'sci_m2', category: 'science', difficulty: 'medium', question: "How many planets are in our solar system?", answers: ['7', '8', '9', '10'], correctIndex: 1 },
    { id: 'sci_m3', category: 'science', difficulty: 'medium', question: "What gas do plants absorb from the air?", answers: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctIndex: 2 },
    { id: 'sci_m4', category: 'science', difficulty: 'medium', question: "What is the largest organ in the human body?", answers: ['Heart', 'Liver', 'Brain', 'Skin'], correctIndex: 3 },
    { id: 'sci_m5', category: 'science', difficulty: 'medium', question: "What type of animal is a whale?", answers: ['Fish', 'Mammal', 'Reptile', 'Amphibian'], correctIndex: 1 },
    { id: 'sci_m6', category: 'science', difficulty: 'medium', question: "How long does Earth take to orbit the Sun?", answers: ['24 hours', '7 days', '30 days', '365 days'], correctIndex: 3 },
    { id: 'sci_m7', category: 'science', difficulty: 'medium', question: "What is the hardest natural substance on Earth?", answers: ['Iron', 'Steel', 'Diamond', 'Titanium'], correctIndex: 2 },

    // ============= SCIENCE - HARD =============
    { id: 'sci_h1', category: 'science', difficulty: 'hard', question: "What is the most abundant gas in Earth's atmosphere?", answers: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'], correctIndex: 1 },
    { id: 'sci_h2', category: 'science', difficulty: 'hard', question: "What is the smallest unit of matter?", answers: ['Molecule', 'Atom', 'Electron', 'Quark'], correctIndex: 3 },
    { id: 'sci_h3', category: 'science', difficulty: 'hard', question: "What is absolute zero in Celsius?", answers: ['-100°C', '-200°C', '-273°C', '-373°C'], correctIndex: 2 },
    { id: 'sci_h4', category: 'science', difficulty: 'hard', question: "How many chromosomes do humans have?", answers: ['23', '46', '48', '92'], correctIndex: 1 },
    { id: 'sci_h5', category: 'science', difficulty: 'hard', question: "What is the chemical formula for table salt?", answers: ['NaCl', 'KCl', 'CaCl2', 'MgCl2'], correctIndex: 0 },
    { id: 'sci_h6', category: 'science', difficulty: 'hard', question: "What planet has the Great Red Spot?", answers: ['Mars', 'Saturn', 'Jupiter', 'Neptune'], correctIndex: 2 },

    // ============= HISTORY - EASY =============
    { id: 'his_e1', category: 'history', difficulty: 'easy', question: "What ancient wonder was in Egypt?", answers: ['Colosseum', 'Pyramids', 'Parthenon', 'Great Wall'], correctIndex: 1 },
    { id: 'his_e2', category: 'history', difficulty: 'easy', question: "Who built the Great Wall of China?", answers: ['Japanese', 'Koreans', 'Chinese', 'Mongols'], correctIndex: 2 },
    { id: 'his_e3', category: 'history', difficulty: 'easy', question: "What ship sank after hitting an iceberg in 1912?", answers: ['Lusitania', 'Britannic', 'Titanic', 'Olympic'], correctIndex: 2 },
    { id: 'his_e4', category: 'history', difficulty: 'easy', question: "Who was the first man on the moon?", answers: ['Buzz Aldrin', 'Neil Armstrong', 'John Glenn', 'Yuri Gagarin'], correctIndex: 1 },
    { id: 'his_e5', category: 'history', difficulty: 'easy', question: "What year did World War I begin?", answers: ['1912', '1914', '1916', '1918'], correctIndex: 1 },
    { id: 'his_e6', category: 'history', difficulty: 'easy', question: "Who wrote the Declaration of Independence?", answers: ['Washington', 'Franklin', 'Jefferson', 'Adams'], correctIndex: 2 },

    // ============= HISTORY - MEDIUM =============
    { id: 'his_m1', category: 'history', difficulty: 'medium', question: "What year did the French Revolution begin?", answers: ['1776', '1789', '1799', '1804'], correctIndex: 1 },
    { id: 'his_m2', category: 'history', difficulty: 'medium', question: "Who was the first Roman Emperor?", answers: ['Julius Caesar', 'Augustus', 'Nero', 'Caligula'], correctIndex: 1 },
    { id: 'his_m3', category: 'history', difficulty: 'medium', question: "What empire did Genghis Khan found?", answers: ['Ottoman', 'Mongol', 'Persian', 'Roman'], correctIndex: 1 },
    { id: 'his_m4', category: 'history', difficulty: 'medium', question: "What year did the Soviet Union collapse?", answers: ['1989', '1990', '1991', '1992'], correctIndex: 2 },
    { id: 'his_m5', category: 'history', difficulty: 'medium', question: "Who invented the telephone?", answers: ['Edison', 'Tesla', 'Bell', 'Marconi'], correctIndex: 2 },
    { id: 'his_m6', category: 'history', difficulty: 'medium', question: "What was the name of the first satellite in space?", answers: ['Apollo', 'Sputnik', 'Voyager', 'Pioneer'], correctIndex: 1 },

    // ============= HISTORY - HARD =============
    { id: 'his_h1', category: 'history', difficulty: 'hard', question: "In what year was the Magna Carta signed?", answers: ['1066', '1215', '1346', '1485'], correctIndex: 1 },
    { id: 'his_h2', category: 'history', difficulty: 'hard', question: "Who was the last Pharaoh of Egypt?", answers: ['Nefertiti', 'Hatshepsut', 'Cleopatra', 'Tutankhamun'], correctIndex: 2 },
    { id: 'his_h3', category: 'history', difficulty: 'hard', question: "What treaty ended World War I?", answers: ['Versailles', 'Paris', 'Vienna', 'Geneva'], correctIndex: 0 },
    { id: 'his_h4', category: 'history', difficulty: 'hard', question: "Who led the Cuban Revolution?", answers: ['Che Guevara', 'Fidel Castro', 'Raul Castro', 'Batista'], correctIndex: 1 },
    { id: 'his_h5', category: 'history', difficulty: 'hard', question: "What year did the Black Death reach Europe?", answers: ['1247', '1347', '1447', '1547'], correctIndex: 1 },

    // ============= SPORTS - EASY =============
    { id: 'spo_e1', category: 'sports', difficulty: 'easy', question: "How many players on a basketball team on court?", answers: ['4', '5', '6', '7'], correctIndex: 1 },
    { id: 'spo_e2', category: 'sports', difficulty: 'easy', question: "What sport uses a round orange ball and hoops?", answers: ['Football', 'Baseball', 'Basketball', 'Volleyball'], correctIndex: 2 },
    { id: 'spo_e3', category: 'sports', difficulty: 'easy', question: "What do you hit in tennis?", answers: ['Puck', 'Ball', 'Shuttlecock', 'Disc'], correctIndex: 1 },
    { id: 'spo_e4', category: 'sports', difficulty: 'easy', question: "What sport is Tiger Woods famous for?", answers: ['Tennis', 'Basketball', 'Golf', 'Football'], correctIndex: 2 },
    { id: 'spo_e5', category: 'sports', difficulty: 'easy', question: "How many bases in baseball?", answers: ['3', '4', '5', '6'], correctIndex: 1 },
    { id: 'spo_e6', category: 'sports', difficulty: 'easy', question: "What color is a tennis ball?", answers: ['White', 'Green/Yellow', 'Red', 'Blue'], correctIndex: 1 },

    // ============= SPORTS - MEDIUM =============
    { id: 'spo_m1', category: 'sports', difficulty: 'medium', question: "How many holes on a golf course?", answers: ['9', '18', '21', '36'], correctIndex: 1 },
    { id: 'spo_m2', category: 'sports', difficulty: 'medium', question: "Which country won the 2018 FIFA World Cup?", answers: ['Brazil', 'Germany', 'France', 'Argentina'], correctIndex: 2 },
    { id: 'spo_m3', category: 'sports', difficulty: 'medium', question: "Who has won the most tennis Grand Slams (men)?", answers: ['Federer', 'Nadal', 'Djokovic', 'Sampras'], correctIndex: 2 },
    { id: 'spo_m4', category: 'sports', difficulty: 'medium', question: "What is the national sport of Japan?", answers: ['Karate', 'Sumo', 'Judo', 'Baseball'], correctIndex: 1 },
    { id: 'spo_m5', category: 'sports', difficulty: 'medium', question: "How many points is a touchdown worth?", answers: ['3', '5', '6', '7'], correctIndex: 2 },
    { id: 'spo_m6', category: 'sports', difficulty: 'medium', question: "Which NBA player is known as 'The King'?", answers: ['Michael Jordan', 'Kobe Bryant', 'LeBron James', 'Shaq'], correctIndex: 2 },

    // ============= SPORTS - HARD =============
    { id: 'spo_h1', category: 'sports', difficulty: 'hard', question: "Which country won the first FIFA World Cup?", answers: ['Brazil', 'Argentina', 'Uruguay', 'Germany'], correctIndex: 2 },
    { id: 'spo_h2', category: 'sports', difficulty: 'hard', question: "How long is an Olympic swimming pool?", answers: ['25m', '50m', '75m', '100m'], correctIndex: 1 },
    { id: 'spo_h3', category: 'sports', difficulty: 'hard', question: "What is the diameter of a basketball hoop?", answers: ['14 inches', '16 inches', '18 inches', '20 inches'], correctIndex: 2 },
    { id: 'spo_h4', category: 'sports', difficulty: 'hard', question: "Who has won the most Olympic gold medals?", answers: ['Usain Bolt', 'Michael Phelps', 'Carl Lewis', 'Mark Spitz'], correctIndex: 1 },
    { id: 'spo_h5', category: 'sports', difficulty: 'hard', question: "In which sport would you perform a slam dunk?", answers: ['Volleyball', 'Basketball', 'Tennis', 'Badminton'], correctIndex: 1 },

    // ============= MUSIC - EASY =============
    { id: 'mus_e1', category: 'music', difficulty: 'easy', question: "What instrument has 88 keys?", answers: ['Guitar', 'Violin', 'Piano', 'Drums'], correctIndex: 2 },
    { id: 'mus_e2', category: 'music', difficulty: 'easy', question: "Who sang 'Baby Shark'?", answers: ['Pinkfong', 'Cocomelon', 'Disney', 'Nickelodeon'], correctIndex: 0 },
    { id: 'mus_e3', category: 'music', difficulty: 'easy', question: "What do you call a group of musicians?", answers: ['Team', 'Band', 'Crew', 'Squad'], correctIndex: 1 },
    { id: 'mus_e4', category: 'music', difficulty: 'easy', question: "What instrument does a violinist play?", answers: ['Cello', 'Viola', 'Violin', 'Bass'], correctIndex: 2 },
    { id: 'mus_e5', category: 'music', difficulty: 'easy', question: "Who is the most followed artist on Spotify?", answers: ['Drake', 'Taylor Swift', 'Ed Sheeran', 'Ariana Grande'], correctIndex: 1 },

    // ============= MUSIC - MEDIUM =============
    { id: 'mus_m1', category: 'music', difficulty: 'medium', question: "Which band had members named John, Paul, George, and Ringo?", answers: ['The Rolling Stones', 'The Beatles', 'Led Zeppelin', 'The Who'], correctIndex: 1 },
    { id: 'mus_m2', category: 'music', difficulty: 'medium', question: "What year did Elvis Presley die?", answers: ['1975', '1977', '1979', '1981'], correctIndex: 1 },
    { id: 'mus_m3', category: 'music', difficulty: 'medium', question: "Who sang 'Thriller'?", answers: ['Prince', 'Michael Jackson', 'Whitney Houston', 'Madonna'], correctIndex: 1 },
    { id: 'mus_m4', category: 'music', difficulty: 'medium', question: "What genre is Taylor Swift originally known for?", answers: ['Pop', 'Rock', 'Country', 'R&B'], correctIndex: 2 },
    { id: 'mus_m5', category: 'music', difficulty: 'medium', question: "Who is known as 'The Queen of Soul'?", answers: ['Diana Ross', 'Aretha Franklin', 'Tina Turner', 'Whitney Houston'], correctIndex: 1 },

    // ============= MUSIC - HARD =============
    { id: 'mus_h1', category: 'music', difficulty: 'hard', question: "What is the best-selling album of all time?", answers: ['Back in Black', 'The Bodyguard', 'Thriller', 'Abbey Road'], correctIndex: 2 },
    { id: 'mus_h2', category: 'music', difficulty: 'hard', question: "Who composed the 'Moonlight Sonata'?", answers: ['Mozart', 'Bach', 'Beethoven', 'Chopin'], correctIndex: 2 },
    { id: 'mus_h3', category: 'music', difficulty: 'hard', question: "What instrument does Yo-Yo Ma play?", answers: ['Violin', 'Piano', 'Cello', 'Flute'], correctIndex: 2 },
    { id: 'mus_h4', category: 'music', difficulty: 'hard', question: "Which opera features the song 'La donna è mobile'?", answers: ['Carmen', 'La Traviata', 'Rigoletto', 'Aida'], correctIndex: 2 },

    // ============= ART & LITERATURE - EASY =============
    { id: 'art_e1', category: 'art_literature', difficulty: 'easy', question: "Who wrote Harry Potter?", answers: ['Stephen King', 'J.K. Rowling', 'Roald Dahl', 'C.S. Lewis'], correctIndex: 1 },
    { id: 'art_e2', category: 'art_literature', difficulty: 'easy', question: "What are the three primary colors?", answers: ['Red, Yellow, Blue', 'Red, Green, Blue', 'Red, Orange, Yellow', 'Blue, Green, Purple'], correctIndex: 0 },
    { id: 'art_e3', category: 'art_literature', difficulty: 'easy', question: "Who wrote 'The Cat in the Hat'?", answers: ['Dr. Seuss', 'Roald Dahl', 'Shel Silverstein', 'Maurice Sendak'], correctIndex: 0 },
    { id: 'art_e4', category: 'art_literature', difficulty: 'easy', question: "What color do you get mixing blue and yellow?", answers: ['Orange', 'Purple', 'Green', 'Brown'], correctIndex: 2 },
    { id: 'art_e5', category: 'art_literature', difficulty: 'easy', question: "Who is the author of 'Charlie and the Chocolate Factory'?", answers: ['J.K. Rowling', 'Roald Dahl', 'Dr. Seuss', 'Enid Blyton'], correctIndex: 1 },

    // ============= ART & LITERATURE - MEDIUM =============
    { id: 'art_m1', category: 'art_literature', difficulty: 'medium', question: "Who wrote 'Pride and Prejudice'?", answers: ['Emily Brontë', 'Jane Austen', 'Charlotte Brontë', 'George Eliot'], correctIndex: 1 },
    { id: 'art_m2', category: 'art_literature', difficulty: 'medium', question: "Which artist cut off part of his ear?", answers: ['Monet', 'Picasso', 'Van Gogh', 'Dali'], correctIndex: 2 },
    { id: 'art_m3', category: 'art_literature', difficulty: 'medium', question: "Who wrote 'The Great Gatsby'?", answers: ['Hemingway', 'Fitzgerald', 'Steinbeck', 'Faulkner'], correctIndex: 1 },
    { id: 'art_m4', category: 'art_literature', difficulty: 'medium', question: "What art movement was Picasso part of?", answers: ['Impressionism', 'Surrealism', 'Cubism', 'Expressionism'], correctIndex: 2 },
    { id: 'art_m5', category: 'art_literature', difficulty: 'medium', question: "Who wrote 'To Kill a Mockingbird'?", answers: ['Mark Twain', 'Harper Lee', 'John Steinbeck', 'Ernest Hemingway'], correctIndex: 1 },

    // ============= ART & LITERATURE - HARD =============
    { id: 'art_h1', category: 'art_literature', difficulty: 'hard', question: "What is the first book of the Bible?", answers: ['Exodus', 'Genesis', 'Leviticus', 'Numbers'], correctIndex: 1 },
    { id: 'art_h2', category: 'art_literature', difficulty: 'hard', question: "Who sculpted 'David'?", answers: ['Donatello', 'Bernini', 'Michelangelo', 'Rodin'], correctIndex: 2 },
    { id: 'art_h3', category: 'art_literature', difficulty: 'hard', question: "Who wrote 'War and Peace'?", answers: ['Dostoevsky', 'Tolstoy', 'Chekhov', 'Pushkin'], correctIndex: 1 },
    { id: 'art_h4', category: 'art_literature', difficulty: 'hard', question: "Who painted 'The Persistence of Memory' (melting clocks)?", answers: ['Picasso', 'Dali', 'Magritte', 'Ernst'], correctIndex: 1 },

    // ============= MIXED - EASY =============
    { id: 'mix_e1', category: 'mixed', difficulty: 'easy', question: "How many months have 31 days?", answers: ['4', '6', '7', '8'], correctIndex: 2 },
    { id: 'mix_e2', category: 'mixed', difficulty: 'easy', question: "What is 2 + 2?", answers: ['3', '4', '5', '6'], correctIndex: 1 },
    { id: 'mix_e3', category: 'mixed', difficulty: 'easy', question: "How many letters in the English alphabet?", answers: ['24', '25', '26', '27'], correctIndex: 2 },
    { id: 'mix_e4', category: 'mixed', difficulty: 'easy', question: "What holiday is on December 25th?", answers: ['Halloween', 'Easter', 'Christmas', 'Thanksgiving'], correctIndex: 2 },
    { id: 'mix_e5', category: 'mixed', difficulty: 'easy', question: "How many hours in a day?", answers: ['12', '20', '24', '36'], correctIndex: 2 },

    // ============= MIXED - MEDIUM =============
    { id: 'mix_m1', category: 'mixed', difficulty: 'medium', question: "What is the currency of the UK?", answers: ['Euro', 'Dollar', 'Pound', 'Franc'], correctIndex: 2 },
    { id: 'mix_m2', category: 'mixed', difficulty: 'medium', question: "How many sides does a hexagon have?", answers: ['5', '6', '7', '8'], correctIndex: 1 },
    { id: 'mix_m3', category: 'mixed', difficulty: 'medium', question: "What is the tallest mammal?", answers: ['Elephant', 'Giraffe', 'Whale', 'Hippo'], correctIndex: 1 },
    { id: 'mix_m4', category: 'mixed', difficulty: 'medium', question: "How many stripes on the US flag?", answers: ['11', '13', '15', '50'], correctIndex: 1 },
    { id: 'mix_m5', category: 'mixed', difficulty: 'medium', question: "What is the speed limit on most US highways (mph)?", answers: ['55', '65', '70', '75'], correctIndex: 1 },

    // ============= MIXED - HARD =============
    { id: 'mix_h1', category: 'mixed', difficulty: 'hard', question: "What is the largest organ of the human body?", answers: ['Liver', 'Heart', 'Skin', 'Brain'], correctIndex: 2 },
    { id: 'mix_h2', category: 'mixed', difficulty: 'hard', question: "How many time zones does Russia span?", answers: ['8', '9', '10', '11'], correctIndex: 3 },
    { id: 'mix_h3', category: 'mixed', difficulty: 'hard', question: "What is the Roman numeral for 500?", answers: ['C', 'D', 'L', 'M'], correctIndex: 1 },
    { id: 'mix_h4', category: 'mixed', difficulty: 'hard', question: "What is the fastest land animal?", answers: ['Lion', 'Cheetah', 'Leopard', 'Gazelle'], correctIndex: 1 },
];
