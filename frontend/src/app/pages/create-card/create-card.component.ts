import { Component } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { CommonModule } from "@angular/common";
import { FormularyCreateCardComponent } from "../../components/formulary-create-card/formulary-create-card.component";
import { ArrowLeftIconComponent } from "../../components/icons/arrow-left-icon/arrow-left-icon.component";

@Component({
	selector: "app-create-card",
	imports: [
		SideBarComponent,
		CommonModule,
		FormularyCreateCardComponent,
		ArrowLeftIconComponent,
	],
	templateUrl: "./create-card.component.html",
	styleUrl: "./create-card.component.css",
})
export class CreateCardComponent {}
