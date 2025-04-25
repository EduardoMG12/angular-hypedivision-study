import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SvgStrokeDirective } from '../../../directive/svg-stroke.directive';

@Component({
  selector: 'app-book-mark-icon',
  standalone: true,
	imports: [CommonModule, SvgStrokeDirective],
  templateUrl: './book-mark-icon.component.html',
  styleUrl: './book-mark-icon.component.css'
})
export class BookMarkIconComponent {
  @Input() stroke = "#FAFAFA";
}
