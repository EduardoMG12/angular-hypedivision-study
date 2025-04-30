import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SvgStrokeDirective } from "../../../directive/svgStroke/svg-stroke.directive";

@Component({
	selector: "app-lupe-icon",
	imports: [CommonModule, SvgStrokeDirective],
	templateUrl: "./lupe-icon.component.html",
	styleUrl: "./lupe-icon.component.css",
})
export class LupeIconComponent {
	@Input() stroke = "#9B87F5";
}
