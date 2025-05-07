import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-input-phone',
  imports: [CommonModule, FormsModule],
  templateUrl: './input-phone.component.html',
  styleUrl: './input-phone.component.css',
})
export class InputPhoneComponent implements OnInit {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  formattedValue = '';
  private valueChanged = new Subject<string>();
  private maxLength = 15; // (XX) XXXXX-XXXX

  ngOnInit(): void {
    this.formatInput(this.value);
    this.valueChanged.pipe(debounceTime(300)).subscribe((newValue) => {
      this.valueChange.emit(this.unformat(newValue));
    });
  }

  onInputChange(newValue: string): void {
    this.formattedValue = this.formatInput(newValue);
    this.valueChanged.next(this.formattedValue);
  }

  onKeyPress(event: KeyboardEvent): void {
    const allowedKeys = /[0-9()-\s]/;
    if (!allowedKeys.test(event.key)) {
      event.preventDefault();
    }

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length >= this.maxLength && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();
    }
  }

  formatInput(value: string): string {
    const cleanedValue = value.replace(/\D/g, '');
    const match = cleanedValue.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (match) {
      let formatted = '';
      if (match[1]) {
        formatted += `(${match[1]})`;
      }
      if (match[2]) {
        formatted += ` ${match[2]}`;
      }
      if (match[3]) {
        formatted += `-${match[3]}`;
      }
      return formatted;
    }
    return value;
  }

  unformat(formattedValue: string): string {
    return formattedValue.replace(/\D/g, '');
  }
}
