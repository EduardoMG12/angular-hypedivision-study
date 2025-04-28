import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
	selector: "app-card",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./card.component.html",
	styleUrl: "./card.component.css",
})
export class CardComponent {
	@Input() title = "";
	@Input() iconTitle = "";
	@Input() text = "";
	@Input() subtitle = "";
	@Input() iconSubtitle = "";
	@Input() descriptionSubtitle = "";
	@Input() items: string[] = [];
	cardExist = false;

	ngOnInit() {
		this.cardExist =
			this.text !== "" ||
			this.subtitle !== "" ||
			this.iconSubtitle !== "" ||
			this.descriptionSubtitle !== "" ||
			this.items.length > 0;
	}
}
