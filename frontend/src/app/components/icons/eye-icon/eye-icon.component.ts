import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SvgStrokeDirective } from "../../../directive/svg-stroke.directive";

@Component({
	selector: "app-eye-icon",
	standalone: true,
	imports: [CommonModule, SvgStrokeDirective],
	templateUrl: "./eye-icon.component.html",
	styleUrl: "./eye-icon.component.css",
})
export class EyeIconComponent {
	@Input() stroke = "#ffffff";
}
