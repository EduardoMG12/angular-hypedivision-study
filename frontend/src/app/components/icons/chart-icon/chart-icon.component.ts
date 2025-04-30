import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SvgStrokeDirective } from "../../../directive/svgStroke/svg-stroke.directive";

@Component({
	selector: "app-chart-icon",
	standalone: true,
	imports: [CommonModule, SvgStrokeDirective],
	templateUrl: "./chart-icon.component.html",
	styleUrl: "./chart-icon.component.css",
})
export class ChartIconComponent {
	@Input() stroke = "#FAFAFA";
}
