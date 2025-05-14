import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import type { Topic } from "../../common/api/interfaces/my-cards-list.interface";
import { ActivatedRoute, Data } from "@angular/router";
import { EmptyCardLibraryComponent } from "../../components/empty-card-library/empty-card-library.component";
import { CardListComponent } from "../../components/card-list/card-list.component";

import { FormularyCreateCardComponent } from "../../components/formulary-create-card/formulary-create-card.component";

import { trigger, transition, style, animate } from "@angular/animations";
import { ArrowLeftIconComponent } from "../../components/icons/arrow-left-icon/arrow-left-icon.component";

import { CardService, Card } from "../../services/requests/card/card.service";
import { MyCardsResolvedData } from "../../resolver/requests/my-cards-data/my-card-data.service";

@Component({
	selector: "app-my-cards",
	standalone: true,
	imports: [
		CommonModule,
		SideBarComponent,
		EmptyCardLibraryComponent,
		CardListComponent,
		FormularyCreateCardComponent,
		ArrowLeftIconComponent,
	],
	templateUrl: "./my-cards.component.html",
	styleUrl: "./my-cards.component.css",
	animations: [
		trigger("fadeAnimation", [
			transition(":enter", [
				style({ opacity: 0 }),
				animate("300ms ease-out", style({ opacity: 1 })),
			]),
			transition(":leave", [animate("300ms ease-in", style({ opacity: 0 }))]),
		]),
	],
})
export class MyCardsComponent implements OnInit {
	topics: Topic[] = [];
	expandedTopics: Map<string, boolean> = new Map<string, boolean>();
	allExpanded = false;

	showCreateCardForm = false;

	showListContent = true;
	showFormContent = false;

	cardsWithoutTags: Card[] = [];
	showCardsWithoutTagsSection = false;

	constructor(
		private route: ActivatedRoute,
		private cardService: CardService,
	) {}

	ngOnInit(): void {
		this.route.data.subscribe((data: Data) => {
			const resolvedData = data[
				// biome-ignore lint/complexity/useLiteralKeys: <explanation>
				"myCardsDataRequest"
			] as MyCardsResolvedData | null;

			if (resolvedData) {
				this.topics = resolvedData.topics;
				this.cardsWithoutTags = resolvedData.cardsWithoutTags;
				this.showCardsWithoutTagsSection = this.cardsWithoutTags.length > 0;
				this.initializeExpandedState(this.topics);
			} else {
				this.topics = [];
				this.cardsWithoutTags = [];
				this.showCardsWithoutTagsSection = false;
				this.expandedTopics = new Map<string, boolean>();
			}

			this.showListContent = true;
			this.showFormContent = false;
		});
	}

	/**
	 * Busca os cards sem tags do backend.
	 */
	loadCardsWithoutTags(): void {
		this.cardService.findAllWithoutTags().subscribe({
			next: (cards) => {
				this.cardsWithoutTags = cards;

				this.showCardsWithoutTagsSection = this.cardsWithoutTags.length > 0;
			},
			error: (error) => {
				console.error("Erro ao carregar cards sem tags:", error);
				this.cardsWithoutTags = []; // Limpa a lista em caso de erro
				this.showCardsWithoutTagsSection = false; // Esconde a seção em caso de erro
			},
		});
	}

	/**
	 * Inicia a transição para mostrar o formulário de criação de card.
	 * Esconde a lista para iniciar a animação de saída.
	 */
	goToCreateCardForm(): void {
		this.showListContent = false; // Esconde a lista para iniciar sua animação de saída
		// showFormContent será definido como true na conclusão da animação de saída da lista
	}

	/**
	 * Inicia a transição para voltar para a lista de cards.
	 * Esconde o formulário para iniciar sua animação de saída.
	 */
	goBackMyCards(): void {
		this.showFormContent = false; // Esconde o formulário para iniciar sua animação de saída
		// showListContent será definido como true na conclusão da animação de saída do formulário
		// Opcional: Recarregar a lista de cards sem tags após salvar ou cancelar,
		// caso um card sem tag tenha sido criado ou modificado.
		this.loadCardsWithoutTags();
	}

	/**
	 * Chamado quando a animação de uma seção termina.
	 * Usado para sequenciar a exibição das seções.
	 * @param event O evento de animação.
	 * @param section A seção que terminou a animação ('list' ou 'form').
	 */

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onAnimationDone(event: any, section: "list" | "form"): void {
		// Verifica se a animação concluída foi a animação de SAÍDA (:leave)
		if (event.fromState !== "void" && event.toState === "void") {
			if (section === "list") {
				this.showFormContent = true;
			} else if (section === "form") {
				this.showListContent = true;
			}
		}
		// Se a animação concluída foi a animação de ENTRADA (:enter), não faz nada (a próxima já foi acionada)
	}

	private initializeExpandedState(topics: Topic[]): void {
		this.expandedTopics = new Map<string, boolean>();
		this.setExpandedStateForAll(topics, false);
	}

	toggleTopic(topicId: string): void {
		const currentState = this.expandedTopics.get(topicId) || false;
		this.expandedTopics.set(topicId, !currentState);
	}

	toggleAllTopics(): void {
		this.allExpanded = !this.allExpanded;
		this.setExpandedStateForAll(this.topics, this.allExpanded);
	}

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
