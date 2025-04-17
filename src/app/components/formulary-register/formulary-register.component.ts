import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { InputPasswordComponent } from '../input-password/input-password.component';
import { CheckboxComponent } from "../checkbox/checkbox.component";

@Component({
  selector: 'app-formulary-register',
  imports: [CommonModule, InputComponent, InputPasswordComponent, CheckboxComponent],
  standalone: true,
  templateUrl: './formulary-register.component.html',
  styleUrl: './formulary-register.component.css',
})
export class FormularyRegisterComponent {
  fullName = '';
  email = '';
  password = '';
  repeatPassword = '';
  checkbox = false;

  onSubmit() {
    console.log('Form Data:', { email: this.email, password: this.password });
  }
}
