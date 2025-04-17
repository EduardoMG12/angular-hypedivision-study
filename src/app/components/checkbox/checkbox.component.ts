import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css'
})
export class CheckboxComponent {
@Input() label =''; // Lembrar de mim
@Input() value = false;
@Input() urlLabel = ''
@Input() url = ''

@Output() valueChange = new EventEmitter<boolean>();

  onValueChange() {
    this.value = !this.value;
    this.valueChange.emit(this.value);
  }
}
