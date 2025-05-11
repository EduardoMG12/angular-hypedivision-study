import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SvgStrokeDirective } from "../../../directive/svgStroke/svg-stroke.directive";

@Component({
	selector: "app-notebook-tabs-icon",
	imports: [CommonModule, SvgStrokeDirective],
	templateUrl: "./notebook-tabs-icon.component.html",
	styleUrl: "./notebook-tabs-icon.component.css",
})
export class NotebookTabsIconComponent {
	@Input() stroke = "#D1D5DB";
}
