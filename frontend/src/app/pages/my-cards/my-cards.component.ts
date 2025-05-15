import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
// Importe Card e Topic E CardSimple do mesmo lugar
import type {
	Card,
	Topic,
	CardSimple, // <-- ADICIONE AQUI
} from "../../common/api/interfaces/my-cards-list.interface";
import { ActivatedRoute, Data } from "@angular/router";
import { EmptyCardLibraryComponent } from "../../components/empty-card-library/empty-card-library.component";
import { CardListComponent } from "../../components/card-list/card-list.component";
import { FormularyCreateCardComponent } from "../../components/formulary-create-card/formulary-create-card.component";
import { trigger, transition, style, animate } from "@angular/animations";
import { ArrowLeftIconComponent } from "../../components/icons/arrow-left-icon/arrow-left-icon.component";
// Importe HttpClient para o service (exemplo, ajuste se usar outra coisa)
import { HttpClient } from "@angular/common/http";
import { CardService } from "../../services/requests/card/card.service";
import { MyCardsResolvedData } from "../../resolver/requests/my-cards-data/my-card-data.service";
import { TopicService } from "../../services/topic/topic.service";
import { Observable } from "rxjs"; // Importe Observable

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
	expandCardsWithoutTags = false;

	cardsWithoutTags: Card[] = [];

	showListContent = true;
	showFormContent = false;

	constructor(
		private route: ActivatedRoute,
		private cardService: CardService,
		private topicService: TopicService,
		private http: HttpClient, // Exemplo de injeção de HttpClient se seu service o usa
	) {}

	ngOnInit(): void {
		this.route.data.subscribe((data: Data) => {
			const resolvedData = data[
				// biome-ignore lint/complexity/useLiteralKeys: <explanation>
				"myCardsDataRequest"
			] as MyCardsResolvedData | null;

			if (resolvedData) {
				this.topics = Array.isArray(resolvedData.topics)
					? resolvedData.topics
					: [];
				this.cardsWithoutTags = Array.isArray(resolvedData.cardsWithoutTags)
					? resolvedData.cardsWithoutTags
					: [];
				this.initializeExpandedState(this.topics);
			} else {
				console.error("No resolved data received");
				this.topics = [];
				this.cardsWithoutTags = [];
				this.expandedTopics = new Map<string, boolean>();
			}

			this.showListContent = true;
			this.showFormContent = false;

			console.log("Topics:", this.topics, "Length:", this.topics.length);
			console.log(
				"Cards without tags:",
				this.cardsWithoutTags,
				"Length:",
				this.cardsWithoutTags.length,
			);
		});
	}

	// Função para lidar com o drop do card no MyCardsComponent
	handleCardDropped(event: {
		cardId: string;
		originalTopicId: string | undefined;
		targetTopicId: string;
	}): void {
		console.log("Card Dropped Event Received in MyCardsComponent:", event);
		const { cardId, originalTopicId, targetTopicId } = event;

		// 1. Opcional: Lógica de atualização otimista (atualizar UI antes da API)
		// Se você não precisa de feedback visual imediato, pule esta parte
		// e confie na recarga dos dados após a API.

		// 2. Chamar o serviço de API para persistir a mudança
		// VERIFIQUE SE O NOME DO MÉTODO E A ASSINATURA CORRESPONDEM AO SEU CardService REAL
		this.cardService
			.moveCardToTopic(cardId, targetTopicId, originalTopicId)
			.subscribe({
				next: () => {
					console.log("Movimento de card persistido com sucesso na API.");
					// 3. Recarregar os dados para refletir a mudança do backend
					this.loadCardsWithoutTags();
					this.topicService.getTopics().subscribe({
						next: (topics) => {
							this.topics = Array.isArray(topics) ? topics : [];
							this.initializeExpandedState(this.topics);
						},
						error: (error) => {
							console.error("Erro ao recarregar tópicos após drop:", error);
							// Opcional: Lógica de rollback se a API falhar após atualização otimista
						},
					});
				},
				error: (error) => {
					console.error("Erro ao persistir movimento do card na API:", error);
					// Opcional: Lógica de rollback se a API falhar após atualização otimista
				},
			});
	}

	loadCardsWithoutTags(): void {
		this.cardService.findAllWithoutTags().subscribe({
			next: (cards) => {
				this.cardsWithoutTags = Array.isArray(cards) ? cards : [];
				console.log(
					"Updated cards without tags:",
					this.cardsWithoutTags,
					"Length:",
					this.cardsWithoutTags.length,
				);
			},
			error: (error) => {
				// Adicionado tipo explícito para 'error'
				console.error("Erro ao carregar cards sem tags:", error);
				this.cardsWithoutTags = [];
			},
		});
	}

	goToCreateCardForm(): void {
		this.showListContent = false;
	}

	goBackMyCards(): void {
		this.showFormContent = false;
		// Recarregar ambas as listas ao voltar da criação
		this.loadCardsWithoutTags();
		this.topicService.getTopics().subscribe({
			next: (topics) => {
				this.topics = Array.isArray(topics) ? topics : [];
				this.initializeExpandedState(this.topics);
			},
			error: (error: any) =>
				console.error("Erro ao recarregar tópicos:", error), // Adicionado tipo explícito
		});
	}

	onAnimationDone(event: any, section: "list" | "form"): void {
		if (event.fromState !== "void" && event.toState === "void") {
			if (section === "list") {
				this.showFormContent = true;
			} else if (section === "form") {
				this.showListContent = true;
			}
		}
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

		this.expandCardsWithoutTags = this.allExpanded;
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

	onCardSaved(): void {
		console.log("rodou o onCardSaved");
		// Recarregar ambas as listas após salvar um novo card
		this.loadCardsWithoutTags();
		this.topicService.getTopics().subscribe({
			next: (topics) => {
				this.topics = Array.isArray(topics) ? topics : [];
				this.initializeExpandedState(this.topics);
			},
			error: (error) => {
				// Adicionado tipo explícito
				console.log("Erro ao carregar topicos:", error);
			},
		});
	}

	// Método placeholder para o serviço de mover card na API - VOCÊ PRECISA IMPLEMENTAR ISSO NO SEU CardService
	// EXEMPLO de como pode ser no CardService:
	// import { HttpClient } from '@angular/common/http';
	// @Injectable({ ... })
	// export class CardService {
	//   constructor(private http: HttpClient) {}
	//   moveCardToTopic(cardId: string, targetTopicId: string, originalTopicId: string | undefined): Observable<any> {
	//      return this.http.put(`/api/cards/${cardId}/move`, { targetTopicId, originalTopicId });
	//      // Ou POST, PATCH, dependendo da sua API
	//   }
	//   // ... outros métodos ...
	// }
}
