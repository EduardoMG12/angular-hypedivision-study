import { Component } from "@angular/core";
import { HeaderComponent } from "../../components/header/header.component";
import { CardComponent } from "../../components/card/card.component";
import { CommonModule } from "@angular/common";
import { ChallengeCardComponent } from "../../components/challenge-card/challenge-card.component";

@Component({
	selector: "app-development",
	imports: [
		CommonModule,
		HeaderComponent,
		CardComponent,
		ChallengeCardComponent,
	],
	templateUrl: "./development.component.html",
	styleUrl: "./development.component.css",
})
export class DevelopmentComponent {}
