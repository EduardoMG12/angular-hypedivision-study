import { Component, Input } from "@angular/core";
import { SvgStrokeDirective } from "../../../directive/svgStroke/svg-stroke.directive";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-import-icon",
	imports: [CommonModule, SvgStrokeDirective],
	templateUrl: "./import-icon.component.html",
	styleUrl: "./import-icon.component.css",
})
export class ImportIconComponent {
	@Input() stroke = "#FFFFFF";
}
