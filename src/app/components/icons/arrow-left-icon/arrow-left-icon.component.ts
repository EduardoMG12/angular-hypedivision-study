import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SvgStrokeDirective } from '../../../directive/svg-stroke.directive';

@Component({
  selector: 'app-arrow-left-icon',
  imports: [CommonModule, SvgStrokeDirective],
  templateUrl: './arrow-left-icon.component.html',
  styleUrl: './arrow-left-icon.component.css'
})
export class ArrowLeftIconComponent {
@Input() stroke = "#ffff";
}
