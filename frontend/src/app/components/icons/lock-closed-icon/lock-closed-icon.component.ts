import { Component, Input } from '@angular/core';
import { SvgStrokeDirective } from '../../../directive/svgStroke/svg-stroke.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lock-closed-icon',
  imports: [CommonModule, SvgStrokeDirective],
  templateUrl: './lock-closed-icon.component.html',
  styleUrl: './lock-closed-icon.component.css',
})
export class LockClosedIconComponent {
  @Input() stroke = '#FFFFFF';
}
