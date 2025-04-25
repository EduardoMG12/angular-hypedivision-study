import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import type { HTMLInputTypeAttribute } from "../../types/types";

@Component({
	selector: "app-input",
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: "./input.component.html",
	styleUrl: "./input.component.css",
})
export class InputComponent {
	@Input() label = "";
	@Input() type: HTMLInputTypeAttribute = "text";
	@Input() placeholder = "";
	@Input() value = "";
	@Output() valueChange = new EventEmitter<string>();

	onValueChange(newValue: string) {
		this.value = newValue;
		this.valueChange.emit(this.value);
	}
}
