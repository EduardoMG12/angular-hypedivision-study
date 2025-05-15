// src/app/components/topic-item/topic-item.component.ts
import { CommonModule, NgClass, NgStyle } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Topic } from "../../common/api/interfaces/my-cards-list.interface";
import { CardDragDropComponent } from "../card-drag-drop/card-drag-drop.component";

@Component({
	selector: "app-topic-item",
	standalone: true,
	imports: [CommonModule, NgStyle, NgClass, CardDragDropComponent],
	templateUrl: "./topic-item.component.html",
})
export class TopicItemComponent {
	@Input() topic!: Topic;
	@Input() level = 0;
	@Input() expandedTopics!: Map<string, boolean>;

	isHovered = false;

	@Output() toggle = new EventEmitter<string>();

	toggleTopic(topicId: string): void {
		this.toggle.emit(topicId);
	}

	isExpanded(topicId: string): boolean {
		return this.expandedTopics.get(topicId) || false;
	}
}
