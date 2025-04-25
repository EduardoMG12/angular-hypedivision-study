import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SvgStrokeDirective } from '../../../directive/svg-stroke.directive';

@Component({
  selector: 'app-plus-icon',
  standalone:true,
  imports: [CommonModule, SvgStrokeDirective],
  templateUrl: './plus-icon.component.html',
  styleUrl: './plus-icon.component.css'
})
export class PlusIconComponent {
  @Input() stroke = '#FAFAFA';
}
