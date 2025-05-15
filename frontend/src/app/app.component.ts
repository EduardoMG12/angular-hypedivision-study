import { LoadingService } from "./services/loading/loading.service";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SharedLoadingComponent } from "./components/shared-loading/shared-loading.component";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, SharedLoadingComponent, CommonModule],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css",
})
export class AppComponent {
	loading = false;

	constructor(private loadingService: LoadingService) {}

	ngOnInit(): void {
		this.loadingService.isLoading$.subscribe((isLoading) => {
			this.loading = isLoading;
		});
	}
}
