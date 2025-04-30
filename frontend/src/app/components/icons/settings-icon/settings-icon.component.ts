import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SvgStrokeDirective } from "../../../directive/svgStroke/svg-stroke.directive";

@Component({
	selector: "app-settings-icon",
	standalone: true,
	imports: [CommonModule, SvgStrokeDirective],
	templateUrl: "./settings-icon.component.html",
	styleUrl: "./settings-icon.component.css",
})
export class SettingsIconComponent {
	@Input() stroke = "#FAFAFA";
}
