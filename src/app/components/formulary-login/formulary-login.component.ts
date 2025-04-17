import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { InputPasswordComponent } from '../input-password/input-password.component';

@Component({
  selector: 'app-formulary-login',
  standalone: true,
  imports: [CommonModule, InputComponent, InputPasswordComponent],
  templateUrl: './formulary-login.component.html',
  styleUrls: ['./formulary-login.component.css']
})
export class FormularyLoginComponent {
  email = '';
  password = '';

  onSubmit() {
    console.log('Form Data:', { email: this.email, password: this.password });
  }
}