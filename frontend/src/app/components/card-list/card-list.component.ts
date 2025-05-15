import {
	Component,
	Input,
	Output,
	EventEmitter,
	SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TopicItemComponent } from "../topic-item/topic-item.component";
import type {
	Card,
	Topic,
	// CardSimple // Pode precisar importar CardSimple se usado no tipo do Output
} from "../../common/api/interfaces/my-cards-list.interface";

import { CardDragDropComponent } from "../card-drag-drop/card-drag-drop.component";

@Component({
	selector: "app-card-list",
	standalone: true,
	imports: [CommonModule, TopicItemComponent, CardDragDropComponent],
	templateUrl: "./card-list.component.html",
	styleUrl: "./card-list.component.css",
})
export class CardListComponent {
	@Input() topics: Topic[] = [];
	@Input() expandedTopics: Map<string, boolean> = new Map<string, boolean>();
	@Input() allExpanded = false;
	@Input() cardsWithoutTags: Card[] = [];
	@Input() expandAllCardsWithoutTags = false;

	ngOnChanges(changes: SimpleChanges): void {
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		if (changes["expandAllCardsWithoutTags"]) {
			this.areCardsWithoutTagsExpanded = this.expandAllCardsWithoutTags;
		}
	}

	@Output() toggleAllTopics = new EventEmitter<void>();
	@Output() toggleTopic = new EventEmitter<string>();
	@Output() cardDroppedOnTopic = new EventEmitter<{
		cardId: string;
		originalTopicId: string | undefined;
		targetTopicId: string;
		// Se o dropResult for mais complexo e você quiser repassá-lo:
		// dropResult: { moved: boolean } | undefined; // Adicione aqui
	}>();

	areCardsWithoutTagsExpanded = false;

	toggleCardsWithoutTags(): void {
		this.areCardsWithoutTagsExpanded = !this.areCardsWithoutTagsExpanded;
	}

	// Método para capturar o evento do TopicItemComponent e repassá-lo
	onCardDroppedOnTopic(event: {
		cardId: string;
		originalTopicId: string | undefined;
		targetTopicId: string;
	}): void {
		console.log("CardListComponent recebeu drop:", event);
		this.cardDroppedOnTopic.emit(event); // Emite o evento para o MyCardsComponent
	}
}
