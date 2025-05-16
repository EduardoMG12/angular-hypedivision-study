export interface CardSimple {
	id: string;
	title: string;
	description: string | null;
}

export interface Card {
	type: string;
	title: string;
	description?: string | null;
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

export interface MoveCardDto {
	cardId: string;
	targetTopicId: string;
	originalTopicId?: string;
}

export interface CardDropEvent {
	cardId: string;
	originalTopicId: string | undefined | null;
	targetTopicId: string;
}

export interface MoveTagDto {
	tagId: string;
	targetParentId: string | undefined | null;
	originalParentId?: string | undefined | null;
}

export interface TagDto {
	id: string;
	name: string;
	parentId?: string | null;
	path: string;
	children?: TagDto[];
	cards?: CardSimple[];
	childrenCardsCount: number;
	createdAt: Date;
	updatedAt?: Date | null;
}

export const CARD_TYPE = "CARD_TYPE";

export const TAG_TYPE = "TAG_TYPE";

export interface DraggedCardItem {
	card: Card | CardSimple;
	originalTopicId?: string;
}

export interface DraggedTagItem {
	tagId: string;
	originalParentId: string | null | undefined;
	tagName?: string;
	tagPath?: string;
}

export type DraggedItemTypes = DraggedCardItem | DraggedTagItem;

export interface TagDropEvent {
	tagId: string;
	originalParentId: string | undefined | null;
	targetParentId: string | undefined | null;
}

export type ItemDropEvent = CardDropEvent | TagDropEvent;

// src/app/common/api/interfaces/my-cards-list.interface.ts
export const TOPIC_TYPE = "TOPIC";

export interface DraggedCardItem {
	card: Card | CardSimple;
	originalTopicId?: string | undefined;
}

export interface DraggedTopicItem {
	topicId: string;
	originalParentId?: string | undefined; // Changed to originalParentId
}

export interface MoveTopicDto {
	topicId: string;
	originalParentId?: string | undefined; // Changed to originalParentId
	targetParentId?: string | undefined | null; // Changed to targetParentId
}

// Other interfaces (Card, CardSimple, etc.) remain unchanged
