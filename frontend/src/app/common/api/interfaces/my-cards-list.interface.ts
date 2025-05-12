export interface Card {
	id: string;
	title: string;
	description: string | null;
}

export interface Topic {
	id: string;
	name: string;
	cards: Card[];
	children: Topic[];
	childrenCardsCount: number;
	isExpanded?: boolean;
}

export interface TopicsApiResponse {
	tags: Topic[];
}
