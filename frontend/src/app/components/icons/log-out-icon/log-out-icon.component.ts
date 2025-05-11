import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SvgStrokeDirective } from "../../../directive/svgStroke/svg-stroke.directive";

@Component({
	selector: "app-log-out-icon",
	imports: [CommonModule, SvgStrokeDirective],
	templateUrl: "./log-out-icon.component.html",
	styleUrl: "./log-out-icon.component.css",
})
export class LogOutIconComponent {
	@Input() stroke = "#FFFFFF";
}
