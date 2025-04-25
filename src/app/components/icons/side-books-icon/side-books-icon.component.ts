import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SvgStrokeDirective } from '../../../directive/svg-stroke.directive';

@Component({
  selector: 'app-side-books-icon',
  standalone:true,
  imports: [CommonModule, SvgStrokeDirective],
  templateUrl: './side-books-icon.component.html',
  styleUrl: './side-books-icon.component.css'
})
export class SideBooksIconComponent {
  @Input() stroke = '#FAFAFA';
}
