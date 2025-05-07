import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { InputComponent } from "../input/input.component";
import { InputPasswordComponent } from "../input-password/input-password.component";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "app-formulary-login",
	standalone: true,
	imports: [
		CommonModule,
		InputComponent,
		InputPasswordComponent,
		CheckboxComponent,
		FormsModule
	],
	templateUrl: "./formulary-login.component.html",
	styleUrls: ["./formulary-login.component.css"],
})
export class FormularyLoginComponent {
	email = "";
	password = "";
	checkbox = false;
	errorMessage!: string;

	constructor(private authService: AuthService, private router: Router) {}

	onSubmit(): void {
		if (this.email && this.password) {
		  const credentials = {
			email: this.email,
			password: this.password,
		  };
		  console.log("rodou o on submit")
	
		  this.authService.login(credentials).subscribe({
			next: (response) => {
			  console.log("Login bem-sucedido!", response);
			  this.router.navigate(["/home"]); 
			},
			error: (error) => {
			  console.error("Erro no login:", error);
			  this.errorMessage = "Credenciais inválidas. Por favor, tente novamente.";
			  
			},
		  });
		} else {
		  this.errorMessage = "Por favor, preencha todos os campos.";
		}
	  }
}
