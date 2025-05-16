import { CommonModule } from "@angular/common";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import type {
	Card,
	CardSimple,
	Topic,
	MoveCardDto,
	MoveTopicDto,
} from "../../common/api/interfaces/my-cards-list.interface";
import { ActivatedRoute, Data } from "@angular/router";
import { EmptyCardLibraryComponent } from "../../components/empty-card-library/empty-card-library.component";
import { CardListComponent } from "../../components/card-list/card-list.component";
import { FormularyCreateCardComponent } from "../../components/formulary-create-card/formulary-create-card.component";
import { trigger, transition, style, animate } from "@angular/animations";
import { ArrowLeftIconComponent } from "../../components/icons/arrow-left-icon/arrow-left-icon.component";
import { HttpClient } from "@angular/common/http";
import { CardService } from "../../services/requests/card/card.service";
import { MyCardsResolvedData } from "../../resolver/requests/my-cards-data/my-card-data.service";
import { TopicService } from "../../services/topic/topic.service";

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

	cardsWithoutTags: (Card | CardSimple)[] = [];

	showListContent = true;
	showFormContent = false;

	private pendingMove: {
		cardId?: string;
		tagId?: string;
		originalTopicId?: string | null;
		targetTopicId?: string | null;
		card?: Card | CardSimple;
		originalParentId?: string | null;
		targetParentId?: string | null;
	} | null = null;

	constructor(
		private route: ActivatedRoute,
		private cardService: CardService,
		private topicService: TopicService,
		private http: HttpClient,
		private cdr: ChangeDetectorRef,
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
					? (resolvedData.cardsWithoutTags as (Card | CardSimple)[])
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

	private findCard(
		cardId: string,
		topics: Topic[],
		cardsWithoutTags: (Card | CardSimple)[],
	): (Card | CardSimple) | undefined {
		const cardInWithoutTags = cardsWithoutTags.find(
			(card) => card.id === cardId,
		);
		if (cardInWithoutTags) return cardInWithoutTags;

		const findInTopics = (
			topicList: Topic[],
		): (Card | CardSimple) | undefined => {
			for (const topic of topicList) {
				if (topic.cards) {
					const cardInTopic = topic.cards.find((card) => card.id === cardId);
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

	private findTopic(tagId: string, topics: Topic[]): Topic | undefined {
		for (const topic of topics) {
			if (topic.id === tagId) return topic;
			if (topic.children && topic.children.length > 0) {
				const foundInChildren = this.findTopic(tagId, topic.children);
				if (foundInChildren) return foundInChildren;
			}
		}
		return undefined;
	}

	private removeCardFromOriginalLocation(
		cardId: string,
		originalTopicId: string | undefined | null,
		topics: Topic[],
		cardsWithoutTags: (Card | CardSimple)[],
	): (Card | CardSimple) | undefined {
		let removedCard: (Card | CardSimple) | undefined = undefined;

		if (originalTopicId === undefined || originalTopicId === null) {
			const foundIndex = cardsWithoutTags.findIndex(
				(card) => card.id === cardId,
			);
			if (foundIndex > -1) {
				const [removed] = cardsWithoutTags.splice(foundIndex, 1);
				removedCard = removed;
				console.log(`Card ${cardId} removido de cardsWithoutTags.`);
			} else {
				console.warn(
					`Card with ID ${cardId} not found in cardsWithoutTags for removal.`,
				);
			}
		} else {
			const findAndRemoveInTopics = (
				topicList: Topic[],
			): (Card | CardSimple) | undefined => {
				for (const topic of topicList) {
					if (topic.id === originalTopicId && topic.cards) {
						const foundCardIndex = topic.cards.findIndex(
							(card) => card.id === cardId,
						);
						if (foundCardIndex > -1) {
							const [card] = topic.cards.splice(foundCardIndex, 1);
							console.log(
								`Card ${cardId} removido do tópico ${originalTopicId}.`,
							);
							return card;
						}
						console.warn(
							`Card with ID ${cardId} not found in topic ${originalTopicId}'s cards for removal.`,
						);
					}
					if (topic.children && topic.children.length > 0) {
						const foundInChildren = findAndRemoveInTopics(topic.children);
						if (foundInChildren) return foundInChildren;
					}
				}
				return undefined;
			};
			removedCard = findAndRemoveInTopics(topics);
		}

		return removedCard;
	}

	private addCardToTargetLocation(
		card: Card | CardSimple,
		targetTopicId: string | undefined | null,
		topics: Topic[],
		cardsWithoutTags: (Card | CardSimple)[],
	): boolean {
		if (!card) {
			console.error("Attempted to add a null/undefined card.");
			return false;
		}

		if (targetTopicId === undefined || targetTopicId === null) {
			const alreadyExists = cardsWithoutTags.some((c) => c.id === card.id);
			if (!alreadyExists) {
				cardsWithoutTags.push(card);
				console.log(`Card ${card.id} adicionado a cardsWithoutTags.`);
				return true;
			}
			console.warn(
				`Card ${card.id} já existe em cardsWithoutTags. Pulando adição.`,
			);
			return false;
		}

		const findTopicAndAdd = (topicList: Topic[]): Topic | undefined => {
			for (const topic of topicList) {
				if (topic.id === targetTopicId) {
					if (!topic.cards) topic.cards = [];
					const alreadyExists = topic.cards.some((c) => c.id === card.id);
					if (!alreadyExists) {
						topic.cards.push(card);
						console.log(
							`Card ${card.id} adicionado ao tópico ${targetTopicId}.`,
						);
						return topic;
					}
					console.warn(
						`Card ${card.id} já existe no tópico ${targetTopicId}. Pulando adição.`,
					);
					return undefined;
				}
				if (topic.children && topic.children.length > 0) {
					const foundInChildren = findTopicAndAdd(topic.children);
					if (foundInChildren) return foundInChildren;
				}
			}
			return undefined;
		};
		const targetTopic = findTopicAndAdd(topics);
		return (
			!!targetTopic && targetTopic.cards?.some((c) => c.id === card.id) === true
		);
	}

	private removeTopicFromOriginalLocation(
		tagId: string,
		originalParentId: string | undefined | null,
		topics: Topic[],
	): Topic | undefined {
		if (originalParentId === undefined || originalParentId === null) {
			const foundIndex = topics.findIndex((t) => t.id === tagId);
			if (foundIndex > -1) {
				const [removed] = topics.splice(foundIndex, 1);
				console.log(`Tópico ${tagId} removido de tópicos de nível superior.`);
				return removed;
			}
			console.warn(
				`Tópico ${tagId} não encontrado em tópicos de nível superior para remoção.`,
			);
			return undefined;
		}

		const findAndRemoveInTopics = (topicList: Topic[]): Topic | undefined => {
			for (const topic of topicList) {
				if (topic.id === originalParentId && topic.children) {
					const foundIndex = topic.children.findIndex((t) => t.id === tagId);
					if (foundIndex > -1) {
						const [removed] = topic.children.splice(foundIndex, 1);
						console.log(
							`Tópico ${tagId} removido do tópico pai ${originalParentId}.`,
						);
						return removed;
					}
					console.warn(
						`Tópico ${tagId} não encontrado nos filhos do tópico ${originalParentId}.`,
					);
				}
				if (topic.children && topic.children.length > 0) {
					const foundInChildren = findAndRemoveInTopics(topic.children);
					if (foundInChildren) return foundInChildren;
				}
			}
			return undefined;
		};
		return findAndRemoveInTopics(topics);
	}

	private addTopicToTargetLocation(
		topic: Topic,
		targetParentId: string | undefined | null,
		topics: Topic[],
		position?: number,
	): boolean {
		if (!topic) {
			console.error("Attempted to add a null/undefined topic.");
			return false;
		}

		if (targetParentId === undefined || targetParentId === null) {
			const alreadyExists = topics.some((t) => t.id === topic.id);
			if (!alreadyExists) {
				if (
					position !== undefined &&
					position >= 0 &&
					position <= topics.length
				) {
					topics.splice(position, 0, topic);
				} else {
					topics.push(topic);
				}
				console.log(
					`Tópico ${topic.id} adicionado a tópicos de nível superior.`,
				);
				return true;
			}
			console.warn(
				`Tópico ${topic.id} já existe em tópicos de nível superior. Pulando adição.`,
			);
			return false;
		}

		const findTopicAndAdd = (topicList: Topic[]): Topic | undefined => {
			for (const parent of topicList) {
				if (parent.id === targetParentId) {
					if (!parent.children) parent.children = [];
					const alreadyExists = parent.children.some((t) => t.id === topic.id);
					if (!alreadyExists) {
						if (
							position !== undefined &&
							position >= 0 &&
							position <= parent.children.length
						) {
							parent.children.splice(position, 0, topic);
						} else {
							parent.children.push(topic);
						}
						console.log(
							`Tópico ${topic.id} adicionado ao tópico pai ${targetParentId}.`,
						);
						return parent;
					}
					console.warn(
						`Tópico ${topic.id} já existe nos filhos do tópico ${targetParentId}. Pulando adição.`,
					);
					return undefined;
				}
				if (parent.children && parent.children.length > 0) {
					const foundInChildren = findTopicAndAdd(parent.children);
					if (foundInChildren) return foundInChildren;
				}
			}
			return undefined;
		};
		const targetParent = findTopicAndAdd(topics);
		return (
			!!targetParent &&
			targetParent.children?.some((t) => t.id === topic.id) === true
		);
	}

	handleCardDropped(event: MoveCardDto): void {
		console.log("Card Dropped Event Received in MyCardsComponent:", event);
		const { cardId, originalTopicId, targetTopicId } = event;

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
			console.log(
				`Attempted to drop card ${cardId} in the same topic ${originalTopicId}. No action needed.`,
			);
			return;
		}

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

		const addedSuccessfully = this.addCardToTargetLocation(
			cardToMove,
			targetTopicId,
			this.topics,
			this.cardsWithoutTags,
		);

		if (!addedSuccessfully) {
			console.error(
				`Falha ao adicionar card ${cardId} otimisticamente ao destino ${targetTopicId || "Sem Tag"}. Revertendo remoção.`,
			);
			this.addCardToTargetLocation(
				cardToMove,
				originalTopicId,
				this.topics,
				this.cardsWithoutTags,
			);
			return;
		}

		this.pendingMove = {
			cardId,
			originalTopicId,
			targetTopicId,
			card: cardToMove,
		};

		this.cardService
			.moveCardToTopic(cardId, targetTopicId, originalTopicId)
			.subscribe({
				next: () => {
					console.log("Movimento de card persistido com sucesso na API.");
					this.pendingMove = null;
				},
				error: (error: any) => {
					console.error("Erro ao persistir movimento do card na API:", error);
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

						const cardToRollback = this.removeCardFromOriginalLocation(
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							movedCardId!,
							target,
							this.topics,
							this.cardsWithoutTags,
						);

						if (cardToRollback) {
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
						this.pendingMove = null;
					}

					alert("Falha ao mover o card. Por favor, tente novamente.");
				},
			});
	}

	handleTopicDropped(event: MoveTopicDto): void {
		console.log("Topic Dropped Event Received in MyCardsComponent:", event);
		const { topicId, originalParentId, targetParentId } = event;

		if (
			(originalParentId === undefined || originalParentId === null) &&
			(targetParentId === undefined || targetParentId === null)
		) {
			console.log(
				"Attempted to drop topic in the same location (top-level to top-level). No action needed.",
			);
			return;
		}
		if (originalParentId === targetParentId) {
			console.log(
				`Attempted to drop topic ${topicId} in the same parent ${originalParentId}. No action needed.`,
			);
			return;
		}

		const topicToMove = this.removeTopicFromOriginalLocation(
			topicId,
			originalParentId,
			this.topics,
		);

		if (!topicToMove) {
			console.error(
				`Falha ao encontrar tópico com ID ${topicId} para remoção otimista na origem ${originalParentId || "top-level"}.`,
			);
			return;
		}

		const addedSuccessfully = this.addTopicToTargetLocation(
			topicToMove,
			targetParentId,
			this.topics,
		);

		if (!addedSuccessfully) {
			console.error(
				`Falha ao adicionar tópico ${topicId} otimisticamente ao destino ${targetParentId || "top-level"}. Revertendo remoção.`,
			);
			this.addTopicToTargetLocation(topicToMove, originalParentId, this.topics);
			return;
		}

		this.pendingMove = {
			tagId: topicId,
			originalParentId,
			targetParentId,
		};

		this.topicService.moveTag({ tagId: topicId, targetParentId }).subscribe({
			next: () => {
				console.log("Movimento de tópico persistido com sucesso na API.");
				this.pendingMove = null;
				this.cdr.markForCheck();
			},
			error: (error: any) => {
				console.error("Erro ao persistir movimento do tópico na API:", error);
				console.warn("Falha na chamada da API. Revertendo atualização da UI.");

				if (this.pendingMove) {
					const {
						tagId: movedTopicId,
						originalParentId: original,
						targetParentId: target,
					} = this.pendingMove;

					const topicToRollback = this.removeTopicFromOriginalLocation(
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						movedTopicId!,
						target,
						this.topics,
					);

					if (topicToRollback) {
						this.addTopicToTargetLocation(
							topicToRollback,
							original,
							this.topics,
						);
						console.log(
							`Rolled back topic ${movedTopicId} de volta para ${original || "top-level"}.`,
						);
					} else {
						console.error(
							`Falha catastrófica no rollback: Não foi possível encontrar o tópico ${movedTopicId} na localização de destino ${target || "top-level"} durante a reversão.`,
						);
						console.warn(
							"Fallback: Forçando recarga completa dos dados após falha crítica no rollback.",
						);
						this.loadCardsWithoutTags();
						this.topicService.getTopics().subscribe({
							next: (topics) => {
								this.topics = Array.isArray(topics) ? topics : [];
								this.initializeExpandedState(this.topics);
								this.cdr.markForCheck();
							},
							error: (err) =>
								console.error("Erro durante a recarga de fallback:", err),
						});
					}
					this.pendingMove = null;
				}

				alert("Falha ao mover o tópico. Por favor, tente novamente.");
			},
		});
	}

	loadCardsWithoutTags(): void {
		this.cardService.findAllWithoutTags().subscribe({
			next: (cards) => {
				this.cardsWithoutTags = Array.isArray(cards)
					? (cards as (Card | CardSimple)[])
					: [];
				console.log(
					"Updated cards without tags:",
					this.cardsWithoutTags,
					"Length:",
					this.cardsWithoutTags.length,
				);
				this.cdr.markForCheck();
			},
			error: (error: any) => {
				console.error("Erro ao carregar cards sem tags:", error);
				this.cardsWithoutTags = [];
				this.cdr.markForCheck();
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
				this.initializeExpandedState(this.topics);
				this.cdr.markForCheck();
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
		this.expandedTopics = new Map(this.expandedTopics);
	}

	toggleTopic(tagId: string): void {
		const currentState = this.expandedTopics.get(tagId) || false;
		this.expandedTopics = new Map(
			this.expandedTopics.set(tagId, !currentState),
		);
		this.cdr.markForCheck();
	}

	toggleAllTopics(): void {
		this.allExpanded = !this.allExpanded;
		this.setExpandedStateForAll(this.topics, this.allExpanded);
		this.expandCardsWithoutTags = this.allExpanded;
		this.expandedTopics = new Map(this.expandedTopics);
		this.cdr.markForCheck();
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
				this.cdr.markForCheck();
			},
			error: (error: any) => {
				console.log("Erro ao carregar topicos:", error);
			},
		});
	}
}
