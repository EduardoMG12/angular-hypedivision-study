import { Component, Inject, Input, OnInit, PLATFORM_ID } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { RouterLink } from "@angular/router";
import type { IDeckData } from "../../common/api/types/decks";

@Component({
	selector: "app-deck-card",
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: "./deck-card.component.html",
	styleUrl: "./deck-card.component.css",
})
export class DeckCardComponent implements OnInit {
	@Input() Deck!: IDeckData;

	title = "";
	resumeDescription = "";
	amountOfCards = 0;
	isBrowser!: boolean;

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {
		this.isBrowser = isPlatformBrowser(this.platformId);
	}

	ngOnInit() {
		if (this.isBrowser && this.Deck) {
			this.title = this.Deck.name;
			this.resumeDescription = this.shortenDescription(
				this.Deck.description,
				50,
			);
			this.amountOfCards = this.Deck.cards.length;
		}
	}

	private shortenDescription(description: string, maxLength: number): string {
		if (description.length <= maxLength) {
			return description;
		}
		return `${description.substring(0, maxLength - 3)}...`;
	}
}
