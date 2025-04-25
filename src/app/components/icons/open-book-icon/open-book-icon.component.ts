import { Component, Input } from '@angular/core';
import { SvgStrokeDirective } from '../../../directive/svg-stroke.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-open-book-icon',
  standalone:true,
  imports: [CommonModule, SvgStrokeDirective],
  templateUrl: './open-book-icon.component.html',
  styleUrl: './open-book-icon.component.css'
})
export class OpenBookIconComponent {
  @Input() stroke = '#9B87F5';
}
