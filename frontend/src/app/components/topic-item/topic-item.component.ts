import { CommonModule, NgClass, NgStyle } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Topic } from "../../common/api/interfaces/my-cards-list.interface";
import { Card } from "../../services/requests/card/card.service";

@Component({
	selector: "app-topic-item",
	standalone: true,
	imports: [CommonModule, NgStyle, NgClass],
	templateUrl: "./topic-item.component.html",
})
export class TopicItemComponent {
	@Input() topic!: Topic;
	@Input() level = 0;
	@Input() expandedTopics!: Map<string, boolean>;
	@Input() cardsWithoutTags: Card[] = [];

	isHovered = false;
	areCardsWithoutTagsExpanded = false; // <- NOVO

	@Output() toggle = new EventEmitter<string>();

	toggleTopic(topicId: string): void {
		this.toggle.emit(topicId);
	}

	isExpanded(topicId: string): boolean {
		return this.expandedTopics.get(topicId) || false;
	}

	toggleCardsWithoutTags(): void {
		this.areCardsWithoutTagsExpanded = !this.areCardsWithoutTagsExpanded;
	}
}
