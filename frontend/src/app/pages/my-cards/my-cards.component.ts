import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import type {
	Card,
	Topic,
	CardSimple,
	MoveCardDto, // Certifique-se que CardSimple está importado
} from "../../common/api/interfaces/my-cards-list.interface";
import { ActivatedRoute, Data } from "@angular/router";
import { EmptyCardLibraryComponent } from "../../components/empty-card-library/empty-card-library.component";
import { CardListComponent } from "../../components/card-list/card-list.component";
import { FormularyCreateCardComponent } from "../../components/formulary-create-card/formulary-create-card.component";
import {
	trigger,
	transition,
	style,
	animate,
	query,
} from "@angular/animations";
import { ArrowLeftIconComponent } from "../../components/icons/arrow-left-icon/arrow-left-icon.component";
import { HttpClient } from "@angular/common/http";
import { CardService } from "../../services/requests/card/card.service";
import { MyCardsResolvedData } from "../../resolver/requests/my-cards-data/my-card-data.service";
import { TopicService } from "../../services/topic/topic.service";
import { Observable } from "rxjs";

// Importe o tipo CardDropEvent (verifique o caminho correto)

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
		// Exemplo de animação para os cards em listas (precisa ser aplicado nos containers em card-list e topic-item)
		// trigger('listAnimation', [
		//   transition('* <=> *', [ // Animações de entrada/saída ou reordenação
		//     query(':enter', [
		//       style({ opacity: 0, transform: 'translateY(-10px)' }),
		//       animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
		//     ], { optional: true }),
		//     query(':leave', [
		//       animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(10px)' }))
		//     ], { optional: true }),
		//   ])
		// ])
	],
})
export class MyCardsComponent implements OnInit {
	topics: Topic[] = [];
	expandedTopics: Map<string, boolean> = new Map<string, boolean>();
	allExpanded = false;
	expandCardsWithoutTags = false;

	// O array cardsWithoutTags deve ser capaz de conter ambos os tipos se a API os retornar
	cardsWithoutTags: (Card | CardSimple)[] = []; // <-- Ajuste o tipo do array aqui

	showListContent = true;
	showFormContent = false;

	// Mantenha o tipo Card | CardSimple para o card armazenado no movimento pendente
	private pendingMove: {
		cardId: string;
		originalTopicId: string | undefined | null;
		targetTopicId: string | undefined | null;
		card: Card | CardSimple;
	} | null = null;

	constructor(
		private route: ActivatedRoute,
		private cardService: CardService,
		private topicService: TopicService,
		private http: HttpClient,
	) {}

	ngOnInit(): void {
		this.route.data.subscribe((data: Data) => {
			const resolvedData = data[
				// biome-ignore lint/complexity/useLiteralKeys: <explanation>
				"myCardsDataRequest"
			] as MyCardsResolvedData | null;

			if (resolvedData) {
				// Garanta que a atribuição aqui lida com (Card | CardSimple)[]
				this.topics = Array.isArray(resolvedData.topics)
					? resolvedData.topics
					: [];
				// Garanta que a atribuição aqui lida com (Card | CardSimple)[]
				this.cardsWithoutTags = Array.isArray(resolvedData.cardsWithoutTags) // Se cardsWithoutTags SEMPRE retorna Card, pode manter Card[]
					? (resolvedData.cardsWithoutTags as (Card | CardSimple)[]) // Se pode retornar CardSimple, faça o cast
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

	// Helper para encontrar um card em qualquer lista (Sem Tag ou dentro de um tópico)
	// Ajuste o tipo de retorno para (Card | CardSimple) | undefined
	private findCard(
		cardId: string,
		topics: Topic[],
		cardsWithoutTags: (Card | CardSimple)[],
	): (Card | CardSimple) | undefined {
		// Ajuste o tipo do parâmetro cardsWithoutTags
		// Buscar na lista Sem Tag
		const cardInWithoutTags = cardsWithoutTags.find(
			(card) => card.id === cardId,
		); // Use card.id
		if (cardInWithoutTags) return cardInWithoutTags;

		// Buscar nos tópicos
		const findInTopics = (
			topicList: Topic[],
		): (Card | CardSimple) | undefined => {
			// Ajuste o tipo de retorno
			for (const topic of topicList) {
				// Assuma que topic.cards pode conter (Card | CardSimple)[]
				if (topic.cards) {
					// topic.cards deve ser (Card | CardSimple)[]
					const cardInTopic = topic.cards.find((card) => card.id === cardId); // Use card.id
					if (cardInTopic) return cardInTopic;
				}
				if (topic.children && topic.children.length > 0) {
					const foundInChildren = findInTopics(topic.children);
					if (foundInChildren) return foundInChildren;
				}
			}
			return undefined;
		};
		return findInTopics(topics);
	}

	// Helper para encontrar um card e removê-lo de sua localização original
	// Ajuste o tipo de retorno para (Card | CardSimple) | undefined
	private removeCardFromOriginalLocation(
		cardId: string,
		originalTopicId: string | undefined | null,
		topics: Topic[],
		cardsWithoutTags: (Card | CardSimple)[], // Ajuste o tipo do parâmetro cardsWithoutTags
	): (Card | CardSimple) | undefined {
		// Ajuste o tipo de retorno
		let removedCard: (Card | CardSimple) | undefined = undefined; // Ajuste o tipo

		if (originalTopicId === undefined || originalTopicId === null) {
			// Card está na lista 'Without Tags'
			const initialLength = cardsWithoutTags.length;
			const originalArray = this.cardsWithoutTags; // Mantenha a referência original
			// Use splice para remover e obter o item removido
			const foundIndex = originalArray.findIndex((card) => card.id === cardId);
			if (foundIndex > -1) {
				const [removed] = originalArray.splice(foundIndex, 1);
				removedCard = removed;
				console.log(`Card ${cardId} removido de cardsWithoutTags.`);
			} else {
				console.warn(
					`Card with ID ${cardId} not found in cardsWithoutTags for removal.`,
				);
			}
		} else {
			// Card está dentro de um tópico
			const findAndRemoveInTopics = (
				topicList: Topic[],
			): (Card | CardSimple) | undefined => {
				// Ajuste o tipo de retorno
				for (const topic of topicList) {
					if (topic.id === originalTopicId && topic.cards) {
						// topic.cards deve ser (Card | CardSimple)[]
						const foundCardIndex = topic.cards.findIndex(
							(card) => card.id === cardId,
						); // Use card.id
						if (foundCardIndex > -1) {
							// Remove o card deste tópico
							const [card] = topic.cards.splice(foundCardIndex, 1); // Remove e pega o card
							console.log(
								`Card ${cardId} removido do tópico ${originalTopicId}.`,
							);
							// Opcional: Decrementar topic.childrenCardsCount
							// if(topic.childrenCardsCount !== undefined) topic.childrenCardsCount--;
							return card;
						}
						console.warn(
							`Card with ID ${cardId} not found in topic ${originalTopicId}'s cards for removal.`,
						);
					}
					// Busca recursiva nos filhos
					if (topic.children && topic.children.length > 0) {
						const foundInChildren = findAndRemoveInTopics(topic.children);
						if (foundInChildren) {
							// Opcional: Decrementar childrenCardsCount nos pais ao longo do caminho
							// if(topic.childrenCardsCount !== undefined) topic.childrenCardsCount--;
							return foundInChildren;
						}
					}
				}
				return undefined; // Card não encontrado neste ramo
			};
			removedCard = findAndRemoveInTopics(topics);
		}

		// Retorna o card que foi removido, ou undefined se não encontrado
		return removedCard;
	}

	// Helper para encontrar um tópico e adicionar um card a ele, ou adicionar à lista Sem Tag
	// Ajuste o tipo do parâmetro 'card' para Card | CardSimple
	private addCardToTargetLocation(
		card: Card | CardSimple, // <-- Ajuste o tipo aqui
		targetTopicId: string | undefined | null,
		topics: Topic[],
		cardsWithoutTags: (Card | CardSimple)[], // Ajuste o tipo do parâmetro cardsWithoutTags
	): boolean {
		if (!card) {
			console.error("Attempted to add a null/undefined card.");
			return false;
		}

		if (targetTopicId === undefined || targetTopicId === null) {
			// Adicionar à lista 'Without Tags'
			// Verifica se já existe para evitar duplicatas (caso de rollback)
			const alreadyExists = cardsWithoutTags.some((c) => c.id === card.id); // Use card.id
			if (!alreadyExists) {
				this.cardsWithoutTags.push(card); // Adiciona o card ao array
				console.log(`Card ${card.id} adicionado a cardsWithoutTags.`); // Use card.id
				// Opcional: Ordenar cardsWithoutTags
				return true;
			}
			console.warn(
				`Card ${card.id} já existe em cardsWithoutTags. Pulando adição.`,
			); // Use card.id
			return false;
		}
		// Adicionar a um tópico específico
		const findTopicAndAdd = (topicList: Topic[]): Topic | undefined => {
			for (const topic of topicList) {
				if (topic.id === targetTopicId) {
					// Encontrou o tópico de destino
					// topic.cards deve ser (Card | CardSimple)[]
					if (!topic.cards) {
						topic.cards = [];
					}
					// Verifica se já existe
					const alreadyExists = topic.cards.some((c) => c.id === card.id); // Use card.id
					if (!alreadyExists) {
						topic.cards.push(card); // Adiciona o card
						console.log(
							`Card ${card.id} adicionado ao tópico ${targetTopicId}.`,
						); // Use card.id
						// Opcional: Incrementar topic.childrenCardsCount
						// Opcional: Ordenar topic.cards
						return topic;
					}
					console.warn(
						`Card ${card.id} já existe no tópico ${targetTopicId}. Pulando adição.`,
					); // Use card.id
					return undefined; // Retorna undefined, pois o card não foi adicionado
				}
				// Busca recursiva nos filhos
				if (topic.children && topic.children.length > 0) {
					const foundInChildren = findTopicAndAdd(topic.children);
					if (foundInChildren) {
						// Opcional: Incrementar childrenCardsCount nos pais
						return foundInChildren;
					}
				}
			}
			return undefined; // Tópico de destino não encontrado
		};
		const targetTopic = findTopicAndAdd(topics);
		// Retorna true se o card foi adicionado ao tópico
		// Verifica se o tópico foi encontrado E se o card está lá depois da tentativa de push
		return (
			!!targetTopic && targetTopic.cards?.some((c) => c.id === card.id) === true
		); // Use card.id
	}

	// Função principal para lidar com o drop event
	handleCardDropped(event: MoveCardDto): void {
		// Use o tipo CardDropEvent
		console.log("Card Dropped Event Received in MyCardsComponent:", event);
		const { cardId, originalTopicId, targetTopicId } = event;

		// Impede movimento se origem e destino são iguais (compara undefined/null)
		if (
			(originalTopicId === undefined || originalTopicId === null) &&
			(targetTopicId === undefined || targetTopicId === null)
		) {
			console.log(
				"Attempted to drop card in the same location (Sem Tag to Sem Tag). No action needed.",
			);
			return;
		}
		if (
			originalTopicId === targetTopicId &&
			originalTopicId !== undefined &&
			originalTopicId !== null
		) {
			// Check if original is a valid topic ID
			console.log(
				`Attempted to drop card ${cardId} in the same topic ${originalTopicId}. No action needed.`,
			);
			return;
		}

		// --- Atualização Otimista ---

		// 1. Encontrar o card na estrutura atual e removê-lo da sua localização original
		// O tipo de cardToMove será (Card | CardSimple) | undefined
		const cardToMove = this.removeCardFromOriginalLocation(
			cardId,
			originalTopicId,
			this.topics,
			this.cardsWithoutTags,
		);

		if (!cardToMove) {
			console.error(
				`Falha ao encontrar card com ID ${cardId} para remoção otimista na origem ${originalTopicId || "Sem Tag"}.`,
			);
			return;
		}

		// 2. Adicionar o card à sua nova localização na estrutura de dados
		// Passa cardToMove que é (Card | CardSimple)
		const addedSuccessfully = this.addCardToTargetLocation(
			cardToMove,
			targetTopicId,
			this.topics,
			this.cardsWithoutTags,
		);

		// Se falhou em adicionar
		if (!addedSuccessfully) {
			console.error(
				`Falha ao adicionar card ${cardId} otimisticamente ao destino ${targetTopicId || "Sem Tag"}. Revertendo remoção.`,
			);
			// Reverter a remoção: Adicionar o card de volta à localização original
			this.addCardToTargetLocation(
				cardToMove,
				originalTopicId,
				this.topics,
				this.cardsWithoutTags,
			); // Passa cardToMove, que é (Card | CardSimple)
			// Opcional: Mostrar mensagem de erro
			return; // Aborta o processo, não chama a API
		}

		// Armazenar informações para potencial rollback
		// Armazena o objeto cardToMove que é (Card | CardSimple)
		this.pendingMove = {
			cardId,
			originalTopicId,
			targetTopicId,
			card: cardToMove,
		};

		// 3. Chamar a API backend para persistir a mudança
		// O serviço espera cardId, targetTopicId, originalTopicId
		this.cardService
			.moveCardToTopic(cardId, targetTopicId, originalTopicId) // targetTopicId e originalTopicId podem ser undefined/null
			.subscribe({
				next: () => {
					console.log("Movimento de card persistido com sucesso na API.");
					this.pendingMove = null; // Sucesso, limpa o estado pendente
				},
				error: (error: any) => {
					console.error("Erro ao persistir movimento do card na API:", error);
					// --- Rollback da Atualização Otimista ---
					console.warn(
						"Falha na chamada da API. Revertendo atualização da UI.",
					);

					if (this.pendingMove) {
						const {
							cardId: movedCardId,
							originalTopicId: original,
							targetTopicId: target,
							card: movedCard,
						} = this.pendingMove;

						// Remover o card da localização de destino (onde foi colocado otimisticamente)
						// Passa movedCard que é (Card | CardSimple) para remoção
						const cardToRollback = this.removeCardFromOriginalLocation(
							movedCardId,
							target,
							this.topics,
							this.cardsWithoutTags,
						);

						if (cardToRollback) {
							// Se encontrou e removeu do destino
							// Adicionar o card de volta à sua localização original
							// Passa cardToRollback que é (Card | CardSimple) para adição
							this.addCardToTargetLocation(
								cardToRollback,
								original,
								this.topics,
								this.cardsWithoutTags,
							);
							console.log(
								`Rolled back card ${movedCardId} de volta para ${original || "Sem Tag"}.`,
							);
						} else {
							// Fallback: Se não encontrou o card no destino para remover no rollback,
							// a UI está em um estado inconsistente. Força uma recarga completa.
							console.error(
								`Falha catastrófica no rollback: Não foi possível encontrar o card ${movedCardId} na localização de destino ${target || "Sem Tag"} durante a reversão.`,
							);
							console.warn(
								"Fallback: Forçando recarga completa dos dados após falha crítica no rollback.",
							);
							this.loadCardsWithoutTags();
							this.topicService.getTopics().subscribe({
								next: (topics) => {
									this.topics = Array.isArray(topics) ? topics : [];
									this.initializeExpandedState(this.topics);
								},
								error: (err) =>
									console.error("Erro durante a recarga de fallback:", err),
							});
						}
						this.pendingMove = null; // Limpa o estado pendente
					}

					// Mostrar feedback de erro para o usuário
					alert("Falha ao mover o card. Por favor, tente novamente.");
				},
			});
	}

	loadCardsWithoutTags(): void {
		this.cardService.findAllWithoutTags().subscribe({
			next: (cards) => {
				// Garanta que a atribuição aqui lida com (Card | CardSimple)[]
				this.cardsWithoutTags = Array.isArray(cards)
					? (cards as (Card | CardSimple)[])
					: []; // Pode precisar do cast
				console.log(
					"Updated cards without tags:",
					this.cardsWithoutTags,
					"Length:",
					this.cardsWithoutTags.length,
				);
			},
			error: (error: any) => {
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
		this.loadCardsWithoutTags();
		this.topicService.getTopics().subscribe({
			next: (topics) => {
				this.topics = Array.isArray(topics) ? topics : [];
				// Para manter o estado de expansão aqui, você precisaria salvar/restaurar
				this.initializeExpandedState(this.topics);
			},
			error: (error: any) =>
				console.error("Erro ao recarregar tópicos:", error),
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
		this.expandedTopics = new Map(this.expandedTopics); // Garante detecção de mudança
	}

	toggleTopic(topicId: string): void {
		const currentState = this.expandedTopics.get(topicId) || false;
		this.expandedTopics = new Map(
			this.expandedTopics.set(topicId, !currentState),
		); // Nova instância do mapa
	}

	toggleAllTopics(): void {
		this.allExpanded = !this.allExpanded;
		this.setExpandedStateForAll(this.topics, this.allExpanded);
		this.expandCardsWithoutTags = this.allExpanded;
		this.expandedTopics = new Map(this.expandedTopics); // Nova instância do mapa
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
		this.loadCardsWithoutTags();
		this.topicService.getTopics().subscribe({
			next: (topics) => {
				this.topics = Array.isArray(topics) ? topics : [];
				this.initializeExpandedState(this.topics);
			},
			error: (error: any) => {
				console.log("Erro ao carregar topicos:", error);
			},
		});
	}
}
