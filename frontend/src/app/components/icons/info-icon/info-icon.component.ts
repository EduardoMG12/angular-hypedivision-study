import { Component, Input } from "@angular/core";
import { SvgStrokeDirective } from "../../../directive/svgStroke/svg-stroke.directive";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-info-icon",
	imports: [CommonModule, SvgStrokeDirective],
	templateUrl: "./info-icon.component.html",
	styleUrl: "./info-icon.component.css",
})
export class InfoIconComponent {
	@Input() stroke = "#FFFFFF";
}
