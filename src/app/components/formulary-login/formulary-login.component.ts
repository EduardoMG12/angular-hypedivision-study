import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { InputComponent } from "../input/input.component";
import { InputPasswordComponent } from "../input-password/input-password.component";
import { CheckboxComponent } from "../checkbox/checkbox.component";

@Component({
	selector: "app-formulary-login",
	standalone: true,
	imports: [
		CommonModule,
		InputComponent,
		InputPasswordComponent,
		CheckboxComponent,
	],
	templateUrl: "./formulary-login.component.html",
	styleUrls: ["./formulary-login.component.css"],
})
export class FormularyLoginComponent {
	email = "";
	password = "";
	checkbox = false;

	onSubmit() {}
}
