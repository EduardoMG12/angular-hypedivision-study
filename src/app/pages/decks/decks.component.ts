import { Component, Inject, InjectionToken, PLATFORM_ID } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { PlusIconComponent } from "../../components/icons/plus-icon/plus-icon.component";
import { LupeIconComponent } from "../../components/icons/lupe-icon/lupe-icon.component";
import { DeckCardComponent } from "../../components/deck-card/deck-card.component";
import type { IDeckData } from "../../common/api/types/decks";
import { mockStaticDecks } from "../../common/mock/decks";
import { CommonModule, isPlatformBrowser } from "@angular/common";

@Component({
	selector: "app-decks",
	imports: [
		CommonModule,
		SideBarComponent,
		PlusIconComponent,
		LupeIconComponent,
		DeckCardComponent,
	],
	templateUrl: "./decks.component.html",
	styleUrl: "./decks.component.css",
})
export class DecksComponent {
	public decksData: IDeckData[] = mockStaticDecks;
	public isBrowser: boolean;

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {
		this.isBrowser = isPlatformBrowser(this.platformId);
	}
}
