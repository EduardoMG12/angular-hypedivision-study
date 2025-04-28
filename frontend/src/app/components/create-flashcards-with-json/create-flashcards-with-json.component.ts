// biome-ignore lint/style/useImportType: <explanation>
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { SideBarComponent } from "../side-bar/side-bar.component";
import { ArrowLeftIconComponent } from "../icons/arrow-left-icon/arrow-left-icon.component";
import { FormsModule } from "@angular/forms";

interface Card {
	question: string;
	answer: string;
	type: "flip" | "multiple-choice";
	alternatives?: string[];
	correctAlternative?: number;
}

interface Deck {
	name: string;
	description: string;
	cards: Card[];
}

@Component({
	selector: "app-create-flashcards-with-json",
	standalone: true,
	imports: [ArrowLeftIconComponent, FormsModule],
	templateUrl: "./create-flashcards-with-json.component.html",
	styleUrl: "./create-flashcards-with-json.component.css",
})
export class CreateFlashcardsWithJsonComponent implements OnInit {
	ngOnInit(): void {}

	jsonString = "";

	@Output() cancel = new EventEmitter<void>();
	@Output() import = new EventEmitter();

	onImport() {
		try {
			const parsedJson = JSON.parse(this.jsonString);
			this.import.emit(parsedJson);
		} catch (error) {
			console.error("Invalid JSON:", error);
		}
	}

	onCancel() {
		this.cancel.emit();
	}
}
