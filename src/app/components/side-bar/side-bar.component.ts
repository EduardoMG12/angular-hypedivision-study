// biome-ignore lint/style/useImportType: <explanation>
import { Component, ElementRef, ViewChild } from "@angular/core";
import { HomeIconComponent } from "../icons/home-icon/home-icon.component";
import { PlusIconComponent } from "../icons/plus-icon/plus-icon.component";
import { ChartIconComponent } from "../icons/chart-icon/chart-icon.component";
import { SettingsIconComponent } from "../icons/settings-icon/settings-icon.component";
import { SideBooksIconComponent } from "../icons/side-books-icon/side-books-icon.component";
import { OpenBookIconComponent } from "../icons/open-book-icon/open-book-icon.component";
import { ClosedBookIconComponent } from "../icons/closed-book-icon/closed-book-icon.component";

@Component({
	selector: "app-side-bar",
	standalone: true,
	imports: [
		HomeIconComponent,
		PlusIconComponent,
		ChartIconComponent,
		SettingsIconComponent,
		SideBooksIconComponent,
		ClosedBookIconComponent,
		OpenBookIconComponent,
	],
	templateUrl: "./side-bar.component.html",
	styleUrl: "./side-bar.component.css",
})
export class SideBarComponent {
	@ViewChild("sidebar") sidebar!: ElementRef<HTMLDivElement>;

	private expandTimer!: ReturnType<typeof setTimeout>;
	private retractTimer!: ReturnType<typeof setTimeout>;
	private isAnimating = false;

	isExpanded = false;

	ngAfterViewInit() {
		this.setInitialStyles();
	}

	setInitialStyles() {
		const labels = this.sidebar.nativeElement.querySelectorAll(".label");
		const flexContainers = this.sidebar.nativeElement.querySelectorAll(".flex");

		for (const label of labels) {
			const htmlLabel = label as HTMLElement;
			htmlLabel.style.opacity = "0";
			htmlLabel.style.transform = "translateX(-10px)";
			htmlLabel.style.transition = "none";
		}

		for (const flex of flexContainers) {
			const htmlFlex = flex as HTMLElement;
			htmlFlex.style.justifyContent = "center";
		}

		this.sidebar.nativeElement.style.width = "80px";
		this.sidebar.nativeElement.style.transition = "none";

		this.sidebar.nativeElement.classList.remove("expanded");
		this.isExpanded = false;
	}

	onMouseEnter() {
		clearTimeout(this.retractTimer);
		this.isAnimating = true;

		this.isExpanded = true;
		this.sidebar.nativeElement.classList.add("expanded");

		const labels = this.sidebar.nativeElement.querySelectorAll(".label");
		const flexContainers = this.sidebar.nativeElement.querySelectorAll(".flex");

		// 1. Expand sidebar
		this.sidebar.nativeElement.style.transition = "width 0.3s ease-in-out";
		this.sidebar.nativeElement.style.width = "260px";

		// 2. Align icons to left (Controlled for CSS with class expanded)
		for (const flex of flexContainers) {
			const htmlFlex = flex as HTMLElement;
			htmlFlex.style.justifyContent = "space-between";
			htmlFlex.style.transition = "justify-content 0.3s ease-in-out";
		}

		// 3. After 100ms, anime text (opacity and transform)
		this.expandTimer = setTimeout(() => {
			for (const label of labels) {
				const htmlLabel = label as HTMLElement;
				htmlLabel.style.transition =
					"opacity 0.2s ease-in-out, transform 0.2s ease-in-out";
				htmlLabel.style.opacity = "1";
				htmlLabel.style.transform = "translateX(0)";
			}
			this.isAnimating = false; // Clear animating flag after expansion
		}, 100);
	}

	onMouseLeave() {
		// Clear any pending expansion animations
		clearTimeout(this.expandTimer);
		this.isAnimating = true;
		this.isExpanded = false;
		this.sidebar.nativeElement.classList.remove("expanded");

		const labels = this.sidebar.nativeElement.querySelectorAll(".label");
		const flexContainers = this.sidebar.nativeElement.querySelectorAll(".flex");

		// 1. Decrese opacity
		for (const label of labels) {
			const htmlLabel = label as HTMLElement;
			htmlLabel.style.transition = "opacity 0.1s ease-in-out";
			htmlLabel.style.opacity = "0";
		}

		// 2. After 100ms (Opacity done), reposiciona texts
		this.retractTimer = setTimeout(() => {
			for (const label of labels) {
				const htmlLabel = label as HTMLElement;
				htmlLabel.style.transition = "transform 0.1s ease-in-out";
				htmlLabel.style.transform = "translateX(-10px)";
			}

			// 3. After 100ms (reposicionamento done), recover sidebar and centralize the icons
			this.retractTimer = setTimeout(() => {
				this.sidebar.nativeElement.style.transition = "width 0.3s ease-in-out";
				this.sidebar.nativeElement.style.width = "80px";

				// Center icons (control to CSS with class expanded removed)
				for (const flex of flexContainers) {
					const htmlFlex = flex as HTMLElement;
					htmlFlex.style.transition = "justify-content 0.3s ease-in-out";
					htmlFlex.style.justifyContent = "center";
				}
				this.isAnimating = false;
			}, 100);
		}, 100);
	}
}
