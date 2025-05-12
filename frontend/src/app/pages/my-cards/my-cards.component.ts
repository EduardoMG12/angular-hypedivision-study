// src/app/my-cards/my-cards.component.ts

// Remova a definição manual da interface Data se você já está importando de @angular/router
// interface Data {
//   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//   [key: string]: any;
// }

import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { TopicItemComponent } from "../../components/topic-item/topic-item.component"; // Importe o componente recursivo
import type { Topic } from "../../common/api/interfaces/my-cards-list.interface";
import { ActivatedRoute, Data } from "@angular/router"; // <--- Certifique-se de que 'Data' é importado daqui

@Component({
	selector: "app-my-cards",
	standalone: true,
	imports: [CommonModule, SideBarComponent, TopicItemComponent],
	templateUrl: "./my-cards.component.html",
	styleUrl: "./my-cards.component.css",
})
export class MyCardsComponent implements OnInit {
	topics: Topic[] = [];
	expandedTopics: Map<string, boolean> = new Map<string, boolean>();
	allExpanded = false;

	constructor(private route: ActivatedRoute) {}

	ngOnInit(): void {
		// Obtenha os dados 'topics' resolvidos pela rota
		this.route.data.subscribe((data: Data) => {
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			const resolvedTopics = data["topics"] as Topic[] | null; // 'topics' é a chave que você usou no resolver
			if (resolvedTopics) {
				// Verifique se não é null (caso o resolver tenha redirecionado)
				this.topics = resolvedTopics;
				this.initializeExpandedState(this.topics);
			}
			// Não é necessário lidar com o caso de topics ser vazio aqui,
			// pois o resolver já teria redirecionado.
		});
	}

	/**
	 * Percorre recursivamente todos os tópicos e define o estado inicial (colapsado).
	 * @param topics A lista de tópicos a serem inicializados.
	 */
	private initializeExpandedState(topics: Topic[]): void {
		// biome-ignore lint/complexity/noForEach: <explanation>
		topics.forEach((topic) => {
			this.expandedTopics.set(topic.id, false);
			if (topic.children && topic.children.length > 0) {
				this.initializeExpandedState(topic.children);
			}
		});
	}

	/**
	 * Alterna o estado expandido/colapsado de um tópico específico.
	 * @param topicId O ID do tópico a ser alternado.
	 */
	toggleTopic(topicId: string): void {
		const currentState = this.expandedTopics.get(topicId) || false;
		this.expandedTopics.set(topicId, !currentState);
	}

	/**
	 * Verifica se um tópico está expandido.
	 * @param topicId O ID do tópico a ser verificado.
	 * @returns True se o tópico estiver expandido, false caso contrário.
	 */
	isExpanded(topicId: string): boolean {
		return this.expandedTopics.get(topicId) || false;
	}

	/**
	 * Alterna o estado de todos os tópicos (abrir todos / fechar todos).
	 */
	toggleAllTopics(): void {
		this.allExpanded = !this.allExpanded;
		this.setExpandedStateForAll(this.topics, this.allExpanded);
	}

	/**
	 * Define o estado expandido/colapsado para todos os tópicos recursivamente.
	 * @param topics A lista de tópicos para aplicar o estado.
	 * @param state O estado (true para expandir, false para colapsar).
	 */
	private setExpandedStateForAll(topics: Topic[], state: boolean): void {
		// biome-ignore lint/complexity/noForEach: <explanation>
		topics.forEach((topic) => {
			this.expandedTopics.set(topic.id, state);
			if (topic.children && topic.children.length > 0) {
				this.setExpandedStateForAll(topic.children, state);
			}
		});
	}
}
