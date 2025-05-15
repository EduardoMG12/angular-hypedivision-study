export interface CardSimple {
	id: string;
	title: string;
	description: string | null;
}

export interface Card {
	type: string;
	title: string;
	description?: string;
	contentFlip?: {
		front: string;
		back: string;
	};
	// contentMultipleChoice?: {
	//  question: string;
	//  options: { text: string; isCorrect: boolean }[];
	//  correctAnswer: string | number;
	// };
	tagPaths: string[];

	id: string;
	owner_id: string;
}

export interface Topic {
	id: string;
	name: string;
	cards?: (Card | CardSimple)[];
	children: Topic[];
	childrenCardsCount: number;
	isExpanded?: boolean;
}

export interface TopicsApiResponse {
	tags: Topic[];
}
