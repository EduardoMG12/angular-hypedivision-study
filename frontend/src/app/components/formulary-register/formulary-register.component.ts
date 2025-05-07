import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { InputComponent } from "../input/input.component";
import { InputPasswordComponent } from "../input-password/input-password.component";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { InputDateComponent } from "../input-date/input-date.component";
import { InputPhoneComponent } from "../input-phone/input-phone.component";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-formulary-register",
  imports: [
    CommonModule,
    InputComponent,
    InputPasswordComponent,
    CheckboxComponent,
    InputDateComponent,
    InputPhoneComponent,
    FormsModule,
  ],
  standalone: true,
  templateUrl: "./formulary-register.component.html",
  styleUrl: "./formulary-register.component.css",
})
export class FormularyRegisterComponent {
  fullName = "";
  birthdate = "";
  phone = "";
  email = "";
  password = "";
  repeatPassword = "";
  accept_terms = false;
  errorMessage: string = "";

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    if (this.password !== this.repeatPassword) {
      this.errorMessage = "As senhas não coincidem.";
      return;
    }

    let formattedBirthdate = this.birthdate;
    if (this.birthdate.length === 8) {
      const day = this.birthdate.substring(0, 2);
      const month = this.birthdate.substring(2, 4);
      const year = this.birthdate.substring(4, 8);
      formattedBirthdate = `${year}-${month}-${day}`; // Formato YYYY-MM-DD
    }

    const cleanedPhone = this.phone.replace(/\D/g, '');

    const userData = {
      fullName: this.fullName,
      birthdate: formattedBirthdate,
      phone: cleanedPhone,
      email: this.email,
      password: this.password,
      accept_terms: this.accept_terms,
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log("Registro bem-sucedido!", response);
        this.router.navigate(["/home"]);
      },
      error: (error) => {
        console.error("Erro no registro:", error);
        this.errorMessage = "Erro ao registrar usuário. Por favor, tente novamente.";
        // Você pode personalizar a mensagem de erro com base na resposta do backend
      },
    });
  }
}