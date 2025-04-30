import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SvgStrokeDirective } from "../../../directive/svgStroke/svg-stroke.directive";

@Component({
	selector: "app-robot-icon",
	standalone: true,
	imports: [CommonModule, SvgStrokeDirective],
	templateUrl: "./robot-icon.component.html",
	styleUrl: "./robot-icon.component.css",
})
export class RobotIconComponent {
	@Input() stroke = "#ffff";
}
