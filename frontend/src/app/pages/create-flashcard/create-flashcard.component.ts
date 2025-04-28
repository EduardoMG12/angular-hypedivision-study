import { Component } from "@angular/core";

import { trigger, transition, style, animate } from "@angular/animations";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { RobotIconComponent } from "../../components/icons/robot-icon/robot-icon.component";
import { ImportIconComponent } from "../../components/icons/import-icon/import-icon.component";
import { PlusIconComponent } from "../../components/icons/plus-icon/plus-icon.component";
import { EyeIconComponent } from "../../components/icons/eye-icon/eye-icon.component";
import { CreateFlashcardsWithJsonComponent } from "../../components/create-flashcards-with-json/create-flashcards-with-json.component";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-create-flashcards",
	standalone: true,
	imports: [
		CommonModule,
		SideBarComponent,
		RobotIconComponent,
		ImportIconComponent,
		PlusIconComponent,
		EyeIconComponent,
		CreateFlashcardsWithJsonComponent,
	],
	templateUrl: "./create-flashcard.component.html",
	styleUrls: ["./create-flashcard.component.css"],
	animations: [
		trigger("slideAnimation", [
			transition(":leave", [
				style({ opacity: 1 }),
				animate("250ms ease-in", style({ opacity: 0 })),
			]),
			transition(":enter", [
				style({ opacity: 0 }),
				animate("150ms ease-out", style({ opacity: 1 })),
			]),
		]),
		trigger("slideInFromRight", [
			transition(":leave", [
				style({ opacity: 1 }),
				animate("250ms ease-in", style({ opacity: 0 })),
			]),
			transition(":enter", [
				style({ opacity: 0 }),
				animate("150ms ease-out", style({ opacity: 1 })),
			]),
		]),
	],
})
export class CreateFlashcardComponent {
	showJsonImport = false;

	toggleJsonImport() {
		this.showJsonImport = !this.showJsonImport;
	}

	onJsonImportCancelled() {
		this.showJsonImport = false;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onJsonImported(jsonData: any) {
		this.showJsonImport = false;
	}
}
