import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common"; // Needed for common directives if any are added later
import { RouterLink } from "@angular/router"; // Needed for [routerLink]
import { OpenBookIconComponent } from "../../../icons/open-book-icon/open-book-icon.component"; // Adjust path
import { PlusIconComponent } from "../../../icons/plus-icon/plus-icon.component"; // Adjust path

@Component({
	selector: "app-empty-card-library",
	standalone: true,
	imports: [CommonModule, RouterLink, OpenBookIconComponent, PlusIconComponent],
	templateUrl: "./empty-card-library.component.html",
	styleUrl: "./empty-card-library.component.css",
})
export class EmptyCardLibraryComponent {
	@Output() openCreateCard = new EventEmitter<void>();
}
