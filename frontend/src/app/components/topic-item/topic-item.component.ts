// src/app/components/topic-item/topic-item.component.ts

import { CommonModule, NgClass, NgStyle } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Topic } from "../../common/api/interfaces/my-cards-list.interface";

@Component({
	selector: "app-topic-item",
	standalone: true,
	imports: [CommonModule, NgStyle, NgClass], // Importe NgStyle e NgClass para os estilos dinâmicos
	templateUrl: "./topic-item.component.html",
})
export class TopicItemComponent {
	@Input() topic!: Topic;
	@Input() level = 0; // Nível de aninhamento atual, usado para preenchimento
	@Input() expandedTopics!: Map<string, boolean>; // Mapa compartilhado para gerenciar o estado expandido/colapsado

	isHovered = false;

	@Output() toggle = new EventEmitter<string>(); // Emite o ID do tópico quando ele é clicado

	toggleTopic(topicId: string): void {
		this.toggle.emit(topicId);
	}

	isExpanded(topicId: string): boolean {
		return this.expandedTopics.get(topicId) || false;
	}
}
