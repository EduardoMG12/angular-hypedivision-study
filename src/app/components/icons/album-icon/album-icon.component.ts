import { Component, Input } from '@angular/core';
import { SvgStrokeDirective } from '../../../directive/svg-stroke.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-album-icon',
  standalone: true,
	imports: [CommonModule, SvgStrokeDirective],
  templateUrl: './album-icon.component.html',
  styleUrl: './album-icon.component.css'
})
export class AlbumIconComponent {
	@Input() stroke = "#FAFAFA";
}
