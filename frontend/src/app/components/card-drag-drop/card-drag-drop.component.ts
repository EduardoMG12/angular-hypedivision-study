import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import type {
	Card,
	CardSimple,
} from "../../common/api/interfaces/my-cards-list.interface";

@Component({
	selector: "app-card-drag-drop",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./card-drag-drop.component.html",
	styleUrl: "./card-drag-drop.component.css",
})
export class CardDragDropComponent {
	@Input() card!: Card | CardSimple;
}
