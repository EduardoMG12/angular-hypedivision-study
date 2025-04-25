import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

interface Challenge {
	subtitle: string;
	description: string;
}

@Component({
	selector: "app-challenge-card",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./challenge-card.component.html",
	styleUrls: ["./challenge-card.component.css"],
})
export class ChallengeCardComponent {
	@Input() challenges: Challenge[] = [];
}
