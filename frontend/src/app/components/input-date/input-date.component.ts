import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-input-date",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-date.component.html',
  styleUrl: './input-date.component.css'
})
export class InputDateComponent implements OnInit {
  @Input() label = "";
  @Input() placeholder = "";
  @Input() value = "";
  @Output() valueChange = new EventEmitter<string>();

  formattedValue = "";
  private valueChanged = new Subject<string>();
  private maxLength = 10; // DD/MM/AAAA
  private currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.formatInput(this.value);
    this.valueChanged.pipe(debounceTime(300)).subscribe((newValue) => {
      this.valueChange.emit(this.unformat(newValue));
    });
  }

  onInputChange(newValue: string): void {
    const cleanedValue = newValue.replace(/\D/g, "");
    if (cleanedValue.length <= 8) {
      this.formattedValue = this.formatInput(cleanedValue);
    } else {
      this.formattedValue = this.formatInput(cleanedValue.slice(0, 8)); // Limit to 8 digits
    }
    this.valueChanged.next(this.unformat(this.formattedValue));
  }

  onKeyPress(event: KeyboardEvent): void {
    const allowedKeys = /[0-9/]/;
    if (!allowedKeys.test(event.key)) {
      event.preventDefault();
    }

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length >= this.maxLength && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();
    }
  }

  formatInput(value: string): string {
    const match = value.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
    if (match) {
      let formatted = "";
      if (match[1]) {
        formatted += match[1];
      }
      if (match[2]) {
        formatted += match[1] ? `/${match[2]}` : match[2];
      }
      if (match[3]) {
        formatted += match[2] ? `/${match[3]}` : match[3];
      }
      return formatted;
    }
    return value;
  }

  unformat(formattedValue: string): string {
    return formattedValue.replace(/\D/g, "");
  }

  validateDate(): boolean {
    const unformattedValue = this.unformat(this.formattedValue);
    if (unformattedValue.length === 8) {
      const day = parseInt(unformattedValue.substring(0, 2), 10);
      const month = parseInt(unformattedValue.substring(2, 4), 10);
      const year = parseInt(unformattedValue.substring(4, 8), 10);

      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return false;
      }

      if (month < 1 || month > 12) {
        return false;
      }

      const daysInMonth = new Date(year, month, 0).getDate();
      if (day < 1 || day > daysInMonth) {
        return false;
      }

      if (year > this.currentYear) {
        return false;
      }

      return true;
    }
    return true; // Allow incomplete dates
  }

  onBlur(): void {
    if (!this.validateDate() && this.unformat(this.formattedValue).length === 8) {
      this.formattedValue = ''; // Clear invalid date
      this.valueChange.emit('');
    }
  }
}
