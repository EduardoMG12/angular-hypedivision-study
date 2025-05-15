// src/app/components/my-cards/my-cards.component.ts
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
	expandCardsWithoutTags = false;

	cardsWithoutTags: Card[] = [];

	showListContent = true;
	showFormContent = false;

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
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
}
