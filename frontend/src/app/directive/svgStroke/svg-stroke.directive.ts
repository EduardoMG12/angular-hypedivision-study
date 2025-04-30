// biome-ignore lint/style/useImportType: <explanation>
import {
	Directive,
	Input,
	ElementRef,
	Renderer2,
	OnChanges,
	SimpleChanges,
} from "@angular/core";

@Directive({
	selector: "[appSvgStroke]",
	standalone: true,
})
export class SvgStrokeDirective implements OnChanges {
	@Input("appSvgStroke") stroke = "#FAFAFA";

	constructor(
		private el: ElementRef,
		private renderer: Renderer2,
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		if (changes["stroke"]) {
			const validatedColor = this.isValidColor(this.stroke)
				? this.stroke
				: "#FAFAFA";
			this.renderer.setAttribute(
				this.el.nativeElement,
				"stroke",
				validatedColor,
			);
		}
	}

	private isValidColor(color: string): boolean {
		const validColorPattern =
			/^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$|^[a-zA-Z]+$|^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/;
		return typeof color === "string" && validColorPattern.test(color);
	}
}
