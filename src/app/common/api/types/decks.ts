export interface IDeckData {
	id: string; // "create UUID-1 here ",
	name: string; // "Learning English",
	description: string; //"flashcards with objectives to learn English, study 40 words a day, and 10 phrases, and 5 grammar rules, the possibility you stay in english B1 level for 4 months",
	cards: (CardFlip | CardMultipleChoice)[];
}

export type CardFlip = {
	question: string; //"Pergunta Exemplo 1",
	answer: string; //
	type: "flip";
	explanation: string[]; // "resume explanation, why this is the answer, if not possible resume explanation in 2 lines, create a complete explanation in the preference 5 lines if possible",
};

export type CardMultipleChoice = {
	question: string; //"Pergunta Exemplo 1",
	answer: string; //
	type: "multiple-choice";
	alternatives: string[]; // ["Alt 1", "Alt 2", "Alt 3", "Alt 4"],
	correctAlternative: number[]; //2 array index can be more than 1,
	explanation: string[]; // can be more then 1 because correctAlternative can be more than 1 //  "resume explanation, why this is the answer, if not possible resume explanation in 2 lines, create a complete explanation in the preference 5 lines if possible",
};
