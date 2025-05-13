export interface IDeckData {
	id: string; // "create UUID-1 here ",
	name: string; // "Learning English",
	description: string; //"flashcards with objectives to learn English, study 40 words a day, and 10 phrases, and 5 grammar rules, the possibility you stay in english B1 level for 4 months",
	cards: (CardFlip | CardMultipleChoice)[];
}

export type CardFlip = {
	question: string;
	answer: string;
	type: "flip";
	explanation: string[];
};

export type CardMultipleChoice = {
	question: string;
	answer: string;
	type: "multiple-choice";
	alternatives: string[]; // ["Alt 1", "Alt 2", "Alt 3", "Alt 4"],
	correctAlternative: number[]; //2 array index can be more than 1,
	explanation: string[];
};
