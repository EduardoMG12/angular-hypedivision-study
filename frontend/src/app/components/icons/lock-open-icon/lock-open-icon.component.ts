import { Component, Input } from '@angular/core';
import { SvgStrokeDirective } from '../../../directive/svgStroke/svg-stroke.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lock-open-icon',
  imports: [CommonModule, SvgStrokeDirective],
  templateUrl: './lock-open-icon.component.html',
  styleUrl: './lock-open-icon.component.css'
})
export class LockOpenIconComponent {
  @Input() stroke = '#FFFFFF';
}
