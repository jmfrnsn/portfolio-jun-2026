export type ReadingStatus = "Done" | "In progress" | "To be read";

export type ReadingEntry2026 = {
  name: string;
  started: string;
  author: string;
  length: string;
  status: ReadingStatus;
};

export type ReadingEntry2025 = {
  name: string;
  author: string;
  genre: string;
  length: string;
  status: ReadingStatus;
  rating?: number;
};

export const READING_LIST_2026: ReadingEntry2026[] = [
  {
    name: "Good Old Neon",
    started: "February 8, 2026",
    author: "David Foster Wallace",
    length: "Short story",
    status: "Done",
  },
  {
    name: "The Goldfinch",
    started: "February 3, 2026",
    author: "Donna Tartt",
    length: "Novel",
    status: "In progress",
  },
  {
    name: "Self Reliance",
    started: "January 30, 2026",
    author: "Ralph Waldo Emerson",
    length: "Essay",
    status: "Done",
  },
  {
    name: "The Enormous Radio",
    started: "January 30, 2026",
    author: "John Cheever",
    length: "Short story",
    status: "Done",
  },
  {
    name: "The Egg",
    started: "January 28, 2026",
    author: "Andy Weir",
    length: "Short story",
    status: "Done",
  },
  {
    name: "The Great Silence",
    started: "January 28, 2026",
    author: "Ted Chiang",
    length: "Short story",
    status: "Done",
  },
  {
    name: "The Lady and Her Dog",
    started: "January 26, 2026",
    author: "Anton Chekhov",
    length: "Short story",
    status: "Done",
  },
  {
    name: "The Swimmer",
    started: "January 26, 2026",
    author: "John Cheever",
    length: "Short story",
    status: "Done",
  },
  {
    name: "Cathedral",
    started: "January 26, 2026",
    author: "Raymond Carver",
    length: "Short story",
    status: "Done",
  },
  {
    name: "The Secret History",
    started: "January 23, 2026",
    author: "Donna Tartt",
    length: "Novel",
    status: "Done",
  },
  {
    name: "Good Country People",
    started: "January 18, 2026",
    author: "Flannery O'Connor",
    length: "Short story",
    status: "Done",
  },
  {
    name: "A Good Man is Hard to Find",
    started: "January 18, 2026",
    author: "Flannery O'Connor",
    length: "Short story",
    status: "Done",
  },
  {
    name: "Old Man and the Sea",
    started: "January 3, 2026",
    author: "Ernest Hemingway",
    length: "Novel",
    status: "Done",
  },
];

export const READING_LIST_2025: ReadingEntry2025[] = [
  { name: "Dune, #1", author: "Frank Herbert", genre: "Sci-fi", length: "Novel", status: "Done", rating: 9 },
  { name: "Zero to One", author: "Peter Thiel", genre: "Nonfiction", length: "Novel", status: "Done", rating: 9 },
  { name: "The Writing Life", author: "Annie Dillard", genre: "Nonfiction", length: "Novel", status: "Done", rating: 9 },
  { name: "Self-Reliance", author: "Ralph Waldo Emerson", genre: "Philosophy", length: "Essay", status: "Done", rating: 8 },
  { name: "Speed and Scale", author: "John Doerr", genre: "Nonfiction", length: "Novel", status: "Done", rating: 8 },
  { name: "The Creative Act", author: "Rick Rubin", genre: "Nonfiction", length: "Novel", status: "Done", rating: 8 },
  { name: "Six of Crows", author: "Leigh Bardugo", genre: "Fiction", length: "Novel", status: "Done", rating: 8 },
  { name: "Build", author: "Tony Fadell", genre: "Nonfiction", length: "Novel", status: "Done", rating: 8 },
  { name: "The Philosophy of Composition", author: "Edgar Allan Poe", genre: "Literary theory", length: "Essay", status: "Done", rating: 7 },
  { name: "Nature", author: "Ralph Waldo Emerson", genre: "Philosophy", length: "Essay", status: "Done", rating: 7 },
  { name: "On Keeping a Notebook", author: "Joan Didion", genre: "Creative nonfiction", length: "Essay", status: "Done", rating: 7 },
  { name: "Cathedral", author: "Raymond Carver", genre: "Fiction", length: "Short story", status: "Done", rating: 7 },
  { name: "Patagonia: Notes from the Field", author: "Yvon Chouinard et al.", genre: "Nonfiction", length: "Essay", status: "Done", rating: 6 },
  { name: "Rich Dad Poor Dad", author: "Robert Kiyosaki", genre: "Nonfiction", length: "Novel", status: "Done", rating: 6 },
  { name: "Ninth House", author: "Leigh Bardugo", genre: "Dark fantasy", length: "Novel", status: "Done", rating: 6 },
  { name: "The Book of Rental Property Investing", author: "Brandon Turner", genre: "Nonfiction", length: "Novel", status: "In progress" },
  { name: "The Prince", author: "Niccolo Machiavelli", genre: "Philosophy", length: "Novel", status: "In progress" },
  { name: "Art and Fear", author: "Ted Orland & David Bayles", genre: "Nonfiction", length: "Novel", status: "In progress" },
  { name: "Good to Great", author: "James Collins", genre: "Nonfiction", length: "Novel", status: "Done" },
  { name: "A Pattern Language", author: "Christopher Alexander", genre: "Nonfiction", length: "Novel", status: "Done" },
  { name: "The Dream Machine", author: "Mitchell Waldrop", genre: "Fiction", length: "Novel", status: "Done" },
  { name: "The White Album", author: "Joan Didion", genre: "Creative nonfiction", length: "Novel", status: "Done" },
  { name: "Pilgrim at Tinker Creek", author: "Annie Dillard", genre: "Nonfiction", length: "Novel", status: "Done" },
  { name: "How to Win Friends and Influence People", author: "Dale Carnegie", genre: "Nonfiction", length: "Novel", status: "In progress" },
  { name: "Meditations", author: "Marcus Aurelius", genre: "Philosophy", length: "Novel", status: "To be read" },
  { name: "Science and Human Values", author: "Jacob Bronowski", genre: "Nonfiction", length: "Novel", status: "To be read" },
  { name: "Marxism", author: "Thomas Sowell", genre: "Nonfiction", length: "Novel", status: "To be read" },
  { name: "The Idiot", author: "Dostoevsky", genre: "Philosophy", length: "Novel", status: "To be read" },
  { name: "The Art of War", author: "Sun Tzu", genre: "Philosophy", length: "Novel", status: "To be read" },
  { name: "Blitzscaling", author: "Reid Hoffman", genre: "Nonfiction", length: "Novel", status: "To be read" },
  { name: "Interaction of Color", author: "Joseph Albers", genre: "Nonfiction", length: "Novel", status: "To be read" },
  { name: "Norwegian Wood", author: "Haruki Murakami", genre: "Fiction", length: "Novel", status: "To be read" },
  { name: "Evolution of Civilizations", author: "Carroll Quigley", genre: "Nonfiction", length: "Novel", status: "To be read" },
  { name: "Three Body Problem", author: "Liu Cixin", genre: "Fiction", length: "Novel", status: "To be read" },
  { name: "Watership Down", author: "Richard Adams", genre: "Fiction", length: "Novel", status: "To be read" },
  { name: "The Little Book of Atheist Spirituality", author: "André Comte-Sponville", genre: "Philosophy", length: "Novel", status: "To be read" },
  { name: "The Myth of Sisyphus", author: "Albert Camus", genre: "Philosophy", length: "Essay", status: "In progress" },
  { name: "Slouching Towards Bethlehem", author: "Joan Didion", genre: "Creative nonfiction", length: "Essay", status: "In progress" },
  { name: "The Fire Next Time", author: "James Baldwin", genre: "Biography", length: "Essay", status: "In progress" },
];

export const READING_YEARS = ["2026", "2025"] as const;
export type ReadingYear = (typeof READING_YEARS)[number];
