import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SvgStrokeDirective } from "../../../directive/svg-stroke.directive";

@Component({
	selector: "app-home-icon",
	standalone: true,
	imports: [CommonModule, SvgStrokeDirective],
	templateUrl: "./home-icon.component.html",
	styleUrl: "./home-icon.component.css",
})
export class HomeIconComponent {
	@Input() stroke = "#FAFAFA";
}
