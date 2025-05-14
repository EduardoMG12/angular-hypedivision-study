import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TopicItemComponent } from "../topic-item/topic-item.component";
import type { Topic } from "../../common/api/interfaces/my-cards-list.interface";
import { Card } from "../../services/requests/card/card.service";

@Component({
	selector: "app-card-list",
	standalone: true,
	imports: [CommonModule, TopicItemComponent],
	templateUrl: "./card-list.component.html",
	styleUrl: "./card-list.component.css",
})
export class CardListComponent {
	@Input() topics: Topic[] = [];
	@Input() expandedTopics: Map<string, boolean> = new Map<string, boolean>();
	@Input() allExpanded = false;

	@Input() cardsWithoutTags: Card[] = [];

	@Output() toggleAllTopics = new EventEmitter<void>();
	@Output() toggleTopic = new EventEmitter<string>();
}
