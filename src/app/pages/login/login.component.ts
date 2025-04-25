import { Component } from "@angular/core";
import { FormularyLoginComponent } from "../../components/formulary-login/formulary-login.component";

@Component({
	selector: "app-login",
	imports: [FormularyLoginComponent],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.css",
})
export class LoginComponent {}
