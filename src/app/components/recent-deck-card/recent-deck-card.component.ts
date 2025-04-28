import { Component, Inject, Input, OnInit, PLATFORM_ID } from "@angular/core";
import { IDeckData } from "../../common/api/types/decks";
import { isPlatformBrowser } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-recent-deck-card",
	standalone: true,
	imports: [RouterLink],
	templateUrl: "./recent-deck-card.component.html",
	styleUrls: ["./recent-deck-card.component.css"],
})
export class RecentDeckCardComponent implements OnInit {
	@Input() Deck!: IDeckData & { studyTime?: number };

	title = "";
	resumeDescription = "";
	amountOfCards = 0;
	isBrowser!: boolean;
	studyTime = "45 minutos";

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {
		this.isBrowser = isPlatformBrowser(this.platformId);
	}

	ngOnInit() {
		console.log("");
		console.log("");
		console.log("");
		console.log("");
		console.log("");

		console.log(this.Deck.name);
		if (this.isBrowser && this.Deck) {
			this.title = this.Deck.name;
			this.resumeDescription = this.shortenDescription(
				this.Deck.description,
				50,
			);
			this.amountOfCards = this.Deck.cards.length;
			this.studyTime = this.Deck.studyTime
				? `${this.Deck.studyTime} min`
				: "45 minutos";
			console.log("RecentDeckCardComponent ngOnInit - Deck:", this.Deck);
		}
	}

	private shortenDescription(description: string, maxLength: number): string {
		if (description.length <= maxLength) {
			return description;
		}
		return `${description.substring(0, maxLength - 3)}...`;
	}
}
