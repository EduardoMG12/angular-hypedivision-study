import { CommonModule, isPlatformBrowser } from "@angular/common";
import { CardStackComponent } from "../../components/card-stack/card-stack.component";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { CardWihtIconComponent } from "../../components/card-with-icon/card-with-icon.component";
import { RecentDeckCardComponent } from "../../components/recent-deck-card/recent-deck-card.component";
import { PlusIconComponent } from "../../components/icons/plus-icon/plus-icon.component";
import { RouterLink } from "@angular/router";
import { mockStaticDecks } from "../../common/mock/decks";
import { IDeckData } from "../../common/api/types/decks";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [
		CommonModule,
		SideBarComponent,
		CardStackComponent,
		CardWihtIconComponent,
		RecentDeckCardComponent,
		PlusIconComponent,
		RouterLink,
	],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.css",
})
export class HomeComponent {
	public decksData: IDeckData[] = mockStaticDecks;
	public isBrowser: boolean;
	public decksDataSliced: IDeckData[] = [];

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {
		this.isBrowser = isPlatformBrowser(this.platformId);
	}

	ngOnInit() {
		this.decksDataSliced = this.decksData.slice(0, 3);
	}
}
