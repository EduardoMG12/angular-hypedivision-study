import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SvgStrokeDirective } from '../../../directive/svg-stroke.directive';

@Component({
  selector: 'app-closed-book-icon',
  standalone:true,
  imports: [CommonModule, SvgStrokeDirective],
  templateUrl: './closed-book-icon.component.html',
  styleUrl: './closed-book-icon.component.css'
})
export class ClosedBookIconComponent {
  @Input() stroke = '#9B87F5';
}
