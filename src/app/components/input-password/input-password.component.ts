import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-input-password",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./input-password.component.html",
  styleUrl: "./input-password.component.css"
})
export class InputPasswordComponent {
  @Input() label = "";
  @Input() showEye = false;
  @Input() forgotLink: string | null = null;
  @Input() value = "";
  @Output() valueChange = new EventEmitter<string>();

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onValueChange(newValue: string) {
    this.value = newValue;
    this.valueChange.emit(this.value);
  }
}